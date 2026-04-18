// lib/types.ts
export interface Country {
    id: number;
    name: string;
    currency: string;
    iso: string;
    flag: string;
    iso3: string;
    phonecode: string;
    status: string;
    flag_url:string
}
export interface Operator {
    id: number;
    name: string;
    code: string;
    logo: string;
    country_id: string;
    status: string;
    logo_url:string
}
export interface Bank {
    id: number;
    name: string;
    code: string;
    country_code: string;
    status: boolean;
}
export interface PaymentLink {
    id: number;

    code: string;
    amount: number;
    fees: number;

    country_code: string;
    currency: string;

    name?: string;
    description?: string;

    sender?: Sender;
    customer?: Customer;

    status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
    isPaid?: boolean;
    isExpired?: boolean;
    submitted_at?: string;
    expires_at?: string;
    cancelled_at?: string;
}
export interface Sender {
    name?: string;
    phone?: string;
    email?: string;
}

export interface Customer {
    name?: string;
    phone?: string;
    email?: string;
}
export interface User {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
}
export interface Image {
    id: string;
    url: string;
    name: string;
    size: number;
}
export interface Payment {
    id: number;
    reference: string;

    // Correspond au groupe 'fiat' du Resource PHP
    fiat: {
        amount: number;
        currency: string;
        display: string;
    };

    // Correspond au groupe 'crypto' du Resource PHP
    crypto: {
        amount: number;
        currency: string;
        display: string;
        pay_address: string;
        recipient: string;
        network?: string; // Optionnel
    };

    // Correspond au groupe 'status' du Resource PHP
    status: {
        value: string;
        label: string;
        color: string;
    };

    // Correspond au groupe 'dates' du Resource PHP
    dates: {
        created: string;
        processed: string | null;
        relative: string;
    };

    // Correspond au groupe 'user' du Resource PHP
    user: {
        id: number;
        name: string;
        email?: string | null;
        avatar?: string | null;
        is_external: boolean;
    };

    // Correspond au groupe 'meta' du Resource PHP
    meta: {
        is_finalized: boolean;
        is_pending: boolean;
        can_be_edited: boolean;
    };
}
export interface DepositFiat {
    id: number;
    amount: number;
    reference: string;
    status: 'pending' | 'completed' | 'failed' | 'rejected' | string;

    /** Format: d/m/Y H:i */
    completed_at: string | null;
    /** Format: d/m/Y H:i */
    created_at: string;

    /** * Relation Utilisateur
     * Présente uniquement si 'user' est chargé dans la requête Laravel
     */
    user?: {
        id: number;
        name: string;
        email?: string;
        [key: string]: any;
    };

    /** * Relation Opérateur (MTN, Orange, etc.)
     * Présente uniquement si 'operator' est chargé
     */
    operator?: {
        id: number;
        name: string;
        logo_url?: string;
        [key: string]: any;
    };

    /** Libellé du statut formaté par le backend (ex: "En attente", "Succès") */
    status_label: string;
}
export interface DepositUssd {
    id: number;
    amount: number;
    currency: string;
    country_code: string;
    ussd_code: string;
    reference: string;
    status: 'pending' | 'completed' | 'failed' | 'rejected' | string;
    admin_note: string | null;

    /** URL complète de l'image de preuve (reçu) */
    proof_url: string | null;

    /** Format: d/m/Y H:i */
    completed_at: string | null;
    /** Format: d/m/Y H:i */
    created_at: string;

    /** Relation utilisateur (si chargée via eager loading) */
    user?: {
        id: number;
        name: string;
        email?: string;
        [key: string]: any;
    };

    /** Propriétés calculées par le backend pour faciliter le rendu React */
    ui_metadata: {
        status_color: string; // ex: "text-emerald-600 bg-emerald-50"
        can_approve: boolean;
        full_amount: string;  // ex: "5000.00 XAF"
    };
}
export interface TransactionCrypto {
    id: number;
    reference: string;

    // Détails financiers (XAF)
    fiat: {
        amount: number;
        currency: 'XAF';
        rate: number;
        display: string;
    };

    // Détails Blockchain (Crypto)
    crypto: {
        symbol: string;
        network: string;
        amount_raw: number;
        fee: number;
        total_sent: number;
        recipient: string;
        tx_hash: string | null;
        explorer_url: string | null;
    };

    // Statut & Badge
    status: {
        value: string; // 'pending' | 'success' | 'failed' | etc.
        label: string;
        color: string;
    };

    // Relations
    user: {
        id: number;
        name?: string;
        email?: string;
        [key: string]: any; // Pour supporter user_data flexible
    };

    // Relation optionnelle (Eager loaded)
    beneficiary?: {
        id: number;
        name: string;
        account_number: string;
        [key: string]: any;
    };

    quote?: any; // Dépend de la structure de ta table quotes

    // Dates
    processed_at: string | null;
    created_at: string;

    // Metadata pour l'UI
    is_pending: boolean;
    is_success: boolean;
}
export interface Order {
    id: number;
    reference: string;

    // 💵 Détails financiers
    financials: {
        amount: number;
        currency: string;
        display: string;
    };

    // 🚦 Statut avec helpers visuels
    status: {
        value: string;
        label: string;
        color: string;
    };

    // 💳 Paiement
    payment: {
        method: string;
        transaction_id: string | null;
        is_paid: boolean;
    };

    // 🏪 Boutique (Relation optionnelle)
    shop?: {
        id: number;
        name: string;
        logo_url?: string;
        [key: string]: any;
    };

    // 👤 Client (Gestion microservice)
    customer: {
        id: number;
        name: string;
        email?: string;
        avatar?: string;
    };

    // 📍 Adresses
    addresses: {
        billing?: any;  // Remplace 'any' par ton interface Address si elle existe
        shipping?: any;
    };

    // 🧾 Articles
    items_count: number;
    items?: any[]; // Remplace 'any' par ton interface OrderItem

    // 📅 Dates
    created_at: string;
    updated_at: string;
}
export interface TransactionFiat {
    id: number;
    reference: string;

    // Détails de la transaction
    financials: {
        amount: number;
        currency: string;
        display: string;
        type: 'transfer' | 'deposit' | 'withdrawal' | string;
    };

    // Statut avec formatage pour l'UI
    status: {
        value: string;
        label: string;
        color: string;
    };

    // Informations sur les acteurs (Relations optionnelles)
    parties: {
        sender?: {
            id: number;
            name: string;
            account_number?: string;
            [key: string]: any;
        };
        beneficiary?: {
            id: number;
            name: string;
            account_number?: string;
            [key: string]: any;
        };
    };

    // Métadonnées
    meta: {
        note: string | null;
        initiated_by: number | string;
        has_ledger: boolean;
    };

    // Dates
    dates: {
        created_at: string;
        updated_at: string;
    };
}