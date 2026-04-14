"use client";

import React, {useState, useCallback, useEffect} from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, Phone, Lock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

// ✅ Redirect propre
    useEffect(() => {
        if (status === "authenticated") {
            const role = session?.user?.role as string | undefined;
            router.push(role === "admin" ? "/dashboard" : "/customer");
        }
    }, [status, session, router]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn("credentials", {
            phone: phone.trim(),
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Téléphone ou mot de passe incorrect");
        } else {
            router.refresh(); // 🔥 déclenche update session
        }

        setLoading(false);
    }, [phone, password, router]);

    const formatPhone = (value: string) => {
        // +237 6XX XX XX XX
        return value.replace(/[^0-9+]/g, "").slice(0, 13);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent mb-3">
                        Agensic solutions
                    </h1>
                    <p className="text-xl text-slate-600">Plateforme paiements Afrique</p>
                </div>

                {/* Form */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                Téléphone <span className="text-emerald-600">(+237)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="69X XX XX XX"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 text-lg font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 text-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Forgot */}
                        <div className="text-sm">
                            <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !phone || !password}
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-5 h-5" />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} BillPay Pro - Cameroun 🇨🇲
                    </div>
                </div>

                {/* Register */}
                <p className="mt-8 text-center text-sm text-slate-600">
                    Pas de compte ?{" "}
                    <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}