import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, holesky } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layout from "../components/layout";

const { chains, publicClient } = configureChains(
  [sepolia, holesky],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http:
          chain.name === "Holesky"
            ? process.env.NEXT_PUBLIC_HOLESKY_RPC!
            : chain.rpcUrls.public.http[0],
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "EasyDao",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} locale="en-US">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
