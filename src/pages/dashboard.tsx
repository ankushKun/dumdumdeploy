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
import Layout from "@/components/layout";

export default function SidebarDemo() {
    return <Layout>
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
    </Layout>
}
