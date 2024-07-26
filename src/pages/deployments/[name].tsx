import Layout from "@/components/layout";
import { useRouter } from "next/router";

export default function Deployment() {
    const router = useRouter();
    const name = router.query.name;

    return <Layout>
        <div className="text-xl">{name}</div>
    </Layout>
}