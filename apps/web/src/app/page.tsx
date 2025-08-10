import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">R</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Reelgen</span>
                </div>
              </div>
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
                Connexion
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                Commencer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Générez des{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reels
              </span>{" "}
              avec l'IA
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transformez vos vidéos longues en clips viraux automatiquement.
              Sous-titres, montage et optimisation IA inclus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                Uploader une vidéo
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all">
                Voir la démo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Une suite complète pour créer des contenus viraux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Génération automatique
              </h3>
              <p className="text-gray-600">
                L'IA analyse votre vidéo et génère automatiquement les meilleurs moments pour créer des clips viraux.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sous-titres intelligents
              </h3>
              <p className="text-gray-600">
                Transcription automatique avec sous-titres stylisés et synchronisés pour maximiser l'engagement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Analytics avancés
              </h3>
              <p className="text-gray-600">
                Suivez les performances de vos clips avec des métriques détaillées et des insights optimisés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10M+</div>
              <div className="text-gray-600">Vues générées</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Clips créés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à créer des reels viraux ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Rejoignez des milliers de créateurs qui utilisent Reelgen pour transformer leur contenu.
          </p>
          <Link
            href="/upload"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="ml-2 text-xl font-bold">Reelgen</span>
              </div>
              <p className="text-gray-400">
                La plateforme de génération de reels la plus avancée avec l'IA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Tarifs</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Centre d'aide</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white">Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Reelgen. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
