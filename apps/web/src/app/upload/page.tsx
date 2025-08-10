"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading"
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    simulateUpload(newFiles);
  }, []);

  const simulateUpload = (files: UploadedFile[]) => {
    setIsUploading(true);

    files.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            let newStatus = f.status;

            if (newProgress >= 100) {
              newStatus = "processing";
              setTimeout(() => {
                setUploadedFiles(prev => prev.map(f2 =>
                  f2.id === file.id ? { ...f2, status: "completed" } : f2
                ));
              }, 2000);
            }

            return { ...f, progress: newProgress, status: newStatus };
          }
          return f;
        }));
      }, 200);

      setTimeout(() => clearInterval(interval), 5000);
    });

    setTimeout(() => setIsUploading(false), 5000);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading": return "⏳";
      case "processing": return "⚙️";
      case "completed": return "✅";
      case "error": return "❌";
      default: return "⏳";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading": return "Upload en cours...";
      case "processing": return "Traitement...";
      case "completed": return "Terminé";
      case "error": return "Erreur";
      default: return "En attente";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Reelgen</span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/media" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Médias
              </Link>
              <Link href="/clips" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Clips
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Templates
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <span className="mr-2">👤</span>
                Profil
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload de Vidéos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Téléchargez vos vidéos et laissez l'IA générer automatiquement des clips viraux
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Zone */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">📹</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Glissez-déposez vos vidéos
                </h3>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <p className="text-sm text-gray-500">
                  MP4, AVI, MOV, MKV, WEBM (max 2GB)
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onDrop(files);
                  }}
                />
              </div>
            </div>

            {/* Upload Progress */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fichiers en cours ({uploadedFiles.length})
                </h3>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0">
                        <video
                          src={file.preview}
                          className="w-16 h-12 object-cover rounded-lg"
                          muted
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>{getStatusText(file.status)}</span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-lg">{getStatusIcon(file.status)}</span>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <span className="text-gray-400 hover:text-red-500">🗑️</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fonctionnalités incluses
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🎬</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Génération automatique
                    </p>
                    <p className="text-xs text-gray-600">
                      L'IA détecte les moments clés
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📝</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Sous-titres intelligents
                    </p>
                    <p className="text-xs text-gray-600">
                      Transcription et stylisation automatique
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Optimisation IA
                    </p>
                    <p className="text-xs text-gray-600">
                      Format et timing optimisés
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
              <h3 className="text-lg font-semibold mb-4">
                Prochaines étapes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <span className="text-sm">Upload de la vidéo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <span className="text-sm">Analyse IA automatique</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <span className="text-sm">Génération des clips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">4</span>
                  </div>
                  <span className="text-sm">Prêt à publier !</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Formats supportés
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>MP4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>AVI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>MOV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>MKV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>WEBM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Jusqu'à 2GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
