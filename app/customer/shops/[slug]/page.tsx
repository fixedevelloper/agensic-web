import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Store, MapPin, Package, DollarSign, Users, BarChart3,
    Share2, Edit, Download, QrCode, ImagePlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShopProducts from "./ShopProducts";  // Client Component
import ShopStats from "./ShopStats";
import ImageSelectorModal from "../../../../components/modals/ImageSelectorModal";       // Client Component
export const dynamic = "force-dynamic";
interface Shop {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category: string;
    location: string;
    logo?: string;
    products_count: number;
    orders_count: number;
    revenue: number;
    is_active: boolean;
    logo_url?: string;
}

async function getShop(slug: string): Promise<Shop> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${slug}`,
        {
           // next: { revalidate: 60 },
        }
    );

    if (!res.ok) {
        throw new Error("Boutique non trouvée");
    }

    const data = await res.json();

    return data.data; // ✅ Laravel resource standard
}

export default async function ShopDetailPage({
                                                 params,
                                             }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const shop = await getShop(slug);

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'XAF', minimumFractionDigits: 0
        }).format(amount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Hero */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 -z-10"></div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
                        {/* Logo + Infos */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 flex-1">
                            <div className="shrink-0">
                                <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-2 shadow-2xl border-4 border-white">
                                    <img
                                        src={shop.logo ? `${shop.logo_url}` : "/default-shop.jpg"}
                                        alt={shop.name}
                                        className="rounded-2xl object-cover shadow-lg"
                                        sizes="160px"
                                    />
                                </div>
                            </div>

                            <div className="text-center lg:text-left flex-1 space-y-4">
                                <div className="inline-flex items-center gap-3">
                                    <Badge className="text-lg px-4 py-2 font-bold uppercase tracking-wide bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg">
                                        {shop.category}
                                    </Badge>
                                    <Badge variant={shop.is_active ? "default" : "secondary"} className="text-lg px-4 py-2">
                                        {shop.is_active ? "Active" : "Inactif"}
                                    </Badge>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 bg-clip-text text-transparent">
                                    {shop.name}
                                </h1>

                                {shop.description && (
                                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                        {shop.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-6 pt-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-semibold">{shop.location}</span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-300" />
                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                        <span>{shop.products_count} produits</span>
                                        <span>{shop.orders_count} commandes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-0 lg:self-center">


                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl font-bold px-8"
                            >
                                <Link href={`/customer/shops/${shop.slug}/products`}>
                                    <Package className="w-5 h-5 mr-2" />
                                    Gérer produits
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-slate-200 shadow-lg hover:shadow-xl font-bold px-8"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                QR Code
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-12 pt-12 border-t border-slate-200">
                        <Link
                            href={`/customer/shops/${shop.slug}`}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl hover:bg-emerald-100 font-semibold text-emerald-800 transition-all"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Statistiques
                        </Link>
                        <Link
                            href={`/customer/shops/${shop.slug}/orders`}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 font-semibold text-blue-800 transition-all"
                        >
                            <Users className="w-4 h-4" />
                            Commandes
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats */}
                    <Suspense fallback={<StatsSkeleton />}>
                        <ShopStats slug={slug} />
                    </Suspense>

                    {/* Products */}
                    <div className="lg:col-span-2">
                        <Suspense fallback={<ProductsSkeleton />}>
                            <ShopProducts slug={slug} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function StatsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="h-8 w-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-xl"></div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* CA Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-white/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-pulse"></div>
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-32 bg-slate-200 rounded-2xl mx-auto"></div>
                        <div className="h-5 w-24 bg-slate-200 rounded-full mx-auto"></div>
                    </div>
                </div>

                {/* Commandes Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-white/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-pulse"></div>
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-28 bg-slate-200 rounded-2xl mx-auto"></div>
                        <div className="h-5 w-24 bg-slate-200 rounded-full mx-auto"></div>
                    </div>
                </div>

                {/* Produits Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-white/50 md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-pulse"></div>
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-12 w-32 bg-slate-200 rounded-2xl mx-auto"></div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                            <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function ProductsSkeleton() {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-200/50">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 rounded-2xl animate-shimmer"></div>
                        <div>
                            <div className="h-9 w-64 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-shimmer"></div>
                            <div className="h-5 w-32 bg-slate-200/70 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-12 w-28 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-shimmer"></div>
                        <div className="h-12 w-36 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-shimmer delay-200"></div>
                    </div>
                </div>

                {/* Search */}
                <div className="mt-6 max-w-2xl mx-auto">
                    <div className="relative h-14 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-3xl animate-shimmer overflow-hidden">
                        <div className="absolute inset-0 bg-slate-400/30 animate-pulse rounded-3xl"></div>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-white/50 backdrop-blur-sm z-10">
                        <tr className="border-b border-slate-200/50">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className={`h-5 w-${i === 0 ? '16' : i < 4 ? '32' : '20'} bg-slate-200 rounded-full animate-pulse ${i > 0 ? 'delay-' + (i * 100) : ''}`}></div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/30">
                        {Array.from({ length: 6 }).map((_, row) => (
                            <tr key={row} className="animate-pulse delay-500">
                                <td className="px-6 py-8">
                                    <div className="w-14 h-14 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl animate-shimmer"></div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="space-y-2">
                                        <div className="h-6 w-72 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl animate-shimmer"></div>
                                        <div className="h-4 w-48 bg-slate-200/60 rounded animate-pulse"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="h-10 w-24 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-xl animate-shimmer mx-auto"></div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="h-10 w-32 bg-slate-200 rounded-xl animate-shimmer mx-auto font-mono"></div>
                                </td>
                                <td className="px-6 py-8 text-right">
                                    <div className="h-10 w-24 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 rounded-xl animate-shimmer mx-auto"></div>
                                </td>
                                <td className="px-6 py-8 text-right">
                                    <div className="h-10 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl animate-shimmer mx-auto font-mono"></div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="h-9 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full animate-shimmer mx-auto"></div>
                                </td>
                                <td className="px-6 py-8 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                                        <div className="w-10 h-10 bg-gradient-to-r from-red-200 via-red-300 to-red-200 rounded-xl animate-shimmer"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="p-8 border-t border-slate-200/50 bg-gradient-to-t from-slate-50">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="flex gap-2">
                        <div className="h-10 w-12 bg-slate-200 rounded-xl animate-pulse"></div>
                        <div className="h-10 w-12 bg-slate-200 rounded-xl animate-pulse delay-300"></div>
                        <div className="h-10 w-12 bg-slate-200 rounded-xl animate-pulse delay-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}