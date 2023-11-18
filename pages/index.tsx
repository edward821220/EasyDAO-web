import Head from "next/head";
import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>EasyDao</title>
        <meta content="Establish your DAO easily!" name="description" />
        <link href="../static/icon.png" rel="icon" />
      </Head>
      <Box minH="calc(100vh - 64px)" bgColor="#23272f">
        <Box maxW="1280px" m="0 auto"></Box>
      </Box>
    </div>
  );
};

export default Home;
