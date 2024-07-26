import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider"
import { ArweaveWalletKit } from "arweave-wallet-kit";

export default function App({ Component, pageProps }: AppProps) {
  return <ThemeProvider
    defaultTheme="dark"
    attribute="class"
  ><ArweaveWalletKit config={{
    permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
    ensurePermissions: true,
  }}>
      <Component {...pageProps} />
    </ArweaveWalletKit>
  </ThemeProvider>
}
