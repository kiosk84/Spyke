
import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch, { Response as FetchResponse } from 'node-fetch';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface OllamaProxyRequestBody {
    ollamaUrl: string;
    ollamaModel: string;
    [key: string]: any; // for other properties like 'messages' or 'prompt'
}

interface OllamaProxyParams {
    endpoint: string;
}

const ollamaProxyHandler = async (req: Request<OllamaProxyParams, any, OllamaProxyRequestBody>, res: Response) => {
    const { endpoint } = req.params;
    const { ollamaUrl, ollamaModel, ...body } = req.body;

    if (!ollamaUrl || !['chat', 'generate', 'check'].includes(endpoint)) {
        return res.status(400).json({ error: 'Неверный URL Ollama или эндпоинт.' });
    }

    // Special case for checking connection
    if (endpoint === 'check') {
         try {
            const response: FetchResponse = await fetch(ollamaUrl);
            // Ollama root returns a simple text response "Ollama is running"
            if (response.ok) {
                return res.json({ success: true, message: 'Ollama is running' });
            } else {
                return res.status(response.status).json({ success: false, message: `Ollama server responded with status: ${response.status}` });
            }
        } catch (error) {
            console.error('Proxy check connection error:', error);
            const message = error instanceof Error ? error.message : String(error);
            // Provide a more detailed error message
            return res.status(500).json({ success: false, error: `Прокси-сервер не смог подключиться к Ollama по адресу ${ollamaUrl}. Убедитесь, что он запущен. Ошибка: ${message}` });
        }
    }

    // For 'chat' and 'generate'
    const targetUrl = `${ollamaUrl}/api/${endpoint}`;
    const requestBody = {
        model: ollamaModel,
        ...body
    };
    
    try {
        const response: FetchResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                return res.status(response.status).json({ error: errorJson.error || 'Ошибка ответа от Ollama' });
            } catch (e) {
                return res.status(response.status).json({ error: `Ошибка ответа от Ollama (не JSON): ${errorText}` });
            }
        }
        
        const data: any = await response.json();
        return res.json(data);

    } catch (error) {
        console.error('Proxy request error:', error);
        const message = error instanceof Error ? error.message : String(error);
        // Provide a more detailed error message for connection failures
        res.status(500).json({ error: `Прокси-сервер не смог подключиться к вашему серверу Ollama по адресу ${ollamaUrl}. Убедитесь, что Ollama запущен и доступен. Ошибка: ${message}` });
    }
};

app.post('/api/ollama/:endpoint', ollamaProxyHandler);


app.listen(port, () => {
    console.log(`🚀 API-мост для EXPERT запущен на http://localhost:${port}`);
});