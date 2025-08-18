
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChat, isProviderConfigured as checkProviderConfig } from '../../services/aiService';
import SendIcon from '../icons/SendIcon';
import UserIcon from '../icons/UserIcon';
import RobotIcon from '../icons/RobotIcon';
import Loader from '../common/Loader';
import PaperclipIcon from '../icons/PaperclipIcon';
import { Page } from '../../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatPageProps {
  onNavigate: (page: Page) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [isProviderConfigured, setIsProviderConfigured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    const updateConfigStatus = () => {
        setIsProviderConfigured(checkProviderConfig());
    };
    updateConfigStatus();
    // Re-check when window gets focus, in case user updated settings in another tab
    window.addEventListener('focus', updateConfigStatus);
    // Also re-check when storage changes, e.g. settings saved in another tab
    window.addEventListener('storage', updateConfigStatus);
    
    return () => {
      window.removeEventListener('focus', updateConfigStatus);
      window.removeEventListener('storage', updateConfigStatus);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Ограничение высоты ~5 строк
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [userInput]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading || !isProviderConfigured) return;

    const userMessage: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    if (trimmedInput.toUpperCase() === 'ГЕЛИК') {
        setTimeout(() => {
            const modelMessage: Message = { role: 'model', text: 'Да доча,пиши что хочешь?' };
            setMessages(prev => [...prev, modelMessage]);
        }, 500);
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToChat(trimmedInput);
      const modelMessage: Message = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
      setError(message);
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
  
  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user';
    const Icon = isUser ? UserIcon : RobotIcon;
    const iconClasses = isUser ? 'text-light-primary' : 'text-brand-cyan';
    
    return (
        <div className={`flex items-start gap-3 w-full max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-magenta/80' : 'bg-dark-tertiary'}`}>
                <Icon className={`w-6 h-6 ${iconClasses}`} />
            </div>
            <div className={`px-5 py-3 rounded-2xl ${isUser ? 'bg-brand-cyan/20' : 'bg-dark-secondary'}`}>
                <p className="text-light-primary whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
  };
  
  const renderInputArea = () => {
    return (
      <div className="max-w-3xl mx-auto">
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-center text-sm mb-3">{error}</div>}
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 p-3 rounded-2xl bg-dark-secondary/80 backdrop-blur-xl border border-dark-tertiary/50 focus-within:border-brand-cyan transition-colors shadow-2xl shadow-black/50">
            <button
                type="button"
                className="grid place-items-center flex-shrink-0 w-10 h-10 rounded-full transition-colors duration-200 text-gray-400 hover:bg-dark-tertiary disabled:opacity-50"
                aria-label="Прикрепить файл"
                disabled={isLoading || !isProviderConfigured}
            >
                <PaperclipIcon className="w-6 h-6" />
            </button>
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isProviderConfigured ? "Напишите Ваш вопрос" : "Настройте AI-провайдер в Настройках, чтобы начать..."}
              className="flex-grow bg-transparent border-none text-white rounded-lg focus:ring-0 block p-2 resize-none overflow-y-hidden disabled:opacity-50"
              rows={1}
              disabled={isLoading || !isProviderConfigured}
              aria-label="Поле для ввода сообщения"
            />
            <button
                type="submit"
                disabled={!userInput.trim() || isLoading || !isProviderConfigured}
                className={`grid place-items-center flex-shrink-0 w-10 h-10 rounded-full transition-all duration-200 ${(userInput.trim() && !isLoading && isProviderConfigured) ? 'bg-brand-cyan text-white' : 'bg-dark-tertiary text-gray-400'}`}
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

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      <div className="flex-grow overflow-y-auto p-4 pb-64 flex flex-col">
        {messages.length === 0 && !isLoading ? (
            <div className="m-auto text-center p-4">
               <h1 className="text-5xl font-black font-display tracking-wider text-light-primary">
                  Добро пожаловать!
               </h1>
               <p className="text-light-secondary text-lg mt-4">
                  Я-&laquo; AI EXPERT&raquo; Чем я могу Вам помочь?
               </p>
            </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 w-full max-w-3xl mx-auto flex-row">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-dark-tertiary">
                    <RobotIcon className="w-6 h-6 text-brand-cyan" />
                </div>
                <div className="px-5 py-3 rounded-2xl bg-dark-secondary flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-brand-cyan/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-brand-cyan/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-brand-cyan/60 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
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
