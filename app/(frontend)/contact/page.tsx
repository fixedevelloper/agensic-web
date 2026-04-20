import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Send, 
  Clock, 
  X,
  ChevronRight
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HEADER CONTACT --- */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#B93E1E] via-[#d65a3a] to-[#f4a261] text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Parlons <span className="text-orange-100">Ensemble</span>.
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Une question sur vos transferts ? Besoin d'aide pour votre boutique ? 
            Notre équipe est là pour vous accompagner 24h/24.
          </p>
        </div>
      </section>

      {/* --- SECTION FORMULAIRE & INFOS --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Infos de contact (Gauche) */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Nos coordonnées</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="w-12 h-12 bg-white text-[#B93E1E] rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase">Email</p>
                    <p className="font-bold text-gray-800">support@agensic.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="w-12 h-12 bg-white text-[#d65a3a] rounded-2xl flex items-center justify-center shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase">Téléphone</p>
                    <p className="font-bold text-gray-800">+242 06 444 9019</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="w-12 h-12 bg-white text-[#f4a261] rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase">Siège Social</p>
                    <p className="font-bold text-gray-800">Brazaville, Congo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white">
              <h4 className="font-bold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B93E1E] transition-colors"></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B93E1E] transition-colors"><X size={20} /></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B93E1E] transition-colors"></a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact (Droite) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-50">
              <h3 className="text-3xl font-black text-gray-900 mb-8 italic">Envoyez-nous un message</h3>
              <form className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 px-2">Nom Complet</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f4a261] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 px-2">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f4a261] outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600 px-2">Sujet</label>
                  <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f4a261] outline-none transition-all appearance-none">
                    <option>Support Technique</option>
                    <option>Question sur la Boutique</option>
                    <option>Partenariat Business</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600 px-2">Message</label>
                  <textarea  placeholder="Comment pouvons-nous vous aider ?" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f4a261] outline-none transition-all"></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="w-full md:w-auto bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] text-white px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-orange-200 transition-all hover:-translate-y-1">
                    Envoyer le message <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ MINI SECTION --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              "Comment sécuriser mon compte crypto ?",
              "Quels sont les frais de création de boutique ?",
              "Puis-je retirer mon argent en cash ?"
            ].map((question, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-100 hover:border-[#f4a261] cursor-pointer transition-all group">
                <span className="font-bold text-gray-700">{question}</span>
                <ChevronRight className="text-[#d65a3a] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
              <Clock className="text-[#f4a261]" size={20} />
              <span className="text-sm font-bold text-gray-500">Temps de réponse moyen : <span className="text-gray-900">15 minutes</span></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}