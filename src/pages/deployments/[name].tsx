import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card-hover-effect";
import { useGlobalState } from "@/hooks";
import useDeploymentManager from "@/hooks/useDeploymentManager";
import { Github, LinkIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { BUILDER_BACKEND } from "@/lib/utils";
import Ansi from "ansi-to-react";
import { connect } from "@permaweb/aoconnect";
import { toast } from "sonner";
import { runLua } from "@/lib/ao-vars";
<<<<<<< HEAD
=======

>>>>>>> b9ec6a65c1731ed10d3ccd1d48208f9406ff3d11

export default function Deployment() {
    const globalState = useGlobalState();
    const { managerProcess, deployments, refresh } = useDeploymentManager();
    const router = useRouter();
    const name = router.query.name;
<<<<<<< HEAD
    const [buildOutput, setBuildOutput] = useState("");
    const [antName, setAntName] = useState("");

=======
    const [buildOutput, setBuildOutput] = useState("")
    const [antName, setAntName] = useState("")
    const [redeploying, setRedeploying] = useState(false)
>>>>>>> b9ec6a65c1731ed10d3ccd1d48208f9406ff3d11
    const deployment = globalState.deployments.find((dep) => dep.Name == name);
    const redeploy = async () => {
        if (!deployment) return
        const projName = deployment.Name
        const repoUrl = deployment.RepoUrl
        const installCommand = deployment.InstallCMD
        const buildCommand = deployment.BuildCMD
        const outputDir = deployment.OutputDIR
        const arnsProcess = deployment.ArnsProcess
        //send the deployment to the builder
        const txid = await axios.post(`${BUILDER_BACKEND}/deploy`, {
            repository: repoUrl,
            installCommand,
            buildCommand,
            outputDir,
        })
        if (txid.status == 200) {
            console.log("https://arweave.net/" + txid.data)
            toast.success("Deployment successful")

            const mres = await runLua("", arnsProcess, [
                { name: "Action", value: "Set-Record" },
                { name: "Sub-Domain", value: "@" },
                { name: "Transaction-Id", value: txid.data },
                { name: "TTL-Seconds", value: "3600" },
            ])
            console.log("set arns name", mres)

            const updres = await runLua(`db:exec[[UPDATE Deployments SET DeploymentId='${txid.data}' WHERE Name='${projName}']]`, globalState.managerProcess)
            console.log(updres)
            router.push("/deployments/" + projName);
            await refresh()
            window.open("https://arweave.net/" + txid.data, "_blank")

            setRedeploying(false)
        } else {
            toast.error("Deployment failed")
            console.log(txid)
        }

    }
    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (!deployment) return;
        const folderName = deployment?.RepoUrl.replace(/\.git|\/$/, '').split('/').pop() as string;
        axios.get(`${BUILDER_BACKEND}/logs/${folderName}`).then((res) => {
            setBuildOutput((res.data as string).replaceAll(/\\|\||\-/g, ""));
        });
        connect().dryrun({
            process: deployment?.ArnsProcess,
            tags: [{ name: "Action", value: "Info" }]
        }).then(r => {
            const d = JSON.parse(r.Messages[0].Data);
            console.log(d);
            setAntName(d.Name);
        });
    }, [deployment]);

    async function deleteDeployment() {
        if (!deployment) return toast.error("Deployment not found");

        if (!globalState.managerProcess) return toast.error("Manager process not found");

        const query = `local res = db:exec[[
            DELETE FROM Deployments
            WHERE Name = '${deployment.Name}'
        ]]`;
        console.log(query);

        const res = await runLua(query, globalState.managerProcess);
        if (res.Error) return toast.error(res.Error);
        console.log(res);
        await refresh();

        toast.success("Deployment deleted successfully");
        router.push("/dashboard");
    }

    if (!deployment) return <Layout>
        <div className="text-xl">Searching <span className="text-muted-foreground">{name} </span> ...</div>
    </Layout>;

    return <Layout>
        <div className="text-xl">{deployment?.Name}</div>
        <Button className="w-fit absolute right-10" onClick={redeploy}>
            DeployLatestCommit <Loader className={redeploying ? "animate-spin" : "hidden"} />
        </Button>
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
                <Button variant="destructive" onClick={deleteDeployment}>Delete Deployment</Button>
            </div>
        </div>
    </Layout>;
}
