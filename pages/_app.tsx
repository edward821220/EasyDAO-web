import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Layout from "../components/layout";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, holesky, localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, holesky, localhost],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "EasyDao",
  projectId: "f1f580c83aff21813df95a9251ccdcf9",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
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
