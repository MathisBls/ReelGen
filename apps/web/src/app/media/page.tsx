"use client";

import Link from "next/link";

const mockMedia = [
  {
    id: 1,
    title: "Tutoriel React - Hooks avancés",
    duration: "25:47",
    size: "156 MB",
    status: "ready",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    uploadedAt: "Il y a 2 heures",
    views: 1247,
    clips: 8,
  },
  {
    id: 2,
    title: "Guide TypeScript complet",
    duration: "39:00",
    size: "234 MB",
    status: "processing",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
    uploadedAt: "Il y a 3 heures",
    views: 892,
    clips: 12,
  },
  {
    id: 3,
    title: "Next.js 14 - App Router",
    duration: "30:20",
    size: "189 MB",
    status: "ready",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    uploadedAt: "Il y a 4 heures",
    views: 2156,
    clips: 15,
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox",
    duration: "20:00",
    size: "95 MB",
    status: "ready",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    uploadedAt: "Il y a 5 heures",
    views: 3456,
    clips: 6,
  },
];

export default function MediaPage() {
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
              <Link href="/media" className="text-purple-600 border-b-2 border-purple-600 px-3 py-2 text-sm font-medium">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Médias</h1>
              <p className="text-gray-600 mt-2">Gérez vos vidéos et générez des clips automatiquement</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">📹</span>
                Upload Vidéo
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Médias</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Vues Totales</p>
                <p className="text-2xl font-bold text-gray-900">7.8K</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Durée Totale</p>
                <p className="text-2xl font-bold text-gray-900">12h 30m</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Stockage</p>
                <p className="text-2xl font-bold text-gray-900">2.1GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockMedia.map((media) => (
            <div key={media.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
              <div className="relative">
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    media.status === "ready"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {media.status === "ready" ? "Prêt" : "En cours"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {media.duration}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all">
                    <span className="mr-2">▶️</span>
                    Lire
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 truncate mb-2">
                  {media.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {media.size} • {media.uploadedAt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <span className="mr-1">👁️</span>
                      {media.views}
                    </span>
                    <span>{media.clips} clips</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span>✏️</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no media) */}
        {mockMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📹</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun média</h3>
            <p className="text-gray-600 mb-6">Commencez par uploader votre première vidéo</p>
            <Link
              href="/upload"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Uploader une vidéo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
