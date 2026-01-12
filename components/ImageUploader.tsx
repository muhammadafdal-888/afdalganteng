
import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelect: (image: ImageFile | null) => void;
  selectedImage: ImageFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Harap pilih file gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      onImageSelect({
        file,
        preview: event.target?.result as string,
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl transition-all h-80 flex flex-col items-center justify-center cursor-pointer group
        ${selectedImage 
          ? 'border-transparent' 
          : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'}`}
      onClick={() => !selectedImage && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {selectedImage ? (
        <div className="w-full h-full relative group/image">
          <img 
            src={selectedImage.preview} 
            alt="Preview" 
            className="w-full h-full object-contain rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
            <button 
              onClick={clearImage}
              className="bg-white text-red-500 w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
            >
              <i className="fa-solid fa-trash-can text-xl"></i>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-image text-3xl text-slate-400 group-hover:text-primary-500"></i>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Klik atau drop gambar di sini</p>
          <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG, WEBP (Maks 10MB)</p>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
