import React, { useState, useMemo, useEffect } from 'react';
import { PROMPT_LIBRARY, Category, SubCategory, Prompt } from '../../prompts';
import { CUSTOM_PROMPTS_KEY } from '../../constants';
import SearchIcon from '../icons/SearchIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import UserIcon from '../icons/UserIcon';
import Button from '../common/Button';
import AddPromptModal from '../AddPromptModal';
import PromptCard from '../PromptCard';
import Squares2x2Icon from '../icons/Squares2x2Icon';


const PromptLibraryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [library, setLibrary] = useState<Category[]>(PROMPT_LIBRARY);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

    const loadCustomPrompts = () => {
        const savedPromptsJSON = localStorage.getItem(CUSTOM_PROMPTS_KEY);
        const customPrompts: Prompt[] = savedPromptsJSON ? JSON.parse(savedPromptsJSON) : [];

        const existingLibrary = [...PROMPT_LIBRARY];
        
        // Remove existing custom category if it's there, to prevent duplicates
        const baseLibrary = existingLibrary.filter(cat => cat.name !== 'Мои Промпты');

        if (customPrompts.length > 0) {
            const customCategory: Category = {
                name: 'Мои Промпты',
                description: 'Ваши сохраненные промпты для быстрого доступа.',
                Icon: UserIcon,
                subCategories: [{ name: 'Все', prompts: customPrompts }]
            };
            setLibrary([...baseLibrary, customCategory]);
        } else {
            setLibrary(baseLibrary);
        }
    };
    
    useEffect(() => {
        loadCustomPrompts();
    }, []);

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const lowercasedTerm = searchTerm.toLowerCase();
        const results: Prompt[] = [];
        library.forEach(category => {
            category.subCategories.forEach(subCategory => {
                subCategory.prompts.forEach(prompt => {
                    if (
                        prompt.title.toLowerCase().includes(lowercasedTerm) ||
                        prompt.description.toLowerCase().includes(lowercasedTerm) ||
                        prompt.prompt.toLowerCase().includes(lowercasedTerm)
                    ) {
                        results.push(prompt);
                    }
                });
            });
        });
        return results;
    }, [searchTerm, library]);
    
    const filteredLibrary = useMemo(() => {
        if (activeFilter === 'All') {
            return library;
        }
        return library.filter(cat => cat.name === activeFilter);
    }, [activeFilter, library]);

    const handleGoBack = () => {
        if (selectedSubCategory) {
            setSelectedSubCategory(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Reset navigation and filtering when user starts searching
        setActiveFilter('All');
        setSelectedCategory(null);
        setSelectedSubCategory(null);
    };
    
    const handleFilterClick = (categoryName: string) => {
        setActiveFilter(categoryName);
        // Reset search and navigation
        setSearchTerm('');
        setSelectedCategory(null);
        setSelectedSubCategory(null);
    };

    const handleOpenAddModal = () => {
        setEditingPrompt(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setIsModalOpen(true);
    };

    const handleSavePrompt = (promptData: Omit<Prompt, 'id'> & { id?: string }) => {
        const savedPromptsJSON = localStorage.getItem(CUSTOM_PROMPTS_KEY);
        let customPrompts: Prompt[] = savedPromptsJSON ? JSON.parse(savedPromptsJSON) : [];

        if (promptData.id) { // Editing existing prompt
            customPrompts = customPrompts.map(p => p.id === promptData.id ? { ...p, ...promptData } : p);
        } else { // Adding new prompt
            const newPrompt: Prompt = {
                ...promptData,
                id: Date.now().toString(),
            };
            customPrompts.push(newPrompt);
        }
        
        localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(customPrompts));
        loadCustomPrompts(); // Reload to update the UI
        setSelectedCategory(null); // Reset view to show updated list
        setSelectedSubCategory(null);
    };
    
    const handleDeletePrompt = (promptId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот промпт?')) {
            const savedPromptsJSON = localStorage.getItem(CUSTOM_PROMPTS_KEY);
            let customPrompts: Prompt[] = savedPromptsJSON ? JSON.parse(savedPromptsJSON) : [];
            customPrompts = customPrompts.filter(p => p.id !== promptId);
            localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(customPrompts));
            loadCustomPrompts();
            setSelectedCategory(null);
            setSelectedSubCategory(null);
        }
    };


    const renderHeader = () => {
        let title = "Библиотека Промтов";
        if (selectedCategory) title = selectedCategory.name;
        if (selectedSubCategory) title = selectedSubCategory.name;

        return (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    {(selectedCategory || selectedSubCategory) && (
                        <button onClick={handleGoBack} className="p-2 bg-dark-secondary rounded-full text-light-secondary hover:bg-dark-tertiary">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                        {title}
                    </h1>
                </div>
                {!selectedCategory && !selectedSubCategory && !searchTerm.trim() && (
                    <Button onClick={handleOpenAddModal}>+ Добавить промпт</Button>
                )}
            </div>
        );
    }
    
    const FilterButton = ({ label, Icon, isActive, onClick }: { label: string, Icon: React.ElementType, isActive: boolean, onClick: () => void }) => {
        const baseClasses = "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 border-2";
        const activeClasses = "bg-brand-cyan/20 border-brand-cyan text-white";
        const inactiveClasses = "bg-dark-secondary border-dark-tertiary text-light-secondary hover:border-brand-cyan/50 hover:text-white";
        
        return (
            <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            {renderHeader()}
            
            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Найти промпт для любой задачи..."
                    className="w-full bg-dark-secondary border border-dark-tertiary text-white rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-4 pl-12 text-lg"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            {!searchTerm.trim() && !selectedCategory && !selectedSubCategory && (
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                    <FilterButton 
                        label="Все"
                        Icon={Squares2x2Icon}
                        isActive={activeFilter === 'All'}
                        onClick={() => handleFilterClick('All')}
                    />
                    {PROMPT_LIBRARY.map(cat => (
                         <FilterButton 
                            key={cat.name}
                            label={cat.name}
                            Icon={cat.Icon}
                            isActive={activeFilter === cat.name}
                            onClick={() => handleFilterClick(cat.name)}
                        />
                    ))}
                </div>
            )}

            {searchTerm.trim() ? (
                <div>
                     <h2 className="text-2xl font-bold font-display text-light-primary mb-6">Результаты поиска</h2>
                     {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((prompt, index) => <PromptCard key={prompt.id || index} item={prompt} />)}
                        </div>
                     ) : (
                        <p className="text-light-secondary text-center py-8">Ничего не найдено. Попробуйте другой запрос.</p>
                     )}
                </div>
            ) : selectedSubCategory ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedSubCategory.prompts.map((prompt, index) => (
                        <PromptCard 
                            key={prompt.id || index} 
                            item={prompt}
                            isCustom={selectedCategory?.name === 'Мои Промпты'}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeletePrompt}
                        />
                    ))}
                </div>
            ) : selectedCategory ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedCategory.subCategories.map((sub, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedSubCategory(sub)}
                            className="bg-dark-secondary border border-dark-tertiary/50 p-6 rounded-xl text-left transition-transform hover:scale-105 hover:border-brand-cyan/50"
                        >
                            <h2 className="text-xl font-bold text-white mb-2">{sub.name}</h2>
                            <p className="text-sm text-brand-cyan font-semibold">{sub.prompts.length} промптов →</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredLibrary.map((cat, index) => (
                         <button
                            key={index}
                            onClick={() => setSelectedCategory(cat)}
                            className="bg-dark-secondary border border-dark-tertiary/50 p-6 rounded-xl text-left transition-transform hover:scale-105 hover:border-brand-cyan/50 flex flex-col"
                        >
                            <div className="p-3 bg-dark-tertiary rounded-full mb-4 w-max">
                                <cat.Icon className="w-8 h-8 text-brand-cyan" />
                            </div>
                            <h2 className="text-xl font-bold font-display text-white mb-2">{cat.name}</h2>
                            <p className="text-sm text-light-secondary flex-grow">{cat.description}</p>
                        </button>
                    ))}
                    {filteredLibrary.length === 0 && activeFilter !== 'All' && (
                        <div className="col-span-full text-center py-8">
                             <p className="text-light-secondary">Категория "{activeFilter}" не найдена.</p>
                        </div>
                    )}
                </div>
            )}

            <AddPromptModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePrompt}
                promptToEdit={editingPrompt}
            />
        </div>
    );
};

export default PromptLibraryPage;