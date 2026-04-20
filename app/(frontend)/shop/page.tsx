'use client'
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Tag, 
  Zap, 
  Store, 
  Smartphone,
  X,
  ArrowRight
} from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
const [isModalOpen, setIsModalOpen] = useState(false);
  const apkUrl = "/apk/app-release.apk"; // Ton lien APK
  const categories = ["Tous", "Électronique", "Mode", "Alimentation", "Services Digitaux"];

  const products = [
    { id: 1, name: "iPhone 15 Pro", price: "750,000", category: "Électronique", rating: 4.8, image: "📱" },
    { id: 2, name: "Nike Air Jordan", price: "85,000", category: "Mode", rating: 4.5, image: "👟" },
    { id: 3, name: "MacBook Air M2", price: "950,000", category: "Électronique", rating: 4.9, image: "💻" },
    { id: 4, name: "Abonnement Premium", price: "5,000", category: "Services Digitaux", rating: 5.0, image: "💎" },
    { id: 5, name: "Panier Bio", price: "12,000", category: "Alimentation", rating: 4.2, image: "🧺" },
    { id: 6, name: "Casque Sony", price: "150,000", category: "Électronique", rating: 4.7, image: "🎧" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      
      {/* --- HERO SHOP --- */}
      <section className="pt-32 pb-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-6">
            <div className="flex items-center gap-2 text-[#d65a3a] font-bold uppercase tracking-widest text-sm">
              <Tag size={18} /> Marketplace Intégrée
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Achetez tout ce que vous <span className="text-[#B93E1E]">aimez.</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Une plateforme unique pour acheter des produits physiques ou digitaux. Payez en FCFA ou en Crypto instantanément.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                Explorer les produits
              </button>
            <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:scale-105 transition-all"
      >
        <Plus size={20} /> Créer ma boutique
      </button>
            </div>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2">
                <Store size={40} className="text-[#B93E1E] mb-2" />
                <p className="text-2xl font-black text-gray-900">+500</p>
                <p className="text-sm text-gray-500 font-medium">Vendeurs actifs</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2 text-white translate-y-8">
                <Zap size={40} className="text-[#f4a261] mb-2" />
                <p className="text-2xl font-black italic">Flash</p>
                <p className="text-sm text-white/60 font-medium">Ventes privées</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- RECHERCHE ET FILTRES --- */}
      <section className="py-10 px-6 sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un produit, une marque..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-[#f4a261] transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                  ? 'bg-[#B93E1E] text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-[#d65a3a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- LISTE DES PRODUITS --- */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[2rem] border border-gray-50 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              {/* Image Placeholder */}
              <div className="h-64 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {product.image}
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-[#d65a3a] uppercase tracking-widest">{product.category}</p>
                  <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
                    <Star size={14} fill="currentColor" /> {product.rating}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h3>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Prix</p>
                    <p className="text-2xl font-black text-gray-900">{product.price} <span className="text-sm font-medium">XAF</span></p>
                  </div>
                  <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-[#B93E1E] transition-colors shadow-lg shadow-gray-200">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BANNIERE VENDEUR --- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#B93E1E] via-[#d65a3a] to-[#f4a261] rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 md:w-2/3">
                <h2 className="text-4xl font-black mb-4 uppercase">Devenez Vendeur</h2>
                <p className="text-lg opacity-90 mb-8 max-w-lg">
                    Vous avez des produits à vendre ? Ouvrez votre boutique en 5 minutes, gérez vos stocks et encaissez vos paiements partout en Afrique.
                </p>
                <div className="flex flex-wrap gap-6 font-bold">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                        🚀 Visibilité Boostée
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                        💳 Paiements Sécurisés
                    </div>
                </div>
            </div>
            <button onClick={() => setIsModalOpen(true)}
             className="relative z-10 bg-white text-[#B93E1E] px-10 py-5 rounded-[2rem] font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
                Ouvrir ma boutique
            </button>
            {/* Déco abstraite */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
        </div>
      </section>
      {/* --- LE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay (arrière-plan sombre) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Contenu du Modal */}
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-orange-100 text-[#B93E1E] rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone size={40} />
              </div>

              <h3 className="text-2xl font-black text-gray-900 leading-tight">
                Inscription Requise sur l'Application
              </h3>

              <p className="text-gray-600 leading-relaxed italic">
                Pour créer et gérer votre boutique, vous devez d'abord posséder un compte vérifié sur notre application mobile.
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-500">
                Une fois inscrit sur l'app, vous pourrez utiliser vos identifiants pour vous connecter au portail marchand.
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <a 
                  href={apkUrl}
                  download
                  className="w-full bg-[#B93E1E] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#d65a3a] transition-all shadow-lg shadow-orange-100"
                >
                  Télécharger l'APK <ArrowRight size={18} />
                </a>
                <button 
                  onClick={() => window.location.href = '/auth/login'}
                  className="w-full py-4 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                >
                  J'ai déjà un compte, me connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}