import React from 'react';
import { 
  ArrowRightLeft, 
  Bitcoin, 
  Store, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Smartphone, 
  CreditCard 
} from 'lucide-react';

export default function ServicesPage() {
  
  const mainServices = [
    {
      title: "Transfert d'argent instantané",
      description: "Envoyez des fonds partout dans le monde avec des frais réduits au maximum. Que ce soit pour la famille, des amis ou des partenaires d'affaires.",
      icon: <ArrowRightLeft className="w-8 h-8" />,
      color: "from-[#B93E1E] to-[#d65a3a]",
      features: ["Transferts peer-to-peer", "Frais fixes transparents", "Réception immédiate"]
    },
    {
      title: "Écosystème Crypto complet",
      description: "Une passerelle simplifiée vers le Web3. Achetez, vendez et échangez vos actifs numériques en toute sécurité.",
      icon: <Bitcoin className="w-8 h-8" />,
      color: "from-[#d65a3a] to-[#f4a261]",
      features: ["Support multi-chain", "Staking & Rendements", "Sécurisation Cold Storage"]
    },
    {
      title: "Boutique & E-commerce",
      description: "Transformez votre passion en business. Créez votre boutique digitale et acceptez les paiements fiat et crypto instantanément.",
      icon: <Store className="w-8 h-8" />,
      color: "from-[#f4a261] to-[#B93E1E]",
      features: ["Gestion de stock", "Paiements sécurisés", "Statistiques de vente"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- SECTION HEADER --- */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Nos <span className="text-[#B93E1E]">Services</span> Experts
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Nous avons construit une plateforme robuste pour répondre à tous vos besoins financiers modernes. 
            Sécurité, rapidité et simplicité sont au cœur de chaque service que nous proposons.
          </p>
        </div>
      </section>

      {/* --- MAIN SERVICES GRID --- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-10">
          {mainServices.map((service, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-[2rem] transition-opacity duration-300`}></div>
              <div className="bg-white border border-gray-100 p-10 rounded-[2rem] shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center mb-8 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d65a3a]"></div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="py-24 bg-gray-900 text-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Pourquoi nous faire <br />
                <span className="text-[#f4a261]">confiance ?</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <ShieldCheck className="text-[#f4a261] w-10 h-10" />
                  <h4 className="font-bold text-xl">Sécurité Totale</h4>
                  <p className="text-gray-400 text-sm">Chiffrement de bout en bout et authentification multi-facteurs.</p>
                </div>
                <div className="space-y-4">
                  <Zap className="text-[#f4a261] w-10 h-10" />
                  <h4 className="font-bold text-xl">Vitesse Éclair</h4>
                  <p className="text-gray-400 text-sm">Transactions traitées en moins de 3 secondes en moyenne.</p>
                </div>
                <div className="space-y-4">
                  <Globe className="text-[#f4a261] w-10 h-10" />
                  <h4 className="font-bold text-xl">Global</h4>
                  <p className="text-gray-400 text-sm">Disponible dans plus de 150 pays avec support multi-devises.</p>
                </div>
                <div className="space-y-4">
                  <CreditCard className="text-[#f4a261] w-10 h-10" />
                  <h4 className="font-bold text-xl">Flexibilité</h4>
                  <p className="text-gray-400 text-sm">Intégration facile avec vos banques et cartes locales.</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="w-full h-96 bg-gradient-to-tr from-[#B93E1E] to-[#f4a261] rounded-full blur-[120px] opacity-20 absolute -top-10 -right-10"></div>
               <div className="relative bg-gray-800 border border-gray-700 p-8 rounded-[3rem] shadow-2xl">
                 <h3 className="text-2xl font-bold mb-6 italic text-center text-[#f4a261]">L'expérience utilisateur d'abord</h3>
                 <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#B93E1E] to-[#f4a261] w-[95%]"></div>
                    </div>
                    <p className="text-xs text-center text-gray-500 uppercase tracking-widest">Satisfaction Client 99%</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Besoin d'un service sur mesure ?</h2>
          <p className="text-gray-600 mb-10">
            Notre équipe est à votre disposition pour vous accompagner dans la mise en place de solutions de paiement pour votre entreprise.
          </p>
          <button className="bg-[#B93E1E] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-[#B93E1E]/40 hover:scale-105 transition-all">
            Contacter le support commercial
          </button>
        </div>
      </section>
    </div>
  );
}