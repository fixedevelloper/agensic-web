import { OperatorClient } from "./OperatorClient";
import axiosServices from "../../../../../utils/axiosServices";

export const dynamic = "force-dynamic";
async function fetcOperator(countryId: string) {
    const res = await axiosServices.get(
        `api/operators/countries/${countryId}`
    );
    return res.data.data ?? [];
}

export default async function OperatorPage({
                                               params,
                                           }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const operators = await fetcOperator(id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Liste des opérateurs
            </h1>

            <OperatorClient
                operators={operators}
                country_id={id}
            />
        </div>
    );
}