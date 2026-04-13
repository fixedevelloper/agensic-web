// components/layout/user-button.tsx
"use client";
import { useSession } from "next-auth/react";

export function UserButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    return (
        <span className="text-sm font-medium">
      {session.user.name || session.user.email}
    </span>
    );
}