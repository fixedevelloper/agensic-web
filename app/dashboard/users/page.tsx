// app/countries/page.tsx (Server Component)
import axiosServices from "../../../utils/axiosServices";
import {UserClient} from "./UserClient";

export const dynamic = "force-dynamic";
async function fetchUsers() {
    const res = await axiosServices.get("api/users");
    return res.data.data ?? [];
}

export default async function UsersPage() {
    const users = await fetchUsers();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
            <UserClient users={users} />
        </div>
    );
}

