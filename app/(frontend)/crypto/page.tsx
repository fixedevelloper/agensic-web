import React from 'react';
import { 
  Smartphone, 
  ArrowRightLeft, 
  QrCode, 
  Wallet, 
  ShieldCheck, 
  Globe, 
  Download,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function CryptoImprovedPage() {
  
   const apkUrl = "/apk/app-release.apk";
  const cryptoServices = [
    {
      title: "Transfert Ultra-Rapide",
      description: "Envoyez des cryptos à vos proches instantanément, sans frontières et à des frais dérisoires.",
      icon: <ArrowRightLeft className="text-[#B93E1E]" />,
    },
    {
      title: "Paiement Marchand",
      description: "Payez vos achats quotidiens en scannant simplement un QR Code chez vos commerçants favoris.",
      icon: <QrCode className="text-[#d65a3a]" />,
    },
    {
      title: "Recevoir vos Paiements",
      description: "Freelances ou vendeurs ? Recevez vos paiements en stablecoins (USDT) sécurisés sans passer par une banque.",
      icon: <Wallet className="text-[#f4a261]" />,
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* --- HERO SECTION : FOCUS APP MOBILE --- */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 z-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-[#B93E1E] px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Zap size={16} fill="currentColor" /> L'économie du futur est dans votre poche
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8">
              Utilisez vos Cryptos <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B93E1E] to-[#f4a261]">
                partout, tout le temps.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Ne vous contentez pas de stocker. Payez vos factures, transférez des fonds à l'international et encaissez vos ventes grâce à notre application mobile sécurisée.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl hover:-translate-y-1">
                <Download size={24} />
                <div className="text-left">
                  <p className="text-[10px] opacity-70 uppercase leading-none">Disponible sur</p>
                  <p className="text-lg font-bold leading-none">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-[#B93E1E] text-white px-8 py-4 rounded-2xl hover:bg-[#d65a3a] transition-all shadow-xl hover:-translate-y-1 shadow-[#B93E1E]/20">
                <Smartphone size={24} />
                <div className="text-left">
                  <p className="text-[10px] opacity-70 uppercase leading-none">Télécharger</p>
                  <p className="text-lg font-bold leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup Visuel */}
          <div className="lg:w-1/2 relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#B93E1E]/20 to-[#f4a261]/20 rounded-full blur-[100px]"></div>
            <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] border-[10px] border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden">
               {/* Simulation UI App */}
               <div className="p-6 text-white space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="w-12 h-4 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="bg-gradient-to-br from-[#B93E1E] to-[#d65a3a] p-6 rounded-3xl space-y-2">
                    <p className="text-xs opacity-70">Mon Solde Crypto</p>
                    <p className="text-2xl font-bold">$4,590.00</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center space-y-2">
                        <ArrowRightLeft className="mx-auto text-[#f4a261]" />
                        <p className="text-[10px]">Envoyer</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center space-y-2">
                        <QrCode className="mx-auto text-[#f4a261]" />
                        <p className="text-[10px]">Scanner</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                     <p className="text-xs font-bold">Transactions récentes</p>
                     {[1,2,3].map(i => (
                       <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES CRYPTO --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Plus qu'un simple portefeuille.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Découvrez une nouvelle façon d'utiliser votre argent au quotidien avec nos services intégrés.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cryptoServices.map((service, idx) => (
            <div key={idx} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed italic">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- BANDEAU "RECOIVRE LE PAIEMENT" --- */}
      <section className="py-24 bg-gray-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
             <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
               Encaissez vos paiements <br /> en <span className="text-[#f4a261]">Crypto-monnaie</span>.
             </h2>
             <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-[#B93E1E] rounded-full p-1"><CheckCircle2 className="text-white" size={16} /></div>
                  <p className="text-gray-300"><strong>Zéro délai :</strong> Recevez vos fonds immédiatement sans attendre les validations bancaires.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-[#B93E1E] rounded-full p-1"><CheckCircle2 className="text-white" size={16} /></div>
                  <p className="text-gray-300"><strong>Pas de chargebacks :</strong> Les transactions crypto sont définitives, finis les litiges abusifs.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-[#B93E1E] rounded-full p-1"><CheckCircle2 className="text-white" size={16} /></div>
                  <p className="text-gray-300"><strong>Support global :</strong> Acceptez l'argent de n'importe quel pays instantanément.</p>
                </div>
             </div>
          </div>
          <div className="md:w-1/2 bg-gradient-to-br from-[#B93E1E] to-[#f4a261] p-12 rounded-[3rem] text-white text-center">
            <h3 className="text-3xl font-black mb-4 italic">Prêt à passer le cap ?</h3>
            <p className="mb-8 text-white/80">Rejoignez les milliers de marchands qui boostent leur business avec AgensicSolution.</p>
            <button className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-gray-100 transition-colors">
              Activer le mode marchand
            </button>
          </div>
        </div>
      </section>

      {/* --- SÉCURITÉ & FIABILITÉ --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 flex flex-col gap-8">
            <div className="text-center md:text-left">
              <ShieldCheck size={48} className="text-[#B93E1E] mb-4 mx-auto md:mx-0" />
              <h4 className="text-xl font-bold mb-2">Sécurité maximale</h4>
              <p className="text-gray-500 text-sm italic">Vos clés privées, vos cryptos. Sécurisées par biométrie.</p>
            </div>
            <div className="text-center md:text-left">
              <Globe size={48} className="text-[#d65a3a] mb-4 mx-auto md:mx-0" />
              <h4 className="text-xl font-bold mb-2">Partout dans le monde</h4>
              <p className="text-gray-500 text-sm italic">Envoyez de la valeur d'un continent à l'autre en un clic.</p>
            </div>
          </div>
          <div className="md:w-2/3 bg-gray-50 p-12 rounded-[3rem] border border-gray-100">
             <h2 className="text-3xl font-black mb-6">Ne gérez plus votre argent comme en 1990.</h2>
             <p className="text-gray-600 mb-8 leading-relaxed">
               L'application mobile a été conçue pour être l'outil financier ultime. Transferts rapides entre utilisateurs, conversion instantanée vers les monnaies locales et gestion intuitive de votre portefeuille crypto. Tout est là.
             </p>
             <a
             href={apkUrl}
                                download className="flex items-center gap-2 bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-orange-200 transition-all">
               <Download size={20} /> Télécharger l'application gratuitement
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}