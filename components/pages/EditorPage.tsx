
import React, { useState, useCallback, DragEvent } from 'react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import * as aiService from '../../services/aiService';
import MagicWandIcon from '../icons/MagicWandIcon';
import ImageIcon from '../icons/ImageIcon';
import EraserIcon from '../icons/EraserIcon';
import BrushIcon from '../icons/BrushIcon';
import TrashIcon from '../icons/TrashIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import PaintBrushIcon from '../icons/PaintBrushIcon';
import BrainIcon from '../icons/BrainIcon';
import Squares2x2Icon from '../icons/Squares2x2Icon';
import AnimeFaceIcon from '../icons/AnimeFaceIcon';
import VintageCameraIcon from '../icons/VintageCameraIcon';
import StarIcon from '../icons/StarIcon';
import BoltIcon from '../icons/BoltIcon';
import GlitchIcon from '../icons/GlitchIcon';
import { ImageAspectRatio } from '../../types';
import { ASPECT_RATIOS } from '../../constants';
import SelectInput from '../common/SelectInput';
import ImageModal from '../ImageModal';
import EnlargeIcon from '../icons/EnlargeIcon';

interface UploadedImage {
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
}

const AVATAR_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the entire image into a soft, realistic digital painting. Keep the subject's likeness. The background should be a dreamy urban park at golden hour, painted in the same style. Mood should be modern and confident. Include a subtle "ART_IRBIT" logo. 8K, ultra-detailed.`;
const OIL_PAINTING_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the provided photo into a timeless oil painting portrait. Render in a classical realist style with rich, textured brushwork and deep chiaroscuro. IMPORTANT: Strictly preserve the original's likeness and features. The background should be dark and softly blurred. Integrate "ART_IRBIT" as a subtle artist's signature.`;
const NEON_MIND_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform into a futuristic cyberpunk portrait. Hyper-realistic face with neon augmentations (glowing eyes, iridescent hair, faint circuit patterns on skin). Dramatic cinematic lighting. Background: a rainy, futuristic cityscape at night with neon signs. Integrate "ART_IRBIT" as a neon sign. 8K, hyper-modern, edgy.`;
const LOW_POLY_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the entire image into a geometric low-poly style. Use faceted planes, clean vector-like edges, and bold high-contrast colors. Apply dramatic chiaroscuro lighting. The background should also be a complementary low-poly design. Integrate "ART_IRBIT" logo as a small vector tag. Mood: mysterious, powerful.`;
const ANIME_SOUL_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the entire image into a high-quality modern anime style, inspired by Makoto Shinkai. Give the subject luminous skin, large expressive eyes, and flowing hair. Use soft, cinematic golden-hour lighting. The background should be a dreamy anime scene (cherry blossoms or city at dusk). Subtly integrate "ART_IRBIT" as a holographic tag. Mood: serene, magical. 8K, ultra-detailed.`;
const RETRO_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform into a vintage Hollywood glamour portrait (1950s film still). Use soft, dramatic Rembrandt lighting, warm golden tones, and subtle film grain. IMPORTANT: Strictly preserve the subject's original gender and facial features. The background should be a softly blurred vintage interior. Subtly integrate "ART_IRBIT" as an engraved plaque. Mood: sophisticated, timeless. 8K.`;
const GTA_STYLE_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the provided photo into a stylized portrait in the iconic visual style of Grand Theft Auto (GTA) game covers — bold, cinematic, and urban. Render the subject as a central character in a high-stakes crime drama, standing confidently against a vibrant cityscape at night: neon-lit skyscrapers, palm trees, distant police lights, and glowing billboards. Use dramatic low-angle lighting with strong shadows and high contrast — deep blacks, electric pink and cyan highlights, and a slight lens flare for intensity. The subject is sharply dressed in urban streetwear: leather jacket, hoodie, aviator sunglasses (optional), or sleek suit — depending on original outfit, gently stylized to fit the GTA universe. Skin is realistic with subtle texture, hair has dynamic volume and shine. Expression: cool, confident, slightly dangerous — a smirk or intense gaze. Apply the signature GTA visual treatment: overlay a bold, angular title treatment in the background in the official GTA font (clean, sans-serif, with sharp edges and neon outline). Integrate the branding "ART_IRBIT" as part of the cityscape: a glowing neon sign on a rooftop, a digital billboard ad, or a graffiti tag on a wall — fully blended into the environment. Add subtle graphic elements: radial light lines, speed streaks, or a faint grid overlay (like a radar) to enhance the game UI aesthetic. Color grading: saturated, with teal-and-orange or magenta-and-cyan contrast, inspired by GTA V and Vice City. Style: video game cover art, cinematic urban portrait, hyper-stylized realism. Mood: powerful, rebellious, cinematic. Output: 8K resolution, ultra-detailed, aspect ratio 2:3, designed to look like an official GTA promotional artwork.`;
const MYTHIC_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the entire image into a mythic cinematic portrait. The subject should look like a divine figure with glowing eyes and a radiant aura. Use dramatic, high-contrast lighting. The background must be an epic landscape, like a stormy sky or ancient ruins, matching the style. Integrate a subtle "ART_IRBIT" logo. Style: epic concept art, 8K.`;
const GLITCH_ART_PROMPT = `Задача: отредактировать изображение. Вывод: только изображение, без текста. Transform the photo into a stylized glitch art portrait. Partially fragment the face with digital distortion, pixel displacement, and RGB color channel splitting, but keep the eyes and lips clear for contrast. Background: dark cyber grid or abstract digital void. Integrate "ART_IRBIT" as corrupted text. Style: edgy, futuristic, cyberpunk. 8K.`;


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
    const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);

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
        try {
            const { previewUrl, base64, mimeType } = await fileToData(file);
            setOriginalImage({ file, previewUrl, base64, mimeType });
        } catch (err) {
            handleError(err);
        }
    }, []);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileDrop(e.dataTransfer.files);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileDrop(e.target.files);

    const handleRemoveImage = () => {
        setOriginalImage(null);
        setEditedImage(null);
        setPrompt('');
        setError(null);
    };

    const handleError = (err: any) => {
        const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
        setError(message);
    };

    const handleGenerate = async (generationPrompt: string) => {
        if (!originalImage || !generationPrompt.trim()) {
            setError('Загрузите изображение и предоставьте промпт для начала.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const images = await aiService.editImage(generationPrompt, originalImage.base64, originalImage.mimeType, aspectRatio);
            if (images.length > 0) {
                setEditedImage(images[0]);
            } else {
                throw new Error('Модель не вернула изображение.');
            }
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCustomGenerate = async () => {
        if (!prompt.trim() || !originalImage) {
            setError('Загрузите изображение и введите свой вариант промпта.');
            return;
        }
        
        setIsEnhancing(true);
        setError(null);
        setEditedImage(null);

        try {
            // Этап 1: Улучшение промпта
            const enhancedPrompt = await aiService.enhanceCustomPrompt(prompt);
            
            // Этап 2: Редактирование изображения с улучшенным промптом
            await handleGenerate(enhancedPrompt);

        } catch (err) {
            handleError(err);
        } finally {
            setIsEnhancing(false);
        }
    };

    const ImageUploader = () => (
         <div 
          className="relative w-full h-full min-h-[400px] border-2 border-dashed border-gray-600 rounded-lg p-6 text-center flex flex-col justify-center items-center hover:border-brand-cyan transition-colors duration-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
            <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-light-secondary">
                <span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите изображение
            </p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (до 4MB)</p>
        </div>
    );
    
    const ToolButton: React.FC<{ Icon: React.ElementType, label: string, disabled?: boolean }> = ({ Icon, label, disabled = false }) => (
        <button
            disabled={disabled}
            className="flex flex-col items-center gap-2 p-3 bg-dark-tertiary rounded-lg text-light-secondary hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
            title="Функция в разработке"
        >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
        </button>
    );

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-6 self-start">
                    <h1 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">Редактор Изображений</h1>
                    {!originalImage && <p className="text-light-secondary">Загрузите изображение, чтобы увидеть опции редактирования.</p>}
                    {originalImage && (
                        <div className="space-y-6 animate-fade-in">
                            
                            {/* Output Settings */}
                            <div>
                                <h2 className="text-lg font-semibold text-light-primary mb-3">Настройки вывода</h2>
                                <SelectInput 
                                    label="Соотношение сторон" 
                                    name="aspectRatio" 
                                    options={ASPECT_RATIOS} 
                                    value={aspectRatio} 
                                    onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)} 
                                />
                                <p className="text-xs text-light-secondary/60 mt-1">Модель постарается соблюсти пропорции, но результат не гарантирован.</p>
                            </div>

                            {/* Quick Styles Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-light-primary mb-3">Быстрые стили</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button onClick={() => handleGenerate(AVATAR_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={UserCircleIcon}>Аватар</Button>
                                    <Button onClick={() => handleGenerate(OIL_PAINTING_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={PaintBrushIcon}>Масло</Button>
                                    <Button onClick={() => handleGenerate(NEON_MIND_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={BrainIcon}>Neon Mind</Button>
                                    <Button onClick={() => handleGenerate(LOW_POLY_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={Squares2x2Icon}>Лоу-поли</Button>
                                    <Button onClick={() => handleGenerate(ANIME_SOUL_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={AnimeFaceIcon}>Anime Soul</Button>
                                    <Button onClick={() => handleGenerate(RETRO_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={VintageCameraIcon}>Retro</Button>
                                    <Button onClick={() => handleGenerate(GTA_STYLE_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={StarIcon}>GTA Style</Button>
                                    <Button onClick={() => handleGenerate(MYTHIC_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={BoltIcon}>Мифический</Button>
                                    <Button onClick={() => handleGenerate(GLITCH_ART_PROMPT)} isLoading={isLoading} className="w-full text-sm flex-col h-20 gap-1" Icon={GlitchIcon}>Glitch Art</Button>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="flex items-center text-center !my-8">
                                <div className="flex-grow border-t border-dark-tertiary"></div>
                                <span className="flex-shrink mx-4 text-light-secondary text-sm font-semibold">ИЛИ</span>
                                <div className="flex-grow border-t border-dark-tertiary"></div>
                            </div>

                            {/* Custom Prompt Section */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium text-light-secondary mb-1">Свой вариант (на русском)</label>
                                    <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Например: Добавь коту футуристический шлем" className="w-full h-24 bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200 resize-none" />
                                </div>
                                <Button 
                                    onClick={handleCustomGenerate} 
                                    isLoading={isEnhancing} 
                                    disabled={!prompt.trim() || isEnhancing} 
                                    className="w-full text-lg" 
                                    Icon={MagicWandIcon} 
                                    variant="secondary"
                                >
                                    Применить
                                </Button>
                            </div>
                            
                            {/* Tools Section (kept for future) */}
                            <div className="!mt-8 pt-6 border-t border-dark-tertiary/50">
                                <h2 className="text-lg font-semibold text-light-primary mb-2">Инструменты (в разработке)</h2>
                                <div className="grid grid-cols-3 gap-2">
                                    <ToolButton Icon={EraserIcon} label="Удалить фон" disabled/>
                                    <ToolButton Icon={BrushIcon} label="Маска" disabled/>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center text-sm">{error}</div>}
                </div>

                {/* Image Display */}
                <div className="lg:col-span-2 bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50">
                    <div className="w-full aspect-square bg-dark-tertiary rounded-lg flex items-center justify-center relative overflow-hidden">
                        {!originalImage ? <ImageUploader /> : (
                            <div className="w-full h-full relative">
                                {editedImage ? (
                                    <div className="flex flex-col md:flex-row w-full h-full gap-2 p-2">
                                        <div className="relative flex flex-1 flex-col items-center justify-center min-h-0 bg-black/20 rounded-lg">
                                            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">Оригинал</span>
                                            <img src={originalImage.previewUrl} alt="Оригинал" className="object-contain w-full h-full" />
                                        </div>
                                        <div 
                                            className="relative flex flex-1 flex-col items-center justify-center min-h-0 bg-black/20 rounded-lg group cursor-pointer"
                                            onClick={() => editedImage && setIsModalOpen(true)}
                                            role="button"
                                            aria-label="Увеличить результат"
                                        >
                                            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">Результат</span>
                                            <img src={editedImage} alt="Отредактированное" className="object-contain w-full h-full group-hover:opacity-80 transition-opacity" />
                                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <EnlargeIcon className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <img src={originalImage.previewUrl} alt="Оригинал" className={`object-contain w-full h-full transition-opacity duration-500 ${isLoading || isEnhancing ? 'opacity-30' : 'opacity-100'}`} />
                                )}
                                
                                <button onClick={handleRemoveImage} className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 z-10" aria-label="Удалить изображение">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                                {(isLoading || isEnhancing) && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                                        <Loader size="lg" />
                                        <p className="mt-4 text-light-primary">{isEnhancing ? 'Улучшение промпта...' : 'Магия в процессе...'}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
             {editedImage && isModalOpen && (
                <ImageModal
                    images={[editedImage]}
                    currentIndex={0}
                    onClose={() => setIsModalOpen(false)}
                    onNavigate={() => {}} // No navigation needed for a single image
                />
            )}
        </>
    );
};

export default EditorPage;
