import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn, DEPLOYMENT_WALLET } from "@/lib/utils";
import axios from "axios"
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { Plus, User2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { ConnectButton, useConnection } from "arweave-wallet-kit";
import Head from "next/head";

const links = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "New Deployment",
        href: "/deploy",
        icon: (
            <Plus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    }
];

export default function Layout({ children }: { children?: React.ReactNode }) {
    const { connected } = useConnection()
    const [arBalance, setArBalance] = useState(0)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get(`https://arweave.net/wallet/${DEPLOYMENT_WALLET}/balance`).then(res => setArBalance((res.data as number) / 1000000000000))
    }, [])
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "min-h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 min-h-screen overflow-clip">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <Link href="/" className="text-2xl whitespace-nowrap">{open ? "🧃 DumDumDeploy" : "🧃"}</Link>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        {open && <div className="py-5 text-muted-foreground text-center">
                            <div className="mb-2">Deployment Fund</div>
                            <div>{`${arBalance}`.substring(0, 4)} $AR | ? turbo credits</div>
                            <div className="text-xs mt-2 -mx-2 leading-relaxed text-justify">
                                The service uses a central wallet topped up with $AR and turbo credits to ease your deployment process.
                                To contribute to deployment fund,
                                gift turbo credits or send $AR at<br />
                                <span className="font-mono bg-black/30 p-1 rounded text-[10.5px]">{DEPLOYMENT_WALLET}</span></div>
                        </div>}
                        {open ? <ConnectButton /> : <UserCircle2 size={30} className="bg-black rounded-full p-1 mb-3" />}
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1">
                <div className="p-2 md:p-10 rounded-t-2xl md:rounded-r-none md:rounded-l-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full max-h-screen overflow-scroll">
                    {connected ? children : "Connect Wallet to continue :)"}
                </div></div>
        </div>
    );
}