"use client";

import { useState } from "react";
import {
  ScissorsIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils";

interface Clip {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  status: "candidate" | "approved" | "rejected";
  thumbnail: string;
  hashtags: string[];
}

const mockClips: Clip[] = [
  {
    id: 1,
    title: "Introduction aux Hooks React",
    description: "Découvrez les hooks React et leur utilisation",
    startTime: 45,
    endTime: 105,
    duration: 60,
    score: 0.92,
    status: "candidate",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    hashtags: ["#react", "#hooks", "#javascript"]
  },
  {
    id: 2,
    title: "useState vs useReducer",
    description: "Comparaison entre useState et useReducer",
    startTime: 180,
    endTime: 240,
    duration: 60,
    score: 0.88,
    status: "approved",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
    hashtags: ["#react", "#usestate", "#usereducer"]
  },
  {
    id: 3,
    title: "Custom Hooks",
    description: "Création de hooks personnalisés",
    startTime: 320,
    endTime: 380,
    duration: 60,
    score: 0.85,
    status: "candidate",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    hashtags: ["#react", "#customhooks", "#javascript"]
  }
];

export default function ClipsPage() {
  const [clips, setClips] = useState<Clip[]>(mockClips);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [filter, setFilter] = useState<"all" | "candidate" | "approved" | "rejected">("all");

  const filteredClips = clips.filter(clip => filter === "all" || clip.status === filter);

  const handleClipAction = (clipId: number, action: "approve" | "reject") => {
    setClips(prev => prev.map(clip =>
      clip.id === clipId
        ? { ...clip, status: action === "approve" ? "approved" : "rejected" }
        : clip
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "rejected": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "candidate": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approuvé";
      case "rejected": return "Rejeté";
      case "candidate": return "Candidat";
      default: return "Inconnu";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Clips
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos clips générés automatiquement par l'IA
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Générer Clips IA
          </Button>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Créer Clip Manuel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer:</span>
        {(["all", "candidate", "approved", "rejected"] as const).map((filterOption) => (
          <Button
            key={filterOption}
            size="sm"
            variant={filter === filterOption ? "default" : "outline"}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption === "all" ? "Tous" :
             filterOption === "candidate" ? "Candidats" :
             filterOption === "approved" ? "Approuvés" : "Rejetés"}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <video
                  src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                  className="w-full h-64 lg:h-80 object-cover rounded-lg"
                  poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-8 h-8" />
                    ) : (
                      <PlayIcon className="w-8 h-8" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(1547)}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / 1547) * 100}%` }}
                    />
                  </div>
                  {/* Clip markers */}
                  {clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="absolute top-0 h-2 bg-blue-500 opacity-60 cursor-pointer"
                      style={{
                        left: `${(clip.startTime / 1547) * 100}%`,
                        width: `${((clip.endTime - clip.startTime) / 1547) * 100}%`
                      }}
                      onClick={() => setSelectedClip(clip)}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Clip Info */}
              {selectedClip && (
                <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {selectedClip.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedClip.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDuration(selectedClip.startTime)} - {formatDuration(selectedClip.endTime)}</span>
                        <span>Score: {Math.round(selectedClip.score * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClipAction(selectedClip.id, "approve")}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClipAction(selectedClip.id, "reject")}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        </div>

        {/* Clips List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Clips ({filteredClips.length})
          </h3>
          <div className="space-y-3">
            {filteredClips.map((clip) => (
              <Card
                key={clip.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedClip?.id === clip.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedClip(clip)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {clip.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(clip.status)}`}>
                        {getStatusText(clip.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {clip.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatDuration(clip.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(clip.score * 100)}%
                        </span>
                        <SparklesIcon className="w-3 h-3 text-yellow-500" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {clip.hashtags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {clip.hashtags.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          +{clip.hashtags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
