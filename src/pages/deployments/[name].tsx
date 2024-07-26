import Layout from "@/components/layout";
import { useParams } from "next/navigation";

export default function Deployment() {
    const { name } = useParams();

    return <Layout>
        <div className="text-xl">{name}</div>
    </Layout>
}