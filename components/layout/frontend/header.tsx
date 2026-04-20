"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Menu, X, ArrowRight, Download, Smartphone, ShieldCheck, Zap, Gift } from 'lucide-react';

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const apkUrl = "/apk/app-release.apk";

    const advantages = [
        { icon: <ShieldCheck size={18} />, text: "Sécurisation biométrique de vos fonds" },
        { icon: <Zap size={18} />, text: "Transferts instantanés 24h/7j" },
        { icon: <Gift size={18} />, text: "Bonus de bienvenue sur votre premier dépôt" },
    ];
    // Gestion du scroll pour l'effet de transparence
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Crypto', href: '/crypto' },
        { name: 'Boutique', href: '/shop' },
        { name: 'Contactez-nous', href: '/contact' },
    ];

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-3' : 'bg-gradient-to-tr from-[#B93E1E] via-[#d65a3a] to-[#f4a261] py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#B93E1E] via-[#d65a3a] to-[#f4a261] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                        <Wallet size={22} fill="currentColor" />
                    </div>
                    <span className={`text-2xl font-black tracking-tight transition-colors ${
                        scrolled ? 'text-[#B93E1E]' : 'text-white'
                    }`}>
                        Agensic<span className="opacity-80">Solutions</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center bg-gray-100/10 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                                    isActive 
                                    ? 'bg-white text-[#B93E1E] shadow-sm' 
                                    : scrolled ? 'text-gray-700 hover:text-[#B93E1E]' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA BUTTONS */}
                <div className="hidden md:flex items-center gap-3">
                     <Link href='/auth/login'>  <button className={`text-sm font-bold px-4 transition-colors ${
                        scrolled ? 'text-gray-600' : 'text-white/90'
                    } hover:text-[#f4a261]`}>
                        Connexion
                    </button>
                     </Link>
                  
                    <button
                    onClick={() => setIsAccountModalOpen(true)}
                     className="flex items-center gap-2 bg-white text-[#B93E1E] px-6 py-2.5 rounded-full text-sm font-black hover:bg-[#f4a261] hover:text-white transition-all shadow-xl active:scale-95">
                        Ouvrir un compte
                        <ArrowRight size={16} />
                    </button>
                </div>

                {/* MOBILE TOGGLE */}
                <button 
                    className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-800' : 'text-white'}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            <div className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 space-y-6 md:hidden transition-all duration-300 transform ${
                isMenuOpen ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-0 -translate-y-10 pointer-events-none'
            }`}>
                <div className="grid gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xl font-bold text-gray-800 flex justify-between items-center group"
                        >
                            {link.name}
                            <ArrowRight size={18} className="text-[#d65a3a] opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                </div>
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                     <Link href='/auth/login'><button className="w-full py-4 text-[#B93E1E] font-bold border-2 border-[#B93E1E] rounded-2xl">
                        Connexion
                    </button></Link>
                    
                    <button
                     onClick={() => setIsAccountModalOpen(true)}
                      className="w-full py-4 bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] text-white font-bold rounded-2xl shadow-lg shadow-orange-200">
                        S'inscrire gratuitement
                    </button>
                </div>
            </div>
            {/* --- MODAL D'OUVERTURE DE COMPTE --- */}
            {isAccountModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Arrière-plan flou */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setIsAccountModalOpen(false)}
                    ></div>

                    {/* Contenu du Modal */}
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        
                        {/* Barre de dégradé supérieure */}
                        <div className="h-3 bg-gradient-to-r from-[#B93E1E] via-[#d65a3a] to-[#f4a261]"></div>
                        
                        <button 
                            onClick={() => setIsAccountModalOpen(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12">
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-orange-100 text-[#B93E1E] rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                    <Smartphone size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4">
                                    Prêt à rejoindre <br/><span className="text-[#B93E1E]">l'aventure ?</span>
                                </h3>
                                <p className="text-gray-500 font-medium italic">
                                    L'ouverture de compte se fait exclusivement sur notre application mobile pour garantir votre sécurité.
                                </p>
                            </div>

                            {/* Procédure */}
                            <div className="space-y-6 mb-10">
                                <h4 className="text-sm font-black uppercase tracking-widest text-[#d65a3a] mb-4">La procédure :</h4>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                    <p className="text-gray-700">Téléchargez l'application via le bouton ci-dessous.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                    <p className="text-gray-700">Lancez l'app et cliquez sur <strong>"S'inscrire"</strong>.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                                    <p className="text-gray-700">Vérifiez votre identité et commencez vos transactions !</p>
                                </div>
                            </div>

                            {/* Avantages */}
                            <div className="grid gap-3 mb-10">
                                {advantages.map((adv, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl text-[#B93E1E] text-sm font-bold">
                                        {adv.icon}
                                        {adv.text}
                                    </div>
                                ))}
                            </div>

                            {/* Bouton de téléchargement final */}
                            <a 
                                href={apkUrl}
                                download
                                className="w-full bg-gradient-to-r from-[#B93E1E] to-[#d65a3a] text-white py-5 rounded-[2rem] font-black text-center flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-95"
                            >
                                <Download size={20} />
                                Télécharger l'APK Android
                            </a>
                            
                            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-tighter">
                                Version stable 2.4.1 • Sécurisé par chiffrement AES-256
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}