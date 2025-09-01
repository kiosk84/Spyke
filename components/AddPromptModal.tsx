
import React, { useState, useEffect } from 'react';
import { Prompt } from '../prompts';
import Button from './common/Button';
import CloseIcon from './icons/CloseIcon';

interface AddPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (promptData: Omit<Prompt, 'id'> & { id?: string }) => void;
    promptToEdit: Prompt | null;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ isOpen, onClose, onSave, promptToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [promptText, setPromptText] = useState('');
    
    useEffect(() => {
        if (promptToEdit) {
            setTitle(promptToEdit.title);
            setDescription(promptToEdit.description);
            setPromptText(promptToEdit.prompt);
        } else {
            setTitle('');
            setDescription('');
            setPromptText('');
        }
    }, [promptToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !promptText.trim()) return;
        onSave({
            id: promptToEdit?.id,
            title,
            description,
            prompt: promptText
        });
        onClose();
    };

    const InputField = ({ label, value, onChange, placeholder, required = false }: any) => (
         <div>
            <label className="block text-sm font-medium text-light-secondary mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
            />
        </div>
    );

    const TextareaField = ({ label, value, onChange, placeholder, required = false, rows = 3 }: any) => (
         <div>
            <label className="block text-sm font-medium text-light-secondary mb-1">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200 resize-y"
            />
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-dark-secondary rounded-2xl shadow-lg border border-dark-tertiary/50 w-full max-w-2xl p-6 relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-light-primary mb-6 font-display">
                    {promptToEdit ? 'Редактировать промпт' : 'Добавить новый промпт'}
                </h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-light-secondary hover:text-white"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField 
                        label="Название"
                        value={title}
                        onChange={(e: any) => setTitle(e.target.value)}
                        placeholder="Например, Кинематографический портрет"
                        required
                    />
                    <TextareaField
                        label="Описание"
                        value={description}
                        onChange={(e: any) => setDescription(e.target.value)}
                        placeholder="Краткое описание того, что делает этот промпт."
                    />
                     <TextareaField
                        label="Текст промпта"
                        value={promptText}
                        onChange={(e: any) => setPromptText(e.target.value)}
                        placeholder="cinematic portrait of a mysterious woman..."
                        required
                        rows={5}
                    />
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPromptModal;