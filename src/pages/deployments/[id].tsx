import Layout from "@/components/layout";
import { useGlobalState } from "@/hooks";
import { useRouter } from "next/router";

export default function Deployment() {
    const globalState = useGlobalState();
    const router = useRouter();
    const id = router.query.id;

    const deployment = globalState.deployments.find((dep) => dep.ID.toString() == id);

    if (!deployment) return <Layout>
        <div className="text-xl">Deployment not found</div>
    </Layout>

    return <Layout>
        <div className="text-xl">{deployment?.Name}</div>
    </Layout>
}