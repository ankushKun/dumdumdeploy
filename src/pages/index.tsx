import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ConnectButton, useActiveAddress, useConnection } from "arweave-wallet-kit";
import { useEffect } from "react";

export default function Home() {
  const { connected, connect } = useConnection()

  useEffect(() => {
    connect()
  }, [])

  return (
    <WavyBackground blur={10} waveWidth={100} colors={["#ff9f00", "#ff5a36", "#ff8c69", "#ffcc99"]} backgroundFill="#111" className="w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-center text-5xl md:text-6xl font-bold">DumDumDeploy</h1>
        <p className="md:text-xl my-1">Deploy & manage permaweb apps easily</p>
        <Link href={connected ? "/dashboard" : "/deploy"}><Button className="rounded-full my-6">{connected ? "View Deployments" : "Deploy your first app"} <span className="text-2xl ml-1">🧃</span></Button></Link>
      </div>
      <div className="fixed bottom-5 left-0 right-0 text-center">
        Deploy to Permaweb | ArNS Integrated
      </div>
    </WavyBackground>
  );
}
