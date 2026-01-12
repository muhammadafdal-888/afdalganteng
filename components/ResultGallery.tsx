
import React from 'react';
import { GeneratedImage } from '../types';

interface ResultGalleryProps {
  results: GeneratedImage[];
}

const ResultGallery: React.FC<ResultGalleryProps> = ({ results }) => {
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item) => (
        <div 
          key={item.id} 
          className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img 
              src={item.url} 
              alt="Generated Result" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => downloadImage(item.url, `afdal-ganteng-${item.id}.png`)}
                  className="bg-white text-slate-900 py-2 px-5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-xl"
                >
                  <i className="fa-solid fa-download"></i>
                  Simpan
                </button>
                <div className="flex gap-2">
                  <button className="bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">AI Enhanced</span>
              <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">
              "{item.prompt}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultGallery;
