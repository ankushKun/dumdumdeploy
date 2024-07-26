"use client";
import React, { useState } from "react";
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
import { cn } from "@/lib/utils";
import { ConnectButton } from "arweave-wallet-kit";
import { Plus, User2, UserCircle2 } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function SidebarDemo() {
    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "New Project",
            href: "/deploy",
            icon: (
                <Plus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
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
                    <div>
                        {open ? <ConnectButton /> : <UserCircle2 size={30} className="bg-black rounded-full p-1 mb-3" />}
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard />
        </div>
    );
}

const DeploymentCard = () => {

}

const Dashboard = () => {
    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-l-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="text-xl">Your Deployments</div>
                <HoverEffect items={[
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                    {
                        title: "Deployment 1",
                        description: "last opened on xyz",
                        link: "/deployments/deployment1"
                    },
                ]} />
            </div>
        </div>
    );
};
