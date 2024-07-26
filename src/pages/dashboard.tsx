"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn, getManagerProcessFromAddress } from "@/lib/utils";
import { ConnectButton, useActiveAddress, useConnection } from "arweave-wallet-kit";
import { Loader, Plus, User2, UserCircle2 } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Layout from "@/components/layout";
import { spawnProcess } from "@/lib/ao-vars";
import { useGlobalState } from "@/hooks";
import useDeploymentManager from "@/hooks/useDeploymentManager";
import { TDeployment } from "@/types";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const { connected, connect } = useConnection()
    const address = useActiveAddress()
    const globalState = useGlobalState()
    const { managerProcess, deployments, refresh } = useDeploymentManager()

    useEffect(() => {
        console.log("connected", connected, address)
        refresh()
    }, [])

    return <Layout>
        <div className="text-xl">Your Deployments</div>

        {!managerProcess && <div className="text-xl"><Loader className="animate-spin m-5 mx-auto" /></div>}
        {managerProcess && deployments.length == 0 && <div className="text-muted-foreground mx-auto text-center">No deployments yet<br /><Link href="/deploy"><Button variant="link" className="text-muted-foreground p-0">Cilck here to create one</Button></Link></div>}
        <HoverEffect items={deployments.map((dep: TDeployment) => { return { title: dep.Name, description: dep.RepoUrl, link: `/deployments/${dep.Name}` } })} />
    </Layout>
}
