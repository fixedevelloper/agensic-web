import { Suspense } from "react";
import ShopListClient from "./ShopListClient";
import {CreateShopButton} from "./CreateShopButton";

export default async function ShopListPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
                            Mes Boutiques
                        </h1>
                        <p className="text-xl text-slate-600 mt-2">
                            Gérez vos points de vente su agensic solution
                        </p>
                    </div>
                    <CreateShopButton />
                </header>

                <Suspense fallback={<ShopsSkeleton />}>
                    <ShopListClient />
                </Suspense>
            </div>
        </div>
    );
}

async function ShopsSkeleton() {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl animate-pulse">
            <div className="h-8 bg-slate-200 rounded-xl w-64 mb-8"></div>
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-slate-100 rounded-2xl">
                        <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-6 bg-slate-200 rounded-lg w-48"></div>
                            <div className="h-4 bg-slate-200 rounded w-32"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

