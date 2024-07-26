import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useGlobalState } from "@/hooks";
import { runLua } from "@/lib/ao-vars";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import Arweave from "arweave"

export default function Deploy() {
    const globalState = useGlobalState();
    const router = useRouter()
    const [projName, setProjName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [installCommand, setInstallCommand] = useState("npm ci");
    const [buildCommand, setBuildCommand] = useState("");
    const [outputDir, setOutputDir] = useState("");
    const [useNewWallet, setUseNewWallet] = useState(false);
    const [newWallet, setNewWallet] = useState<object>();
    const [newWalletAddress, setNewWalletAddress] = useState<string>();

    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
    });

    async function deploy() {
        if (!projName) return toast.error("Project Name is required");
        if (!repoUrl) return toast.error("Repository Url is required");
        if (!installCommand) return toast.error("Install Command is required");
        if (!buildCommand) return toast.error("Build Command is required");
        if (!outputDir) return toast.error("Output Directory is required");

        if (!globalState.managerProcess) return toast.error("Manager process not found");

        const query = `local res = db:exec[[
            INSERT INTO Deployments (Name, RepoUrl, InstallCMD, BuildCMD, OutputDIR, DeployWithWallet)
                VALUES
            ('${projName}', '${repoUrl}', '${installCommand}', '${buildCommand}', '${outputDir}', ${newWalletAddress})
        ]]`;
        console.log(query);

        const res = await runLua(query, globalState.managerProcess)
        if (res.Error) return toast.error(res.Error);
        console.log(res);
        router.push("/deployments/" + projName);

    }

    return (
        <Layout>
            <div className="text-xl my-5 mb-10">Create New Deployment</div>

            <div className="md:min-w-[40%] w-full max-w-lg mx-auto flex flex-col gap-2">
                <label className="text-muted-foreground pl-2 pt-2 -mb-1" htmlFor="project-name">Project Name</label>
                <Input placeholder="e.g. Coolest AO App" id="project-name" required onChange={(e) => setProjName(e.target.value)} />

                <label className="text-muted-foreground pl-2 pt-2 -mb-1" htmlFor="project-name">Repository Url</label>
                <Input placeholder="e.g. github.com/weeblet/super-cool-app" id="repo-url" required onChange={(e) => setRepoUrl(e.target.value)} />

                <label className="text-muted-foreground pl-2 pt-10 -mb-1" htmlFor="project-name">Install Command</label>
                <Input placeholder="e.g. npm ci" id="install-command" required onChange={(e) => setInstallCommand(e.target.value || "npm ci")} />

                <label className="text-muted-foreground pl-2 pt-2 -mb-1" htmlFor="project-name">Build Command</label>
                <Input placeholder="e.g. npm run build" id="build-command" required onChange={(e) => setBuildCommand(e.target.value || "npm run build")} />

                <label className="text-muted-foreground pl-2 pt-2 -mb-1" htmlFor="project-name">Output Directory</label>
                <Input placeholder="e.g. ./dist" id="output-dir" required onChange={(e) => setOutputDir(e.target.value || "./dist")} />

                <div className="flex items-center space-x-3 my-4">
                    <Switch id="gen-wallet" onCheckedChange={async (e) => {
                        setUseNewWallet(e)
                        if (!e) {
                            setNewWallet(undefined)
                            setNewWalletAddress(undefined)
                            return
                        }
                        const wallet = await arweave.wallets.generate();
                        setNewWallet(wallet)
                        setNewWalletAddress(await arweave.wallets.getAddress(wallet))
                    }} />
                    <label htmlFor="gen-wallet">Generate wallet</label>
                </div>
                {useNewWallet ? <>{newWalletAddress}</> :
                    <>
                        <Input type="file" accept=".json" id="wallet-file" required onChange={(e) => {
                            if (e.target.files?.length == 0) return
                            const file = e.target.files![0];
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                const contents = e.target?.result;
                                const wallet = JSON.parse(contents as string);
                                setNewWallet(wallet)
                                setNewWalletAddress(await arweave.wallets.getAddress(wallet))
                            }
                            reader.readAsText(file);
                        }} />
                        {newWalletAddress}
                    </>
                }

                <Button className="my-10" onClick={deploy}>
                    Deploy
                </Button>

            </div>
        </Layout>
    );
}
