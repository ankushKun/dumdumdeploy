import { useEffect, useState } from "react";
import { useGlobalState } from "./useGlobalState";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";
import { getManagerProcessFromAddress } from "@/lib/utils";
import { runLua, spawnProcess } from "@/lib/ao-vars";
import { connect } from "@permaweb/aoconnect";

const setupCommands = `json = require "json"

if not db then
    db = require"lsqlite3".open_memory()
end

db:exec[[
    CREATE TABLE IF NOT EXISTS Deployments (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        RepoUrl TEXT NOT NULL,
        Branch TEXT DEFAULT 'main',
        InstallCMD TEXT DEFAULT 'npm ci',
        BuildCMD TEXT DEFAULT 'npm run build',
        OutputDIR TEXT DEFAULT './dist',
        ArnsProcess TEXT,
        DeploymentId TEXT,
        DeploymentHash TEXT
    )
]]

Handlers.add(
    "DumDumDeploy.GetDeployments",
    Handlers.utils.hasMatchingTag("Action","DumDumDeploy.GetDeployments"),
    function(msg)
        local deployments = {}
        for row in db:nrows[[SELECT * FROM Deployments]] do
            table.insert(deployments, row)
        end
        Send({Target=msg.From, Data=json.encode(deployments)})
    end
)
    
return "OK"
`

export default function useDeploymentManager() {
    const globalState = useGlobalState();
    const { connected } = useConnection();
    const address = useActiveAddress();
    const ao = connect()

    useEffect(() => {
        if (connected && address) {
            getManagerProcessFromAddress(address).then((id) => {
                if (id) {
                    console.log("deployment manager id", id);
                    globalState.setManagerProcess(id);
                } else {
                    console.log("No manager process found, spawning new one");
                    spawnProcess("DumDumDeploy-Manager").then(async (newId) => {
                        await runLua(setupCommands, newId)
                        console.log("deployment manager id", newId);
                        globalState.setManagerProcess(newId);
                    });
                }
            })
        }
    }, [connected, address])

    useEffect(() => {
        refresh();
    }, [globalState.managerProcess])

    async function refresh() {
        if (!globalState.managerProcess) return

        console.log("fetching deployments")

        const result = await connect().dryrun({
            process: globalState.managerProcess,
            tags: [{ name: "Action", value: "DumDumDeploy.GetDeployments" }],
            Owner: address
        })

        try {
            if (result.Error) return alert(result.Error)
            console.log("result", result)
            const { Messages } = result
            const deployments = JSON.parse(Messages[0].Data)
            console.log("deployments", deployments)
            globalState.setDeployments(deployments)
        }
        catch {
            await runLua(setupCommands, globalState.managerProcess)
            await refresh()
        }

    }

    return {
        managerProcess: globalState.managerProcess,
        deployments: globalState.deployments,
        refresh
    }
}