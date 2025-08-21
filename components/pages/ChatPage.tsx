import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChatStream, getAiProvider, isOllamaConfigured } from '../../services/aiService';
import SendIcon from '../icons/SendIcon';
import UserIcon from '../icons/UserIcon';
import RobotIcon from '../icons/RobotIcon';
import Loader from '../common/Loader';
import PaperclipIcon from '../icons/PaperclipIcon';
import { Page, AiProvider } from '../../types';
import ApiKeyPrompt from '../common/ApiKeyPrompt';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatPageProps {
  onNavigate: (page: Page) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentProvider, setCurrentProvider] = useState<AiProvider>('google');

  useEffect(() => {
    // Check provider on mount
    setCurrentProvider(getAiProvider());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [userInput]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const onChunk = (chunk: string) => {
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'model') {
                const updatedMessage = { ...lastMessage, text: lastMessage.text + chunk };
                return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
        });
      };
      
      await sendMessageToChatStream(trimmedInput, onChunk);

    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
      setError(message);
      // Remove the empty model message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };
  
  const MessageBubble: React.FC<{ message: Message; isLoading?: boolean; isLastMessage?: boolean; }> = ({ message, isLoading, isLastMessage }) => {
    const isUser = message.role === 'user';
    const Icon = isUser ? UserIcon : RobotIcon;
    const isStreaming = !!isLoading && !!isLastMessage && message.role === 'model';
    
    const bubbleClasses = isUser
        ? 'bg-dark-secondary/50 backdrop-blur-sm border border-brand-cyan/20'
        : 'bg-dark-secondary/50 backdrop-blur-sm border border-white/10';

    return (
        <div className={`flex items-start gap-3 w-full max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-br from-brand-cyan to-brand-magenta' : 'bg-dark-tertiary'}`}>
                <Icon className={`w-5 h-5 ${isUser ? 'text-white' : 'text-brand-cyan'}`} />
            </div>
            <div className={`p-4 rounded-2xl ${bubbleClasses}`}>
                <p className="text-light-primary/90 whitespace-pre-wrap leading-relaxed">
                  {message.text}
                  {isStreaming && <span className="inline-block w-0.5 h-5 bg-light-primary align-middle animate-pulse ml-1"></span>}
                </p>
            </div>
        </div>
    );
  };
  
  const renderInputArea = () => {
    return (
      <div className="max-w-3xl mx-auto">
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-center text-sm mb-3">{error}</div>}
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 p-2 rounded-2xl bg-dark-secondary/50 backdrop-blur-md border border-white/10 focus-within:ring-2 focus-within:ring-brand-cyan/80 focus-within:border-transparent transition-all shadow-lg shadow-black/30">
            <button
                type="button"
                className="grid place-items-center flex-shrink-0 w-10 h-10 rounded-full transition-colors duration-200 text-gray-400 hover:bg-dark-tertiary disabled:opacity-50"
                aria-label="Прикрепить файл"
                disabled={isLoading}
            >
                <PaperclipIcon className="w-6 h-6" />
            </button>
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите Ваш вопрос"
              className="flex-grow bg-transparent border-none text-white rounded-lg focus:ring-0 block p-2.5 resize-none overflow-y-hidden disabled:opacity-50"
              rows={1}
              disabled={isLoading}
              aria-label="Поле для ввода сообщения"
            />
            <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className={`grid place-items-center flex-shrink-0 w-10 h-10 rounded-full transition-all duration-200 ${(userInput.trim() && !isLoading) ? 'bg-brand-cyan text-white' : 'bg-dark-tertiary text-gray-400'}`}
                aria-label="Отправить сообщение"
            >
                {isLoading ? <Loader size="sm" /> : <SendIcon className="w-5 h-5" />}
            </button>
        </form>
        <p className="text-center text-xs text-light-secondary/50 pt-3">
          © 2025 сделано ART_IRBIT
        </p>
      </div>
    );
  };
  
  const WelcomeMessage = () => (
    <div className="flex items-start gap-3 w-full max-w-3xl mx-auto flex-row mt-4 animate-fade-in">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-dark-tertiary">
            <RobotIcon className="w-5 h-5 text-brand-cyan" />
        </div>
        <div className="p-4 rounded-2xl bg-dark-secondary/50 backdrop-blur-sm border border-white/10">
            <p className="text-light-primary/90 whitespace-pre-wrap leading-relaxed">Добро пожаловать! Я — «AI EXPERT». Чем я могу вам помочь сегодня?</p>
        </div>
    </div>
  );

  if (currentProvider === 'ollama' && !isOllamaConfigured()) {
    return (
        <div className="flex items-center justify-center h-full">
            <ApiKeyPrompt onNavigate={onNavigate} />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      <div className="flex-grow overflow-y-auto p-4 pb-64 flex flex-col">
        {messages.length === 0 && !isLoading ? (
            <WelcomeMessage />
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                message={msg} 
                isLoading={isLoading} 
                isLastMessage={index === messages.length - 1} 
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-4 pb-4 sm:pb-6">
          {renderInputArea()}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;