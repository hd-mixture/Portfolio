"use client";

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Check, RotateCw, ZoomIn, ZoomOut, 
    RefreshCw, Crop as CropIcon, Sparkles, Image as ImageIcon,
    Sliders, Move
} from 'lucide-react';
import Image from 'next/image';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => Promise<void> | void;
    aspectRatio?: number;
    cropShape?: 'round' | 'rect';
    title?: string;
    description?: string;
}

// Utility to create image element
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

// Helper for canvas rotation
function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

// Utility to generate cropped Blob
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d canvas context');
    }

    const rotRad = getRadianAngle(rotation);

    // Calculate bounding box of rotated image
    const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
    const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
        throw new Error('No cropped canvas context');
    }

    // Set export dimensions (capped for performance & quality)
    const targetSize = Math.min(1000, Math.max(pixelCrop.width, pixelCrop.height));
    croppedCanvas.width = targetSize;
    croppedCanvas.height = targetSize;

    croppedCtx.imageSmoothingQuality = 'high';
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetSize,
        targetSize
    );

    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/webp', 0.95);
    });
}

export default function ImageCropperModal({
    isOpen,
    imageSrc,
    onClose,
    onCropComplete,
    aspectRatio = 1,
    cropShape = 'round',
    title = "Crop Client Avatar",
    description = "Adjust and frame the client photo perfectly for testimonials."
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const handleCropAreaChange = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    const handleApplyCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            await onCropComplete(croppedBlob);
            onClose();
        } catch (error) {
            console.error("Failed to crop image", error);
            alert("Failed to crop image. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop Blur */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity z-[100000]"
                    style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                />

                {/* Modal Window */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-[#141724] rounded-[32px] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col z-[10000] my-auto"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
                                <CropIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    {title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Cropper Viewport Container */}
                    <div className="relative w-full h-[340px] sm:h-[380px] bg-[#0c0e17] overflow-hidden select-none">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            cropShape={cropShape}
                            showGrid={true}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={handleCropAreaChange}
                            classes={{
                                containerClassName: 'relative w-full h-full',
                                cropAreaClassName: 'border-2 border-orange-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] rounded-full'
                            }}
                        />

                        {/* Helper Overlay Hint */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                            <Move size={12} className="text-orange-400" />
                            <span>Drag to reposition & zoom to frame</span>
                        </div>
                    </div>

                    {/* Interactive Controls Bar */}
                    <div className="p-6 sm:p-7 space-y-5 bg-white dark:bg-[#141724]">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            {/* Zoom Slider */}
                            <div className="sm:col-span-8 flex items-center gap-3 bg-slate-50 dark:bg-[#0c0e17] px-4 py-3 rounded-2xl border border-slate-100 dark:border-white/5">
                                <button 
                                    type="button"
                                    onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                                    className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={16} />
                                </button>
                                
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full accent-orange-500 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />

                                <button 
                                    type="button"
                                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                                    className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={16} />
                                </button>

                                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 w-10 text-right">
                                    {zoom.toFixed(1)}x
                                </span>
                            </div>

                            {/* Rotation & Reset Buttons */}
                            <div className="sm:col-span-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleRotate}
                                    className="flex-1 py-3 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0e17] dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                    title="Rotate 90 degrees"
                                >
                                    <RotateCw size={14} className="text-orange-500" />
                                    <span>Rotate</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="py-3 px-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0e17] dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                                    title="Reset framing"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isProcessing}
                                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleApplyCrop}
                                disabled={isProcessing}
                                className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin text-white" />
                                        <span>Applying Crop...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>Crop & Save Photo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
