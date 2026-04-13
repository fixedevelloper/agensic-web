// app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}