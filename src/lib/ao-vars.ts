import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import { createDataItemSigner as nodeCDIS } from "@permaweb/aoconnect/node";

export const AppVersion = "1.0.0";
export const AOModule = "u1Ju_X8jiuq4rX9Nh-ZGRQuYQZgV2MKLMT3CZsykk54"; // sqlite
export const AOScheduler = "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";


const CommonTags = [
    { name: "App-Name", value: "DumDumDeploy" },
    { name: "App-Version", value: AppVersion },
];

export type Tag = { name: string; value: string };


export async function spawnProcess(name?: string, tags?: Tag[], newProcessModule?: string) {
    const ao = connect();

    if (tags) {
        tags = [...CommonTags, ...tags];
    } else {
        tags = CommonTags;
    }
    tags = name ? [...tags, { name: "Name", value: name }] : tags;

    const result = await ao.spawn({
        module: newProcessModule ? newProcessModule : AOModule,
        scheduler: AOScheduler,
        tags,
        signer: (window.arweaveWallet as any)?.signDataItem ? createDataItemSigner(window.arweaveWallet) : nodeCDIS(window.arweaveWallet),
    });

    return result;
}

export async function runLua(code: string, process: string, tags?: Tag[]) {
    const ao = connect();

    if (tags) {
        tags = [...CommonTags, ...tags];
    } else {
        tags = CommonTags;
    }

    // if (!window.arweaveWallet) {
    //   const dryMessage = await ao.dryrun({
    //     process,
    //     data: code,
    //     tags,
    //   });
    //   return dryMessage
    // }

    tags = [...tags, { name: "Action", value: "Eval" }];

    const message = await ao.message({
        process,
        data: code,
        signer: (window.arweaveWallet as any)?.signDataItem ? createDataItemSigner(window.arweaveWallet) : nodeCDIS(window.arweaveWallet),
        tags,
    });

    const result = await ao.result({ process, message });
    // console.log(result);
    (result as any).id = message;
    return result;
}

export async function getResults(process: string, cursor = "") {
    const ao = connect();

    const r = await ao.results({
        process,
        from: cursor,
        sort: "ASC",
        limit: 999999,
    });

    if (r.edges.length > 0) {
        const newCursor = r.edges[r.edges.length - 1].cursor;
        const results = r.edges.map((e) => e.node);
        return { cursor: newCursor, results };
    } else {
        return { cursor, results: [] };
    }
}

export async function monitor(process: string) {
    const ao = connect();

    const r = await ao.monitor({
        process,
        signer: (window.arweaveWallet as any)?.signDataItem ? createDataItemSigner(window.arweaveWallet) : nodeCDIS(window.arweaveWallet),
    });

    return r;
}

export async function unmonitor(process: string) {
    const ao = connect();

    const r = await ao.unmonitor({
        process,
        signer: (window.arweaveWallet as any)?.signDataItem ? createDataItemSigner(window.arweaveWallet) : nodeCDIS(window.arweaveWallet),
    });

    return r;
}

export function parseOutupt(out: any) {
    if (!out.Output) return out;
    const data = out.Output.data;
    const { json, output } = data;
    if (json != "undefined") {
        return json;
    }
    try {
        return JSON.parse(output);
    } catch (e) {
        return output;
    }
}