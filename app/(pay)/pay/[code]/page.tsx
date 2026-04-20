import React from "react";
import { PaymentLinkClient } from "./PaymentLinkClient";
import { notFound } from "next/navigation";

async function getPaymentLink(code: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL;

    if (!baseUrl) {
        throw new Error("API URL non définie");
    }

    const res = await fetch(`${baseUrl}/api/payments/link/${code}`, {
        cache: "no-store",
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error("Erreur lors du chargement du lien de paiement");
    }

    const data = await res.json();
    return data.data ?? null;
}

export default async function PaymentLinkPage({
                                                  params,
                                              }: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    const paymentLink = await getPaymentLink(code);

    console.log(paymentLink)
    if (!paymentLink) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <PaymentLinkClient paymentLink={paymentLink} />
            </div>
        </div>
    );
}