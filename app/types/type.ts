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