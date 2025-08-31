
import React, { useState, useCallback, DragEvent } from 'react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import * as aiService from '../../services/aiService';
import MagicWandIcon from '../icons/MagicWandIcon';
import ImageIcon from '../icons/ImageIcon';
import TrashIcon from '../icons/TrashIcon';
import { ImageAspectRatio } from '../../types';
import ImageModal from '../ImageModal';
import EnlargeIcon from '../icons/EnlargeIcon';
import ArrowsRightLeftIcon from '../icons/ArrowsRightLeftIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import PaintBrushIcon from '../icons/PaintBrushIcon';
import BrainIcon from '../icons/BrainIcon';
import CameraIcon from '../icons/CameraIcon';
import AnimeFaceIcon from '../icons/AnimeFaceIcon';
import VintageCameraIcon from '../icons/VintageCameraIcon';
import StarIcon from '../icons/StarIcon';
import BoltIcon from '../icons/BoltIcon';
import SparkleIcon from '../icons/SparkleIcon';


interface UploadedImage {
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
}

const AVATAR_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a soft digital painting. CRITICAL: Perfectly preserve the person's original face and features. Background: simple blurred park at sunset. Add subtle "ART_IRBIT" watermark.`;
const OIL_PAINTING_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a classical oil painting. CRITICAL: Perfectly preserve the person's original face and features. Use textured brushstrokes. Background: dark and simple. Add "ART_IRBIT" as a subtle artist signature.`;
const NEON_MIND_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a cyberpunk portrait. CRITICAL: Perfectly preserve the person's original face and features. Add subtle neon highlights. Background: dark, rainy city with neon lights. Add "ART_IRBIT" as a small neon sign.`;
const CINEMATIC_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a cinematic movie still. CRITICAL: Perfectly preserve the person's original face and features. Apply high-contrast, dramatic lighting and movie color grade. Add "ART_IRBIT" as a subtle watermark.`;
const ANIME_SOUL_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a modern anime style. CRITICAL: The person's original face must be recognizable but adapted to the anime aesthetic. Background: simple anime scene. Add "ART_IRBIT" as a subtle logo.`;
const RETRO_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into a vintage 1950s photograph. CRITICAL: Perfectly preserve the person's original face, features, and gender. Apply soft focus, warm colors, and film grain. Add "ART_IRBIT" as a subtle watermark.`;
const GTA_STYLE_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into the high-contrast art style of a GTA game cover. CRITICAL: Perfectly preserve the person's original face and features. Background: vibrant city scene. Add "ART_IRBIT" as subtle graffiti.`;
const MYTHIC_PROMPT = `Task: edit image. Output: image only, no text. Transform photo into an epic fantasy portrait. CRITICAL: Perfectly preserve the person's original face and features. Change clothing into detailed fantasy armor. Background: majestic landscape.`;
const BEAUTY_PROMPT = `Task: edit image. Output: image only, no text. Perform a hyper-realistic beauty retouch. CRITICAL: Perfectly preserve and enhance the person's original face, do not change features. Give skin a flawless, natural glow. Apply subtle "no-makeup" makeup. Lighting: soft and flattering. Background: simple and blurred. Add "ART_IRBIT" as a subtle watermark.`;

const styles = [
    { label: "Аватар", prompt: AVATAR_PROMPT, Icon: UserCircleIcon },
    { label: "Картина", prompt: OIL_PAINTING_PROMPT, Icon: PaintBrushIcon },
    { label: "Киберпанк", prompt: NEON_MIND_PROMPT, Icon: BrainIcon },
    { label: "Кино", prompt: CINEMATIC_PROMPT, Icon: CameraIcon },
    { label: "Аниме", prompt: ANIME_SOUL_PROMPT, Icon: AnimeFaceIcon },
    { label: "Ретро", prompt: RETRO_PROMPT, Icon: VintageCameraIcon },
    { label: "GTA-стиль", prompt: GTA_STYLE_PROMPT, Icon: StarIcon },
    { label: "Фэнтези", prompt: MYTHIC_PROMPT, Icon: BoltIcon },
    { label: "Бьюти", prompt: BEAUTY_PROMPT, Icon: SparkleIcon }
];

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

const EditorPage: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('3:4');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [editHistory, setEditHistory] = useState<string[]>([]);

    const handleFileDrop = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите файл изображения.');
            return;
        }
        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            setError('Размер файла не должен превышать 4 МБ.');
            return;
        }
        setError(null);
        setEditedImage(null);
        setPrompt('');
        setSliderPosition(50);
        setEditHistory([]);
        try {
            const data = await fileToData(file);
            setOriginalImage({ file, ...data });
        } catch (err: any) {
            setError(err.message || 'Ошибка при чтении файла.');
        }
    }, []);

    const handleRemoveImage = useCallback(() => {
        if (originalImage) {
            URL.revokeObjectURL(originalImage.previewUrl);
        }
        setOriginalImage(null);
        setEditedImage(null);
        setError(null);
        setEditHistory([]);
    }, [originalImage]);

    const handleEdit = useCallback(async (finalPrompt: string) => {
        const imageToEdit = editedImage || originalImage?.base64;
        const mimeTypeToEdit = originalImage?.mimeType;

        if (!imageToEdit || !mimeTypeToEdit) {
            setError('Сначала загрузите изображение.');
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const images = await aiService.editImage(finalPrompt, imageToEdit.split(',').pop() || imageToEdit, mimeTypeToEdit, aspectRatio);
            if (images && images.length > 0) {
                const newImage = images[0];
                setEditedImage(newImage);
                setEditHistory(prev => [...prev, newImage]);
                setSliderPosition(100);
            } else {
                throw new Error('Модель не вернула изображение.');
            }
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Не удалось отредактировать изображение.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, editedImage, aspectRatio]);

    const handlePresetClick = useCallback((presetPrompt: string) => {
        setPrompt(''); 
        handleEdit(presetPrompt);
    }, [handleEdit]);

    const handleCustomPromptEnhance = useCallback(async () => {
        if (!prompt.trim() || !originalImage) return;
        setIsEnhancing(true);
        setError(null);
        try {
            const enhanced = await aiService.enhanceCustomPrompt(prompt);
            setPrompt(enhanced);
            await handleEdit(enhanced);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Ошибка улучшения промпта.');
        } finally {
            setIsEnhancing(false);
        }
    }, [prompt, originalImage, handleEdit]);
    
    const HistoryThumbnail = ({ src, onClick }: { src: string; onClick: () => void }) => (
        <button onClick={onClick} className="w-16 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 ring-brand-cyan ring-offset-2 ring-offset-dark-secondary">
            <img src={src} alt="Edit history" className="w-full h-full object-cover"/>
        </button>
    );

    return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                AI Редактор Изображений
            </h1>
            <p className="text-light-secondary max-w-2xl mx-auto">
                Загрузите фото и преобразите его с помощью AI. Применяйте готовые стили или создавайте свои собственные.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
                {originalImage && (
                    <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-bold text-light-primary mb-3 font-display">Применить стиль</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {styles.map((style) => (
                                    <Button
                                        key={style.label}
                                        onClick={() => handlePresetClick(style.prompt)}
                                        disabled={isLoading || isEnhancing}
                                        Icon={style.Icon}
                                        variant="secondary"
                                        className="w-full justify-start text-base py-3"
                                    >
                                        {style.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center text-center">
                            <div className="flex-grow border-t border-dark-tertiary"></div>
                            <span className="flex-shrink mx-4 text-light-secondary text-sm">ИЛИ</span>
                            <div className="flex-grow border-t border-dark-tertiary"></div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-light-primary font-display">Свой промт</h2>
                             <p className="text-sm text-light-secondary/70">
                                Загружайте свои изображения, объединяйте их и меняйте так же легко, как общаетесь в чате. Каждый новый запрос продолжает изменять текущее изображение.
                            </p>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Например: сделай волосы синими"
                                className="w-full h-24 bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200 resize-none"
                                disabled={isLoading || isEnhancing}
                            />
                            <Button
                                onClick={handleCustomPromptEnhance}
                                isLoading={isEnhancing}
                                disabled={!prompt.trim() || isLoading}
                                className="w-full"
                                Icon={MagicWandIcon}
                            >
                                Улучшить и применить
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-5">
                {!originalImage ? (
                    <div 
                        className="relative w-full h-full min-h-[400px] lg:min-h-full border-2 border-dashed border-gray-600 rounded-lg p-10 text-center flex flex-col justify-center items-center hover:border-brand-cyan transition-colors duration-300"
                        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFileDrop(e.dataTransfer.files); }}
                        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                    >
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileDrop(e.target.files)} />
                        <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg text-light-secondary"><span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (до 4MB)</p>
                    </div>
                ) : (
                    <div className="sticky top-24">
                        <div className="relative w-full mx-auto group">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-lg bg-dark-tertiary">
                                <img src={originalImage.previewUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover select-none"/>

                                {isLoading ? (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                                        <Loader size="lg" />
                                        <p className="mt-4 text-light-secondary">Применяем магию...</p>
                                    </div>
                                ) : editedImage ? (
                                    <>
                                        <div className="absolute inset-0 w-full h-full select-none">
                                            <img
                                                src={editedImage}
                                                alt="Edited"
                                                className="absolute inset-0 w-full h-full object-cover"
                                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                            />
                                        </div>
                                        
                                        <div
                                            className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize pointer-events-none"
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
                                            className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
                                            aria-label="Image comparison slider"
                                        />

                                        <button onClick={() => setIsModalOpen(true)} className="absolute bottom-4 right-4 p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors" aria-label="Увеличить">
                                            <EnlargeIcon className="w-6 h-6" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                                        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Оригинал</span>
                                        <p className="text-light-secondary text-center">Выберите стиль, чтобы начать редактирование</p>
                                    </div>
                                )}
                            </div>
                             <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110" aria-label="Удалить изображение">
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center mt-4 max-w-3xl mx-auto">{error}</div>}
        
        {editHistory.length > 0 && (
            <div className="space-y-4">
                 <h2 className="text-xl font-bold text-light-primary font-display text-center">История проекта</h2>
                <div className="flex justify-center items-center gap-4 flex-wrap bg-dark-secondary p-4 rounded-xl border border-dark-tertiary/50">
                   <HistoryThumbnail src={originalImage!.previewUrl} onClick={() => setEditedImage(null)} />
                   {editHistory.map((imgSrc, index) => (
                       <HistoryThumbnail key={index} src={imgSrc} onClick={() => setEditedImage(imgSrc)} />
                   ))}
                </div>
            </div>
        )}

        {isModalOpen && editedImage && (
            <ImageModal
                images={[editedImage]}
                currentIndex={0}
                onClose={() => setIsModalOpen(false)}
                onNavigate={() => {}}
            />
        )}
    </div>
    );
};

export default EditorPage;
