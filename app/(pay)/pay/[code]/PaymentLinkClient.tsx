'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Clock } from "lucide-react";

import React, { useState } from "react";
import { PaymentLink } from "../../../types/type";

export function PaymentLinkClient({
                                      paymentLink
                                  }: { paymentLink: PaymentLink }) {

    const [copied, setCopied] = useState(false);

    const paymentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${paymentLink.code}`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(paymentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: paymentLink.name ?? "Paiement",
                url: paymentUrl
            });
        } else {
            handleCopy();
        }
    };

    const now = new Date();

    const isExpired =
        paymentLink.expires_at
            ? new Date(paymentLink.expires_at) < now
            : false;

    const isPaid = paymentLink.status === "paid";

    return (
        <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">

            <Card className="w-full max-w-2xl shadow-xl rounded-2xl border">

                {/* HEADER */}
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-xl font-semibold">
                        {paymentLink.name ?? "Paiement"}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                        {paymentLink.description ?? "Veuillez effectuer votre paiement"}
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* 💰 MONTANT */}
                    <div className="text-center">
                        <p className="text-4xl font-bold text-[#B93E1E]">
                            {paymentLink.amount} {paymentLink.currency ?? "XAF"}
                        </p>
                    </div>

                    {/* 🟢 STATUS + ⏱ EXPIRATION */}
                    <div className="flex justify-center items-center gap-2 flex-wrap">

                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                            isPaid
                                ? "bg-green-100 text-green-600"
                                : paymentLink.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                        }
                        `}>
                            {paymentLink.status}
                        </span>

                        {paymentLink.expires_at && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                Expire le {new Date(paymentLink.expires_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* 👤 CLIENT */}
                    {paymentLink.customer && (
                        <div className="bg-muted p-4 rounded-xl space-y-1">
                            <p className="text-sm text-muted-foreground">Client</p>
                            <p className="font-medium">
                                {paymentLink.customer.name ?? "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {paymentLink.customer.phone ?? "-"}
                            </p>
                        </div>
                    )}

                    {/* 🔗 ACTIONS */}
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2"
                            onClick={handleCopy}
                        >
                            <Copy size={16} />
                            {copied ? "Copié !" : "Copier"}
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2"
                            onClick={handleShare}
                        >
                            <Share2 size={16} />
                            Partager
                        </Button>

                    </div>

                    {/* 🔘 ACTION PRINCIPALE */}
                    <Button
                        className="w-full h-12 text-base font-semibold bg-[#B93E1E] hover:bg-[#a73518] transition"
                        disabled={isPaid || isExpired}
                    >
                        {isPaid
                            ? "Déjà payé"
                            : isExpired
                                ? "Lien expiré"
                                : "Payer maintenant"}
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}