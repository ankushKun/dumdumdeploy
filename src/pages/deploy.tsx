import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalState } from "@/hooks";
import { runLua } from "@/lib/ao-vars";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function Deploy() {
    const globalState = useGlobalState();
    const router = useRouter()
    const [projName, setProjName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [installCommand, setInstallCommand] = useState("npm ci");
    const [buildCommand, setBuildCommand] = useState("");
    const [outputDir, setOutputDir] = useState("");

    async function deploy() {
        if (!projName) return toast.error("Project Name is required");
        if (!repoUrl) return toast.error("Repository Url is required");
        if (!installCommand) return toast.error("Install Command is required");
        if (!buildCommand) return toast.error("Build Command is required");
        if (!outputDir) return toast.error("Output Directory is required");

        if (!globalState.managerProcess) return toast.error("Manager process not found");

        const query = `local res = db:exec[[INSERT INTO Deployments (Name, RepoUrl, InstallCMD, BuildCMD, OutputDIR) VALUES ('${projName}', '${repoUrl}', '${installCommand}', '${buildCommand}', '${outputDir}')]]`;
        console.log(query);

        const res = await runLua(query, globalState.managerProcess)
        if (res.Error) return toast.error(res.Error);
        console.log(res);
        router.push("/dashboard/");

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

                <Button className="my-10" onClick={deploy}>
                    Deploy
                </Button>

            </div>
        </Layout>
    );
}
