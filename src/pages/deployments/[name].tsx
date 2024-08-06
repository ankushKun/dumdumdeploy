import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card-hover-effect";
import { useGlobalState } from "@/hooks";
import useDeploymentManager from "@/hooks/useDeploymentManager";
import { Github, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios"
import { BUILDER_BACKEND } from "@/lib/utils";
import Ansi from "ansi-to-react"
import { connect } from "@permaweb/aoconnect";


export default function Deployment() {
    const globalState = useGlobalState();
    const { managerProcess, deployments, refresh } = useDeploymentManager()
    const router = useRouter();
    const name = router.query.name;
    const [buildOutput, setBuildOutput] = useState("")
    const [antName, setAntName] = useState("")

    const deployment = globalState.deployments.find((dep) => dep.Name == name);


    useEffect(() => {
        if (!deployment) return
        const folderName = deployment?.RepoUrl.replace(/\.git|\/$/, '').split('/').pop() as string
        axios.get(`${BUILDER_BACKEND}/logs/${folderName}`).then((res) => {
            setBuildOutput((res.data as string).replaceAll(/\\|\||\-/g, ""))
        })
        connect().dryrun({
            process: deployment?.ArnsProcess,
            tags: [{ name: "Action", value: "Info" }]
        }).then(r => {
            const d = JSON.parse(r.Messages[0].Data)
            console.log(d)
            setAntName(d.Name)
        })
    }, [deployment])

    if (!deployment) return <Layout>
        <div className="text-xl">Searching <span className="text-muted-foreground">{name} </span> ...</div>
    </Layout>

    return <Layout>
        <div className="text-xl">{deployment?.Name}</div>
        <Button className="w-fit absolute right-10">Deploy Latest</Button>
        <Link href={deployment.RepoUrl} target="_blank" className="w-fit flex items-center gap-1 my-2 hover:underline underline-offset-4"><Github size={24} />{deployment.RepoUrl}</Link>
        <Link href={`https://arweave.net/${deployment.DeploymentId}`} target="_blank" className="w-fit flex items-center gap-1 my-2 hover:underline underline-offset-4"><LinkIcon size={24} />DeploymentID : {deployment.DeploymentId || "..."}</Link>
        <Link href={`https://${antName}.arweave.net`} target="_blank" className="w-fit flex items-center gap-1 my-2 hover:underline underline-offset-4"><LinkIcon size={24} />ArNS : {(antName || "[fetching]") + ".arweave.net"}</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <Card>
                <div className="text-muted-foreground mb-2">Build Output</div>
                <pre className="overflow-scroll max-h-[350px] font-mono"><Ansi className="font-mono">{buildOutput}</Ansi></pre>
            </Card>
            <div className="grid grid-cols-1 gap-2">
                <Card className=" h-fit p-0">
                    <div className="text-muted-foreground">Install Command</div>
                    {deployment.InstallCMD}</Card>
                <Card className=" h-fit p-0">
                    <div className="text-muted-foreground">Build Command</div>
                    {deployment.BuildCMD}</Card>
                <Card className=" h-fit p-0">
                    <div className="text-muted-foreground">Output Directory</div>
                    {deployment.OutputDIR}</Card>
                <Button variant="destructive">Delete Deployment</Button>
            </div>
        </div>

    </Layout>
}