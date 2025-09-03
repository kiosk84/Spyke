import React, { useState, useCallback, DragEvent } from 'react';
import * as aiService from '../../services/aiService';
import Button from '../common/Button';
import Loader from '../common/Loader';
import ImageIcon from '../icons/ImageIcon';
import TrashIcon from '../icons/TrashIcon';
import RefreshIcon from '../icons/RefreshIcon';
import ClockIcon from '../icons/ClockIcon';
import { COST_TIME_MACHINE_PER_DECADE } from '../../constants';
import CoinIcon from '../icons/CoinIcon';

interface UploadedImage {
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
}

interface DecadeImage {
    url: string | null;
    isLoading: boolean;
}

interface TimeMachinePageProps {
    balance: number;
    onBalanceChange: (newBalance: number | ((prev: number) => number)) => void;
}

const fileToData = (file: File): Promise<{ previewUrl: string, base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve({
                previewUrl: result,
                base64: result.split(',')[1],
                mimeType: file.type
            });
        };
        reader.onerror = error => reject(error);
    });
};

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

const PROMPTS_BY_DECADE: Record<string, { initial: string; regen: string }> = {
    '1950s': {
        initial: `A color photograph of the person in the image, styled as if taken in the 1950s. The clothes and hair are in the 1950s style. The photo has the look of old color film. The person's face, features, and gender remain the same.`,
        regen: `A classic black and white portrait of the person in the image, styled as if taken in the 1950s. The clothes and hair are in the 1950s style. The person's face, features, and gender remain the same.`
    },
    '1960s': {
        initial: `A color photograph of the person in the image, styled as if taken in the 1960s. The clothes and hair are in the 1960s style. The photo has a vintage film look. The person's face, features, and gender remain the same.`,
        regen: `A casual color snapshot of the person in the image, styled as if taken in the 1960s. The clothes and hair are in a relaxed 1960s style. The person's face, features, and gender remain the same.`
    },
    '1970s': {
        initial: `A color photograph of the person in the image, styled as if taken in the 1970s. The clothes and hair are in a classic 1970s style. The photo has a warm, slightly faded color palette with a soft focus, characteristic of film photography from that era. The person's face, features, and gender remain the same.`,
        regen: `A 1970s disco-style portrait of the person in the image. The clothes and hair are in a flashy 1970s disco style. The person's face, features, and gender remain the same.`
    },
    '1980s': {
        initial: `A color photograph of the person in the image, styled as if taken in the 1980s. The clothes and hair are in the 1980s style. The photo uses bright, vibrant colors. The person's face, features, and gender remain the same.`,
        regen: `A stylish 1980s portrait of the person in the image, with neon colors. The clothes and hair are in a fashionable 1980s style. The person's face, features, and gender remain the same.`
    },
    '1990s': {
        initial: `A color photograph of the person in the image, styled as if taken in the 1990s. The clothes and hair are in the 1990s style. The photo looks like it was taken on 35mm film. The person's face, features, and gender remain the same.`,
        regen: `A bright, clean portrait of the person in the image, styled as if taken in the 1990s. The clothes and hair are in a popular 1990s style. The person's face, features, and gender remain the same.`
    },
    '2000s': {
        initial: `A photograph of the person in the image, styled as if taken with an early 2000s digital camera. The clothes and hair are in early 2000s style. The photo has a direct flash effect. The person's face, features, and gender remain the same.`,
        regen: `A casual photograph of the person in the image, styled as if taken in the mid-2000s. The clothes and hair are in a popular mid-2000s style. The person's face, features, and gender remain the same.`
    },
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TimeMachinePage: React.FC<TimeMachinePageProps> = ({ balance, onBalanceChange }) => {
    const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, DecadeImage>>({});
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const costForAll = DECADES.length * COST_TIME_MACHINE_PER_DECADE;
    const hasSufficientBalanceForAll = balance >= costForAll;
    const hasSufficientBalanceForOne = balance >= COST_TIME_MACHINE_PER_DECADE;

    const handleError = (err: any, context?: string) => {
        const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
        const fullMessage = context ? `${context}: ${message}` : message;
        console.error(fullMessage, err);
        setError(fullMessage);
    };

    const handleFileDrop = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) return handleError(new Error('Пожалуйста, выберите файл изображения.'));
        if (file.size > 4 * 1024 * 1024) return handleError(new Error('Размер файла не должен превышать 4 МБ.'));
        
        setError(null);
        setGeneratedImages({});
        try {
            const data = await fileToData(file);
            setOriginalImage({ file, ...data });
        } catch (err) {
            handleError(err, 'Ошибка при чтении файла');
        }
    }, []);

    const handleGenerateAll = async () => {
        if (!originalImage) return;
        if (!hasSufficientBalanceForAll) {
            return handleError(new Error(`Недостаточно средств. Требуется: ${costForAll}, у вас: ${balance}.`));
        }
        setIsGeneratingAll(true);
        setError(null);
    
        const initialStates: Record<string, DecadeImage> = {};
        DECADES.forEach(decade => {
            initialStates[decade] = { url: null, isLoading: true };
        });
        setGeneratedImages(initialStates);
    
        for (let i = 0; i < DECADES.length; i++) {
            const decade = DECADES[i];
            try {
                const images = await aiService.editImage(PROMPTS_BY_DECADE[decade].initial, originalImage.base64, originalImage.mimeType, '3:4');
                if (images.length > 0) {
                    setGeneratedImages(prev => ({ ...prev, [decade]: { url: images[0], isLoading: false } }));
                    onBalanceChange(prev => prev - COST_TIME_MACHINE_PER_DECADE);
                } else {
                    throw new Error('Модель вернула пустой ответ.');
                }
            } catch (err) {
                handleError(err, `Ошибка генерации для ${decade}`);
                setGeneratedImages(prev => {
                    const updated = { ...prev };
                    for (let j = i; j < DECADES.length; j++) {
                        updated[DECADES[j]] = { url: null, isLoading: false };
                    }
                    return updated;
                });
                setIsGeneratingAll(false);
                return; 
            }

            // Add a delay between requests to avoid rate limiting
            if (i < DECADES.length - 1) {
                await delay(65000); // 65-second delay
            }
        }
    
        setIsGeneratingAll(false);
    };
    
    const handleRegenerate = async (decade: string) => {
        if (!originalImage || isGeneratingAll) return;
        if (!hasSufficientBalanceForOne) {
            return handleError(new Error(`Недостаточно средств. Требуется: ${COST_TIME_MACHINE_PER_DECADE}, у вас: ${balance}.`));
        }
        setGeneratedImages(prev => ({ ...prev, [decade]: { ...prev[decade], isLoading: true } }));
        setError(null);
        try {
            const images = await aiService.editImage(PROMPTS_BY_DECADE[decade].regen, originalImage.base64, originalImage.mimeType, '3:4');
            if (images.length > 0) {
                setGeneratedImages(prev => ({ ...prev, [decade]: { url: images[0], isLoading: false } }));
                onBalanceChange(prev => prev - COST_TIME_MACHINE_PER_DECADE);
            } else {
                throw new Error('Модель вернула пустой ответ.');
            }
        } catch (err) {
            handleError(err, `Ошибка перегенерации для ${decade}`);
            setGeneratedImages(prev => ({ ...prev, [decade]: { ...prev[decade], isLoading: false } }));
        }
    };

    const handleRemoveImage = () => {
        setOriginalImage(null);
        setGeneratedImages({});
        setError(null);
    };

    const ImageUploader = () => (
         <div 
          className="relative w-full max-w-lg mx-auto border-2 border-dashed border-gray-600 rounded-lg p-10 text-center flex flex-col justify-center items-center hover:border-brand-cyan transition-colors duration-300"
          onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFileDrop(e.dataTransfer.files); }}
          onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
        >
            <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileDrop(e.target.files)} />
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-light-secondary"><span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (до 4MB)</p>
        </div>
    );
    
    const PolaroidCard: React.FC<{ decade: string; data: DecadeImage; onRegenerate: () => void; }> = ({ decade, data, onRegenerate }) => (
        <div className="bg-light-primary p-3 pb-4 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2 w-full animate-fade-in">
            <div className="relative bg-dark-tertiary aspect-[3/4] rounded-md flex items-center justify-center overflow-hidden">
                {data.isLoading ? (
                    <Loader size="md" />
                ) : data.url ? (
                    <>
                        <img src={data.url} alt={`Generated for ${decade}`} className="w-full h-full object-cover" />
                        <button 
                            onClick={onRegenerate}
                            className="absolute top-2 right-2 p-2 bg-black/40 text-white rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors disabled:opacity-50"
                            aria-label={`Перегенерировать для ${decade}`}
                            disabled={!hasSufficientBalanceForOne}
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-2">
                        <p className="text-sm text-red-400">Ошибка</p>
                    </div>
                )}
            </div>
            <p className="text-center text-dark-primary font-display font-bold text-xl mt-3">{decade}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center">
                 <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Машина Времени
                </h1>
                <p className="text-light-secondary max-w-2xl mx-auto">
                    Загрузите своё фото, и мы отправим его в прошлое! Посмотрите, как бы вы выглядели в разные эпохи, от 50-х до 2000-х.
                </p>
            </div>
            
            {!originalImage ? <ImageUploader /> : (
                <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative flex-shrink-0 w-48 h-48">
                            <img src={originalImage.previewUrl} alt="Загружено" className="w-full h-full object-cover rounded-lg shadow-lg" />
                             <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110" aria-label="Удалить изображение">
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-bold font-display text-light-primary">Ваше путешествие готово</h2>
                            <p className="text-light-secondary mt-1 mb-4">Нажмите кнопку, чтобы запустить машину времени и увидеть себя в прошлом.</p>
                             <Button
                                onClick={handleGenerateAll}
                                isLoading={isGeneratingAll}
                                disabled={isGeneratingAll || !hasSufficientBalanceForAll}
                                className="w-full md:w-auto text-lg"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ClockIcon className="w-6 h-6" />
                                    <span>Создать образы</span>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${hasSufficientBalanceForAll ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        <CoinIcon className="w-4 h-4" />
                                        <span>{costForAll}</span>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center max-w-3xl mx-auto">{error}</div>}

            {Object.keys(generatedImages).length > 0 && (
                <div>
                     <h2 className="text-2xl font-bold text-light-primary font-display text-center mb-6">Ваша фотолента из прошлого</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                        {DECADES.map(decade => generatedImages[decade] && (
                            <PolaroidCard 
                                key={decade} 
                                decade={decade} 
                                data={generatedImages[decade]} 
                                onRegenerate={() => handleRegenerate(decade)} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeMachinePage;