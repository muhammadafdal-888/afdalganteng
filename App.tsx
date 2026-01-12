
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultGallery from './components/ResultGallery';
import { geminiService } from './services/geminiService';
import { ImageFile, GeneratedImage, Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [manualPrompt, setManualPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoPrompting, setIsAutoPrompting] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(Theme.DARK);
    }
  }, []);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  const handleImageSelect = (image: ImageFile | null) => {
    setSelectedImage(image);
    setError(null);
  };

  const handleAutoPrompt = async () => {
    if (!selectedImage) return;
    setIsAutoPrompting(true);
    setError(null);
    try {
      const prompt = await geminiService.generateAutoPrompt(selectedImage.base64);
      setManualPrompt(prompt);
    } catch (err) {
      setError("Gagal menghasilkan prompt otomatis. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsAutoPrompting(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setIsGenerating(true);
    setError(null);
    try {
      const promptToUse = manualPrompt || "Professional product photography style";
      const imageUrl = await geminiService.transformToProductPhoto(selectedImage.base64, promptToUse);
      
      const newResult: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: promptToUse,
        timestamp: Date.now(),
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      setError("Gagal mengedit foto. Pastikan koneksi internet stabil dan coba lagi.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
            Foto Produk Maker
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Ubah foto produk biasa menjadi mahakarya profesional menggunakan kecerdasan buatan Gemini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Uploader Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <i className="fa-solid fa-cloud-arrow-up text-primary-500"></i>
              Upload Foto Produk
            </h2>
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              selectedImage={selectedImage}
            />
          </div>

          {/* Controls Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-primary-500"></i>
              Kustomisasi AI
            </h2>

            <div className="space-y-6 flex-grow">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Prompt Kustom (Opsional)
                </label>
                <textarea
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Contoh: Sebuah botol parfum di atas meja marmer dengan cahaya matahari terbenam..."
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAutoPrompt}
                  disabled={!selectedImage || isAutoPrompting || isGenerating}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:hover:bg-primary-900/20"
                >
                  {isAutoPrompting ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-bolt"></i>
                  )}
                  Auto Prompt
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedImage || isGenerating || isAutoPrompting}
                  className="flex-[1.5] py-3 px-6 rounded-xl gradient-blue text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-play"></i>
                  )}
                  Proses Foto
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 text-center italic">
                Tips: Gunakan "Auto Prompt" untuk membiarkan AI menganalisis produk Anda dan menciptakan latar belakang yang paling sesuai.
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white">Hasil Kreasi</h2>
              <span className="text-sm text-slate-500">{results.length} Foto Dihasilkan</span>
            </div>
            <ResultGallery results={results} />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            © 2024 AFDAL GANTENG. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><i className="fa-brands fa-instagram text-xl"></i></a>
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><i className="fa-brands fa-tiktok text-xl"></i></a>
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><i className="fa-brands fa-whatsapp text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
