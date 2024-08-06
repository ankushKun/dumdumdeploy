import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider"
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { Toaster } from "@/components/ui/sonner"
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return <ThemeProvider
    defaultTheme="dark"
    attribute="class"
  ><ArweaveWalletKit config={{
    permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
    ensurePermissions: true,
  }}>
      <Head>
        <title>DumDumDeploy</title>
        <meta name="description" content="Deploy & manage permaweb apps easily" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* add icons for tab */}
        <link rel="icon" href="/joose.svg" />

      </Head>
      <Component {...pageProps} />
      <Toaster />
    </ArweaveWalletKit>
  </ThemeProvider>
}
