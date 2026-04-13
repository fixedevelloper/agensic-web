"use client";

import React, { useState, useEffect } from "react";
import {
    Settings, Palette, Globe, Database, Shield, Zap, Code,
    Save, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff
} from "lucide-react";

export default function SettingPage() {
    const [settings, setSettings] = useState({
        // App
        appName: "BillPay CM",
        theme: "system",
        language: "fr",
        timezone: "Africa/Douala",
        // Sécurité
        rateLimit: 100,
        maintenanceMode: false,
        // API / Billing
        canalApiKey: "***HIDDEN***",
        momoEnabled: true,
        // Système
        debugMode: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [showApiKeys, setShowApiKeys] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // PUT /api/admin/settings
        console.log("Sauvegarde globale:", settings);
        setTimeout(() => {
            setSuccess("Configuration globale mise à jour !");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-28 h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/50">
                        <Settings className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-slate-800 bg-clip-text text-transparent tracking-tight">
                        Paramètres Globaux
                    </h1>
                    <p className="text-xl text-slate-600 mt-3 max-w-2xl mx-auto">
                        Configuration centrale de l'application (Admin/Dév)
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* App & UI */}
                    <div className="lg:col-span-2 xl:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-300">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-slate-900">
                            <Palette className="w-8 h-8 text-indigo-600" /> App & Interface
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Nom App</label>
                                <input
                                    value={settings.appName}
                                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                                    className="w-full p-4 border border-slate-200 rounded-2xl text-lg font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="BillPay Pro"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Thème</label>
                                    <select
                                        value={settings.theme}
                                        onChange={(e) => setSettings({...settings, theme: e.target.value})}
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20"
                                    >
                                        <option value="light">Clair</option>
                                        <option value="dark">Sombre</option>
                                        <option value="system">Système</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20"
                                    >
                                        <option value="fr">Français</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border-2 border-emerald-200/50">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Zap className="w-2.5 h-2.5 text-white" />
                                </div>
                                <label className="flex-1 cursor-pointer">
                                    <span className="text-sm font-semibold text-emerald-900">
                                        Mode Maintenance
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                            settings.maintenanceMode
                                                ? 'bg-orange-200 text-orange-800'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {settings.maintenanceMode ? 'ACTIF' : 'Inactif'}
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                                    className="w-6 h-6 rounded-xl bg-white border-4 border-emerald-300 focus:ring-emerald-500 relative"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-gradient-to-br from-rose-50 to-orange-50 backdrop-blur-xl rounded-3xl p-8 border border-rose-200/50 shadow-2xl hover:shadow-3xl">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-rose-900">
                            <Shield className="w-8 h-8" /> Sécurité
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Rate Limit (req/min)</label>
                                <input
                                    type="number"
                                    value={settings.rateLimit}
                                    onChange={(e) => setSettings({...settings, rateLimit: parseInt(e.target.value)})}
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/20 shadow-sm"
                                    min="10" max="1000"
                                />
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 cursor-pointer hover:border-amber-300">
                                <input
                                    type="checkbox"
                                    checked={settings.debugMode}
                                    onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <div>
                                    <div className="font-semibold text-amber-900">Mode Debug</div>
                                    <div className="text-sm text-amber-700">Logs détaillés + erreurs visibles</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* APIs & Billing */}
                    <div className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-emerald-50 to-blue-50 backdrop-blur-xl rounded-3xl p-8 border border-emerald-200/50 shadow-2xl hover:shadow-3xl">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-emerald-900">
                            <Database className="w-8 h-8" /> APIs & Billing
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    Canal+ API Key
                                    <button
                                        onClick={() => setShowApiKeys(!showApiKeys)}
                                        className="p-1 rounded-full hover:bg-slate-200"
                                    >
                                        {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </label>
                                <input
                                    type="password"
                                    value={settings.canalApiKey}
                                    onChange={(e) => setSettings({...settings, canalApiKey: e.target.value})}
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 pr-12"
                                />
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.momoEnabled}
                                    onChange={(e) => setSettings({...settings, momoEnabled: e.target.checked})}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="font-medium text-blue-900">MTN MoMo Activé</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t-4 border-gradient-to-r from-indigo-500 to-emerald-500 bg-white/60 backdrop-blur-xl rounded-3xl p-8 mt-12">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Sauvegarde en cours...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Sauvegarder Configuration Globale
                            </>
                        )}
                    </button>
                    {success && (
                        <div className="flex items-center gap-3 bg-emerald-500/20 text-emerald-900 border-2 border-emerald-500/40 px-8 py-5 rounded-2xl font-bold shadow-lg flex-1 sm:flex-none animate-pulse">
                            <CheckCircle2 className="w-6 h-6" />
                            {success}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}