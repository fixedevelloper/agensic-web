"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { Smartphone, ArrowRightLeft, Bitcoin, Store, Download, CheckCircle } from 'lucide-react';

export default function HomePage() {
   const apkUrl = "/apk/app-release.apk";
  return (
    <div className="min-h-screen font-sans text-gray-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-[#B93E1E] via-[#d65a3a] to-[#f4a261] text-white pt-25 pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Tout votre univers financier dans une seule App.
            </h1>
            <p className="text-xl opacity-90">
              Transférez de l'argent, gérez vos cryptos et lancez votre boutique en ligne en quelques clics. La solution tout-en-un pour l'économie de demain.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-white text-[#B93E1E] px-8 py-3 rounded-full font-bold hover:shadow-lg transition">
                Démarrer maintenant
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#d65a3a] transition">
                En savoir plus
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-[500px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
               {/* Simulation d'écran App */}
               <div className="absolute inset-0 bg-white p-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-6"></div>
                  <div className="h-32 w-full bg-gradient-to-r from-[#B93E1E] to-[#f4a261] rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-10 w-full bg-[#f4a261] opacity-20 rounded"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nos Services Révolutionnaires</h2>
          <p className="text-gray-500 mt-4">Conçu pour la simplicité, sécurisé pour votre tranquillité.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Transfert d'argent */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:translate-y-[-10px] transition duration-300">
            <div className="w-14 h-14 bg-orange-100 text-[#B93E1E] rounded-2xl flex items-center justify-center mb-6">
              <ArrowRightLeft size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Transfert d'argent</h3>
            <p className="text-gray-600">Envoyez des fonds instantanément à vos proches, localement ou à l'international, avec des frais transparents.</p>
          </div>

          {/* Crypto */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:translate-y-[-10px] transition duration-300">
            <div className="w-14 h-14 bg-orange-100 text-[#d65a3a] rounded-2xl flex items-center justify-center mb-6">
              <Bitcoin size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Crypto-actifs</h3>
            <p className="text-gray-600">Achetez, vendez et stockez vos crypto-monnaies préférées. Une interface simple pour maîtriser la blockchain.</p>
          </div>

          {/* Boutique */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:translate-y-[-10px] transition duration-300">
            <div className="w-14 h-14 bg-orange-100 text-[#f4a261] rounded-2xl flex items-center justify-center mb-6">
              <Store size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Boutique en ligne</h3>
            <p className="text-gray-600">Créez votre boutique intégrée et commencez à vendre vos produits directement à notre communauté d'utilisateurs.</p>
          </div>
        </div>
      </section>

      {/* --- CTA DOWNLOAD SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Prêt à transformer vos finances ?</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 italic">
                <CheckCircle size={20} className="text-[#f4a261]" /> Inscription en moins de 2 minutes.
              </li>
              <li className="flex items-center gap-3 italic">
                <CheckCircle size={20} className="text-[#f4a261]" /> Sécurité biométrique de pointe.
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-10">
          
              <button className="flex items-center gap-3 bg-black px-6 py-3 rounded-xl hover:scale-105 transition">
                <Smartphone size={24} />
                <div className="text-left">
                  <p className="text-xs opacity-70">Disponible sur</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </button>
               <a  href={apkUrl}
                                download
                                 className="flex items-center gap-3 bg-black px-6 py-3 rounded-xl hover:scale-105 transition">
                <Download size={24} />
                <div className="text-left">
                  <p className="text-xs opacity-70">Télécharger</p>
                  <p className="font-bold">l'APK</p>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
                <QRCodeSVG value={"https://solutions.agensic.com/" + apkUrl} size={128} />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center text-gray-400 border-t border-gray-100">
        <p>© 2026 AgensicSolutions. Tous droits réservés.</p>
      </footer>
    </div>
  );
}