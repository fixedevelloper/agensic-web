import Link from "next/link";
import React from "react";
import {Store} from "lucide-react";

export function CreateShopButton() {
    return (
        <Link
            href="/customer/shops/create"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all w-full lg:w-auto text-center"
        >
            <Store className="w-5 h-5 inline mr-2" />
            Nouvelle Boutique
        </Link>
    );
}