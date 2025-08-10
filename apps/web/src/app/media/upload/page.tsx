"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  CloudArrowUpIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlayIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/lib/utils";

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    multiple: true
  });

  const simulateUpload = (files: UploadedFile[]) => {
    setIsUploading(true);

    files.forEach((file, index) => {
      // Simuler la progression
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

      // Nettoyer l'intervalle après 5 secondes
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
      case "uploading":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <DocumentTextIcon className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <PlayIcon className="w-5 h-5 text-green-500" />;
      case "error":
        return <XMarkIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload de Vidéos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Téléchargez vos vidéos pour générer automatiquement des clips
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <Card className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? "Déposez les fichiers ici" : "Glissez-déposez vos vidéos"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ou cliquez pour sélectionner des fichiers
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                MP4, AVI, MOV, MKV, WEBM (max 2GB)
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Fichiers en cours ({uploadedFiles.length})
              </h3>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <video
                      src={file.preview}
                      className="w-16 h-12 object-cover rounded"
                      muted
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.file.size)}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{getStatusText(file.status)}</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(file.status)}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upload Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <VideoCameraIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Formats supportés
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4, AVI, MOV, MKV, WEBM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Taille maximale
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 GB par fichier
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Traitement automatique
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Génération de sous-titres et clips
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">1</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Upload de la vidéo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">2</span>
                </div>
                <span className="text-sm text-gray-500">Génération automatique des sous-titres</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">3</span>
                </div>
                <span className="text-sm text-gray-500">Détection des moments clés</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">4</span>
                </div>
                <span className="text-sm text-gray-500">Création des clips candidats</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
