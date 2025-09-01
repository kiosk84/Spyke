
import React, { useState, useEffect } from 'react';
import { Prompt } from '../prompts';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface PromptCardProps {
    item: Prompt;
    isCustom?: boolean;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (promptId: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ item, isCustom, onEdit, onDelete }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        navigator.clipboard.writeText(item.prompt);
        setCopied(true);
    };

    return (
        <div className="bg-dark-secondary border border-dark-tertiary/50 rounded-xl p-5 space-y-3 flex flex-col h-full">
            <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg font-bold text-light-primary">{item.title}</h3>
                {isCustom && onEdit && onDelete && item.id && (
                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => onEdit(item)} className="p-1 text-light-secondary hover:text-brand-cyan transition-colors" aria-label="Редактировать"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(item.id!)} className="p-1 text-light-secondary hover:text-red-500 transition-colors" aria-label="Удалить"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
            <p className="text-sm text-light-secondary flex-grow">{item.description}</p>
            <div className="bg-dark-tertiary p-3 rounded-lg font-mono text-xs text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                {item.prompt}
            </div>
            <button
                onClick={handleCopy}
                className="mt-auto self-start flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-dark-tertiary rounded-md text-light-secondary hover:bg-brand-cyan hover:text-white transition-colors"
            >
                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? 'Скопировано' : 'Копировать'}
            </button>
        </div>
    );
};

export default PromptCard;