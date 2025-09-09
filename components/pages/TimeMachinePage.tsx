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
import ArrowsRightLeftIcon from '../icons/ArrowsRightLeftIcon';

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
        initial: "Turn this into an authentic 1950s photo. Give it the look of vintage Kodachrome film with warm colors. Place the person in a classic American diner with a 50s hairstyle and clothes. Keep their face the same.",
        regen: "Make this a glamorous 1950s Old Hollywood black and white portrait. Use dramatic, soft studio lighting and elegant formal wear. Make sure the person is still recognizable."
    },
    '1960s': {
        initial: "Give this a 1960s mod fashion photoshoot style. Use vibrant pop art colors against a bold, solid-colored background. Keep the person's face identical.",
        regen: "Recreate this as if it was taken at a 1960s hippie music festival. It should look like a warm, grainy 35mm film photo with sun flare. Dress them in hippie fashion. Keep their face recognizable."
    },
    '1970s': {
        initial: "Make this look like an authentic 1970s Polaroid photo. Use faded, warm yellowish colors and soft focus, and place them in a room with wood paneling. Make sure the person's face is preserved.",
        regen: "Transform this into a lively 1970s disco scene. Put the person under colorful disco lights with a disco ball in the background. Give them glamorous disco clothes and big hair. Keep their face the same."
    },
    '1980s': {
        initial: "Create a glossy 1980s studio portrait. The background should be a neon laser grid. Use saturated, vibrant colors and give the person a big, teased hairstyle and 80s clothes. Don't change the person's face.",
        regen: "Make this look like an 80s rock album cover. The scene should be dramatic, with colored spotlights and smoke. Dress them in a leather jacket. Don't change their facial features."
    },
    '1990s': {
        initial: "Recreate this in a 90s grunge style. It should look like a grainy 35mm film photo with muted colors. Dress the person in a flannel shirt. Keep their face the same.",
        regen: "Transform this into a 90s pop music style photo, like from a teen magazine. Use bright, saturated colors and simple studio lighting against a pastel background. Don't change their face."
    },
    '2000s': {
        initial: "Make this look like it was taken on an early 2000s digital camera. Use oversaturated cool colors, a harsh on-camera flash, and give them Y2K fashion. Don't change their face.",
        regen: "Recreate this as a mid-2000s social media photo from a high angle. Use a moody, desaturated filter with vignetting. Give them side-swept hair. Make sure their face is still recognizable."
    },
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TimeMachinePage: React.FC<TimeMachinePageProps> = ({ balance, onBalanceChange }) => {
    const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, DecadeImage>>({});
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeDecade, setActiveDecade] = useState<'original' | string>('original');
    const [sliderPosition, setSliderPosition] = useState(50);
    const [regenerationCounter, setRegenerationCounter] = useState<Record<string, number>>({});
    
    const costForAll = DECADES.length * COST_TIME_MACHINE_PER_DECADE;
    const hasSufficientBalanceForAll = balance >= costForAll;
    const hasSufficientBalanceForOne = balance >= COST_TIME_MACHINE_PER_DECADE;

    const resetState = () => {
        setOriginalImage(null);
        setGeneratedImages({});
        setIsGeneratingAll(false);
        setError(null);
        setActiveDecade('original');
        setRegenerationCounter({});
    };

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
        
        resetState();
        try {
            const data = await fileToData(file);
            setOriginalImage({ file, ...data });
        } catch (err) {
            handleError(err, 'Ошибка при чтении файла');
        }
    }, []);

    const handleGenerateForDecade = useCallback(async (decade: string) => {
        if (!originalImage || generatedImages[decade]?.isLoading || isGeneratingAll) return;
        
        const currentBalance = typeof balance === 'number' ? balance : 0;
        if (currentBalance < COST_TIME_MACHINE_PER_DECADE) {
            return handleError(new Error(`Недостаточно средств. Требуется: ${COST_TIME_MACHINE_PER_DECADE}, у вас: ${balance}.`));
        }

        setError(null);
        setGeneratedImages(prev => ({ ...prev, [decade]: { url: prev[decade]?.url, isLoading: true } }));
        
        const isRegen = (regenerationCounter[decade] || 0) > 0;
        const prompt = isRegen ? PROMPTS_BY_DECADE[decade].regen : PROMPTS_BY_DECADE[decade].initial;

        try {
            const images = await aiService.editImage(prompt, originalImage.base64, originalImage.mimeType, '3:4');
            if (images.length > 0) {
                setGeneratedImages(prev => ({ ...prev, [decade]: { url: images[0], isLoading: false } }));
                onBalanceChange(prev => prev - COST_TIME_MACHINE_PER_DECADE);
                setActiveDecade(decade);
                setRegenerationCounter(prev => ({...prev, [decade]: (prev[decade] || 0) + 1}));
            } else {
                 throw new Error(`Модель не вернула изображение для ${decade}.`);
            }
        } catch (err) {
            handleError(err, `Ошибка при генерации для ${decade}`);
            setGeneratedImages(prev => ({ ...prev, [decade]: { ...prev[decade], isLoading: false } }));
        }
    }, [originalImage, generatedImages, isGeneratingAll, balance, onBalanceChange, regenerationCounter]);


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
        setRegenerationCounter({});
    
        for (let i = 0; i < DECADES.length; i++) {
            const decade = DECADES[i];
            try {
                // Use a functional state update to get the latest balance
                let canProceed = false;
                onBalanceChange(currentBalance => {
                    if (currentBalance >= COST_TIME_MACHINE_PER_DECADE) {
                        canProceed = true;
                        return currentBalance - COST_TIME_MACHINE_PER_DECADE;
                    }
                    canProceed = false;
                    return currentBalance;
                });
                
                if (!canProceed) {
                    throw new Error(`Недостаточно средств для генерации ${decade}.`);
                }

                const images = await aiService.editImage(PROMPTS_BY_DECADE[decade].initial, originalImage.base64, originalImage.mimeType, '3:4');
                if (images.length > 0) {
                    setGeneratedImages(prev => ({ ...prev, [decade]: { url: images[0], isLoading: false } }));
                    setActiveDecade(decade);
                } else {
                     throw new Error(`Модель не вернула изображение для ${decade}.`);
                }
                if (i < DECADES.length - 1) {
                    await delay(1000);
                }
            } catch (err) {
                handleError(err, `Ошибка при генерации для ${decade}`);
                setGeneratedImages(prev => ({ ...prev, [decade]: { url: null, isLoading: false } }));
                 // Stop generating if an error occurs
                setIsGeneratingAll(false);
                return;
            }
        }
        setIsGeneratingAll(false);
    };

    const ImageViewer = () => {
        if (!originalImage) return null;
        const activeImageUrl = activeDecade === 'original' ? originalImage.previewUrl : generatedImages[activeDecade]?.url;
        const isDecadeLoading = generatedImages[activeDecade]?.isLoading;

        return (
            <div className="w-full max-w-md mx-auto relative group">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-lg bg-dark-tertiary border border-dark-tertiary/50">
                    <img src={originalImage.previewUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover select-none"/>
                    
                    {isDecadeLoading ? (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center backdrop-blur-sm z-20">
                            <Loader size="lg" />
                            <p className="mt-4 text-light-secondary">Путешествуем в {activeDecade}...</p>
                        </div>
                    ) : activeImageUrl && activeDecade !== 'original' ? (
                         <>
                            <div className="absolute inset-0 w-full h-full select-none z-10">
                                <img
                                    src={activeImageUrl}
                                    alt={`Edited for ${activeDecade}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                />
                            </div>
                            
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize pointer-events-none z-20"
                                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                            >
                                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm text-dark-primary">
                                    <ArrowsRightLeftIcon className="w-5 h-5" />
                                </div>
                            </div>
                            
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderPosition}
                                onChange={(e) => setSliderPosition(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0 z-30"
                                aria-label="Image comparison slider"
                            />
                        </>
                    ) : null}
                </div>
                {activeDecade !== 'original' && activeImageUrl && !isDecadeLoading && (
                    <Button
                        onClick={() => handleGenerateForDecade(activeDecade)}
                        isLoading={isDecadeLoading}
                        disabled={isGeneratingAll || !hasSufficientBalanceForOne}
                        variant='secondary'
                        className="absolute bottom-4 left-4 z-40"
                        Icon={RefreshIcon}
                    >
                        Другой вариант
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${hasSufficientBalanceForOne ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            <CoinIcon className="w-3 h-3"/><span>{COST_TIME_MACHINE_PER_DECADE}</span>
                        </div>
                    </Button>
                )}
            </div>
        );
    };

    const Timeline = () => {
        if (!originalImage) return null;
        return (
            <div className="w-full">
                <div className="relative w-full h-1 bg-dark-tertiary my-8">
                    <div className="absolute inset-0 flex justify-between items-center">
                        {DECADES.map((decade) => {
                            const data = generatedImages[decade];
                            const isActive = activeDecade === decade;
                            const isGenerated = !!data?.url;
                            const isLoading = !!data?.isLoading;
                            
                            const baseClasses = "w-28 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-300 transform hover:scale-105 text-sm font-bold";
                            const stateClasses = 
                                isActive ? 'bg-brand-cyan border-brand-cyan text-white shadow-glow-cyan' :
                                isGenerated ? 'bg-dark-secondary border-brand-cyan/50 text-brand-cyan' :
                                'bg-dark-secondary border-dark-tertiary text-light-secondary hover:border-light-secondary/50';

                            return (
                                <div key={decade} className="relative flex flex-col items-center">
                                    <div className={`absolute -bottom-5 w-px h-5 ${isActive ? 'bg-brand-cyan' : 'bg-dark-tertiary'}`}></div>
                                    <button
                                        onClick={() => isGenerated ? setActiveDecade(decade) : handleGenerateForDecade(decade)}
                                        disabled={isLoading || isGeneratingAll}
                                        className={`${baseClasses} ${stateClasses}`}
                                    >
                                        {isLoading ? <Loader size="sm" /> : 
                                            isGenerated ? (
                                                <img src={data.url!} alt={decade} className="w-full h-full object-cover"/>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span>{decade}</span>
                                                    <div className="flex items-center gap-1 text-xs text-light-secondary/50">
                                                        <CoinIcon className="w-3 h-3"/>
                                                        <span>{COST_TIME_MACHINE_PER_DECADE}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Машина Времени
                </h1>
                <p className="text-light-secondary max-w-2xl mx-auto">
                    Загрузите свой портрет и путешествуйте по десятилетиям, создавая уникальные образы для каждой эпохи.
                </p>
            </div>
            
             {error && <div className="max-w-3xl mx-auto bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center mb-6">{error}</div>}

            {!originalImage ? (
                <div className="flex justify-center items-center min-h-[400px] animate-fade-in">
                    <div 
                        className="relative w-full max-w-lg border-2 border-dashed border-gray-600 rounded-2xl p-10 text-center flex flex-col justify-center items-center hover:border-brand-cyan transition-colors duration-300"
                        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFileDrop(e.dataTransfer.files); }}
                        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                    >
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileDrop(e.target.files)} />
                        <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg text-light-secondary"><span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите портрет</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (до 4MB)</p>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in space-y-8">
                    <ImageViewer />
                    <Timeline />
                    
                    <div className="bg-dark-secondary p-4 rounded-2xl shadow-lg border border-dark-tertiary/50 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveDecade('original')} className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 ${activeDecade === 'original' ? 'border-brand-cyan' : 'border-transparent'}`}>
                               <img src={originalImage.previewUrl} alt="Original Thumbnail" className="w-full h-full object-cover"/>
                               <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold">Оригинал</div>
                            </button>
                            <div>
                               <h3 className="font-bold text-light-primary">Ваше фото</h3>
                               <button onClick={resetState} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
                                   <TrashIcon className="w-4 h-4" />
                                   Загрузить новое
                               </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerateAll}
                            isLoading={isGeneratingAll}
                            disabled={!originalImage || isGeneratingAll || !hasSufficientBalanceForAll}
                            className="w-full sm:w-auto text-lg"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <ClockIcon className="w-6 h-6" />
                                <span>Запустить машину</span>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${hasSufficientBalanceForAll ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    <CoinIcon className="w-4 h-4" />
                                    <span>{costForAll}</span>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeMachinePage;