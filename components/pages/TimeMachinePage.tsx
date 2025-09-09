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
        initial: "A 1950s style portrait. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: authentic vintage Kodachrome color film, high saturation, rich warm tones, realistic film grain, soft focus, classic 1950s fashion, era-appropriate hairstyle like a pompadour or bouffant, natural sunlight, hyperrealistic.",
        regen: "A 1950s Old Hollywood studio portrait. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: classic black and white photograph, high contrast, deep blacks, soft glamorous studio lighting, Rembrandt lighting, elegant formal wear, glamorous styled hair, flawless skin retouching, photographic quality."
    },
    '1960s': {
        initial: "A 1960s mod fashion photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: 60s fashion magazine photo, vibrant but slightly desaturated colors, high contrast, clean graphic look, bright studio lighting, sharp mod suit or dress with bold geometric patterns, sleek bob or bouffant hairstyle, professional.",
        regen: "A late 1960s hippie photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: 35mm film photo, warm sun-drenched saturated tones, heavy film grain, authentic lens flare, natural golden hour sunlight, tie-dye shirt, bell-bottoms, long natural hair with a headband, authentic vintage photo."
    },
    '1970s': {
        initial: "A 1970s style portrait. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: faded 70s Polaroid photograph, warm yellowish tones, low contrast, soft focus, characteristic Polaroid border, natural hazy light, wide-collar shirt, earthy tones, feathered hairstyle, authentic, realistic textures.",
        regen: "A 1970s disco photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: 70s disco club, dynamic colorful disco lights, disco ball, motion blur, lens flare from lights, sparkling glamorous disco attire, big voluminous disco hair, energetic, photographic quality."
    },
    '1980s': {
        initial: "An 80s studio portrait. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: glossy 80s studio photograph, highly saturated vibrant colors, clean sharp look, hard bright studio lighting, neon colors, shoulder pads, big voluminous teased hairstyle, high quality, professional, detailed.",
        regen: "An 80s rock album cover. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: 80s album cover art, dramatic colored spotlights, smoke machine effect, moody high-contrast colors, film grain, leather jacket, ripped jeans, wild rock star hairstyle, iconic, high resolution, professional."
    },
    '1990s': {
        initial: "A 1990s grunge photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: grainy 35mm film photo, muted desaturated colors, slightly underexposed, natural overcast day lighting, flannel shirt, band t-shirt, ripped jeans, messy unkempt hairstyle, authentic, raw, realistic.",
        regen: "A 90s pop style photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: 90s teen magazine style, clean vibrant saturated colors, bright even studio lighting, simple pastel-colored studio backdrop, colorful windbreaker, high-waisted jeans, high ponytail with scrunchie, sharp, high quality."
    },
    '2000s': {
        initial: "A Y2K era photograph. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: early 2000s consumer digital camera photo, slightly oversaturated cool tones, harsh on-camera flash, slight pixelation, Y2K fashion, low-rise jeans, shiny fabrics, authentic low-fi look.",
        regen: "A mid-2000s emo self-portrait. IMPORTANT: The person's face, gender, and all facial features must remain identical to the original photo. Style details: MySpace-style photo, high-angle selfie, moody desaturated color filter, heavy vignetting, side-swept dyed bangs, band t-shirt, skinny jeans, authentic low-resolution digital photo."
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
                     throw new Error(`Модель не вернула изображение для ${decade}.`);
                }
                if (i < DECADES.length - 1) {
                    await delay(1000);
                }
            } catch (err) {
                handleError(err, `Ошибка при генерации для ${decade}`);
                setGeneratedImages(prev => ({ ...prev, [decade]: { url: null, isLoading: false } }));
            }
        }
        setIsGeneratingAll(false);
    };

    const handleRegenerate = async (decade: string) => {
        if (!originalImage || isGeneratingAll) return;
        if (!hasSufficientBalanceForOne) {
            return handleError(new Error(`Недостаточно средств. Требуется: ${COST_TIME_MACHINE_PER_DECADE}, у вас: ${balance}.`));
        }
        
        setError(null);
        setGeneratedImages(prev => ({ ...prev, [decade]: { url: prev[decade]?.url, isLoading: true } }));
        
        try {
            const images = await aiService.editImage(PROMPTS_BY_DECADE[decade].regen, originalImage.base64, originalImage.mimeType, '3:4');
            if (images.length > 0) {
                setGeneratedImages(prev => ({ ...prev, [decade]: { url: images[0], isLoading: false } }));
                onBalanceChange(prev => prev - COST_TIME_MACHINE_PER_DECADE);
            } else {
                 throw new Error(`Модель не вернула изображение для ${decade}.`);
            }
        } catch (err) {
            handleError(err, `Ошибка при регенерации для ${decade}`);
            setGeneratedImages(prev => ({ ...prev, [decade]: { ...prev[decade], isLoading: false } }));
        }
    };

    const renderDecadeCard = (decade: string) => {
        const data = generatedImages[decade];
        const isLoading = data?.isLoading || false;
        const imageUrl = data?.url;

        return (
            <div key={decade} className="relative aspect-[3/4] bg-dark-secondary rounded-lg overflow-hidden shadow-lg border border-dark-tertiary/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader size="md" />
                    </div>
                ) : imageUrl ? (
                    <>
                        <img src={imageUrl} alt={`Image for ${decade}`} className="w-full h-full object-cover" />
                        <button
                            onClick={() => handleRegenerate(decade)}
                            disabled={isGeneratingAll || !hasSufficientBalanceForOne}
                            className="absolute bottom-2 right-2 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors disabled:opacity-50"
                            title="Сгенерировать другой вариант"
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-light-secondary/50">
                        <p>Ошибка</p>
                    </div>
                )}
                <div className="absolute top-0 left-0 bg-black/50 text-white text-sm font-bold px-3 py-1 rounded-br-lg">
                    {decade}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Машина Времени
                </h1>
                <p className="text-light-secondary max-w-2xl mx-auto">
                    Загрузите свой портрет и посмотрите, как бы вы выглядели в разные десятилетия прошлого.
                </p>
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-8">
                     {!originalImage ? (
                        <div 
                            className="relative w-full h-full min-h-[300px] lg:min-h-full border-2 border-dashed border-gray-600 rounded-lg p-10 text-center flex flex-col justify-center items-center hover:border-brand-cyan transition-colors duration-300"
                            onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFileDrop(e.dataTransfer.files); }}
                            onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                        >
                            <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileDrop(e.target.files)} />
                            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-lg text-light-secondary"><span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите</p>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (до 4MB)</p>
                        </div>
                    ) : (
                        <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-4 animate-fade-in text-center sticky top-24">
                            <h2 className="text-xl font-bold text-light-primary font-display">Ваше фото</h2>
                            <div className="relative w-full aspect-[3/4] mx-auto">
                                <img src={originalImage.previewUrl} alt="Original" className="rounded-lg w-full h-full object-cover shadow-lg"/>
                                <button onClick={() => { setOriginalImage(null); setGeneratedImages({}); }} className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110" aria-label="Удалить изображение">
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            </div>
                            <Button
                                onClick={handleGenerateAll}
                                isLoading={isGeneratingAll}
                                disabled={!originalImage || isGeneratingAll || !hasSufficientBalanceForAll}
                                className="w-full text-lg"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ClockIcon className="w-6 h-6" />
                                    <span>Запустить машину времени</span>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${hasSufficientBalanceForAll ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        <CoinIcon className="w-4 h-4" />
                                        <span>{costForAll}</span>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    )}
                </div>
                
                 <div className="lg:col-span-8">
                     {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center mb-6">{error}</div>}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {DECADES.map(renderDecadeCard)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeMachinePage;