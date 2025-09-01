// Fix: Changed import for Express to fix type resolution issues.
// Fix: Separated express value and type imports to resolve type conflicts.
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import type { Response as FetchResponse } from 'node-fetch';
import type { Readable } from 'stream';


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface OllamaProxyRequestBody {
    ollamaUrl: string;
    ollamaModel: string;
    stream?: boolean;
    [key: string]: any; // for other properties like 'messages' or 'prompt'
}

const ollamaProxyHandler = async (
    req: Request<{ endpoint: string }, any, OllamaProxyRequestBody>,
    res: Response
) => {
    const { endpoint } = req.params;
    const { ollamaUrl, ollamaModel, ...body } = req.body;

    if (!ollamaUrl || !['chat', 'generate', 'check'].includes(endpoint)) {
        return res.status(400).json({ error: 'Неверный URL Ollama или эндпоинт.' });
    }

    const cleanedOllamaUrl = ollamaUrl.trim().replace(/\/$/, '');

    // Special case for checking connection
    if (endpoint === 'check') {
         try {
            const response = await fetch(cleanedOllamaUrl) as FetchResponse;
            if (response.ok) {
                return res.json({ success: true, message: 'Ollama is running' });
            } else {
                return res.status(response.status).json({ success: false, message: `Ollama server responded with status: ${response.status}` });
            }
        } catch (error) {
            console.error('Proxy check connection error:', error);
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ success: false, error: `Прокси-сервер не смог подключиться к Ollama по адресу ${cleanedOllamaUrl}. Убедитесь, что он запущен. Ошибка: ${message}` });
        }
    }

    const targetUrl = `${cleanedOllamaUrl}/api/${endpoint}`;
    const requestBody = {
        model: ollamaModel,
        ...body
    };
    
    try {
        const ollamaResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }) as FetchResponse;

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            try {
                const errorJson = JSON.parse(errorText);
                return res.status(ollamaResponse.status).json({ error: errorJson.error || 'Ошибка ответа от Ollama' });
            } catch (e) {
                return res.status(ollamaResponse.status).json({ error: `Ошибка ответа от Ollama (не JSON): ${errorText}` });
            }
        }
        
        if (requestBody.stream && ollamaResponse.body) {
            res.setHeader('Content-Type', ollamaResponse.headers.get('content-type') || 'application/x-ndjson');
            
            const sourceStream = ollamaResponse.body as Readable;

            // Handle client disconnection
            req.on('close', () => {
                console.log('Client disconnected, closing stream to Ollama.');
                if (!sourceStream.destroyed) {
                    sourceStream.destroy();
                }
            });

            // Forward data chunks manually
            sourceStream.on('data', (chunk: Uint8Array) => {
                res.write(chunk);
            });

            // Handle end of stream
            sourceStream.on('end', () => {
                res.end();
            });

            // Handle errors from the source stream
            sourceStream.on('error', (err: Error) => {
                console.error('Stream error from Ollama:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Ошибка потока при чтении ответа от Ollama.' });
                } else {
                    res.end();
                }
            });
            
        } else {
            const data: any = await ollamaResponse.json();
            return res.json(data);
        }

    } catch (error) {
        console.error('Proxy request error:', error);
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: `Прокси-сервер не смог подключиться к вашему серверу Ollama по адресу ${cleanedOllamaUrl}. Убедитесь, что Ollama запущен и доступен. Ошибка: ${message}` });
    }
};

app.post('/api/ollama/:endpoint', ollamaProxyHandler);


app.listen(port, () => {
    console.log(`🚀 API-мост для EXPERT запущен на http://localhost:${port}`);
});