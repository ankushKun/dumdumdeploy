import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card-hover-effect";
import { useGlobalState } from "@/hooks";
import useDeploymentManager from "@/hooks/useDeploymentManager";
import { Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Deployment() {
    const globalState = useGlobalState();
    const { managerProcess, deployments, refresh } = useDeploymentManager()
    const router = useRouter();
    const name = router.query.name;

    const deployment = globalState.deployments.find((dep) => dep.Name == name);

    useEffect(() => {
        refresh();
    }, [])

    if (!deployment) return <Layout>
        <div className="text-xl">Searching <span className="text-muted-foreground">{name}</span>...</div>
    </Layout>

    return <Layout>
        <div className="text-xl">{deployment?.Name}</div>
        <Button className="w-fit absolute right-10">Redeploy</Button>
        <Link href={deployment.RepoUrl} target="_blank" className="flex items-center gap-1 my-2 hover:underline underline-offset-4"><Github size={24} />{deployment.RepoUrl}</Link>

        <div className="grid grid-cols-1 gap-2 max-w-[50%]">
            <Card className=" h-fit p-0">
                <div className="text-muted-foreground">Install Command</div>
                {deployment.InstallCMD}</Card>
            <Card className=" h-fit p-0">
                <div className="text-muted-foreground">Build Command</div>
                {deployment.BuildCMD}</Card>
            <Card className=" h-fit p-0">
                <div className="text-muted-foreground">Output Directory</div>
                {deployment.OutputDIR}</Card>
        </div>

    </Layout>
}