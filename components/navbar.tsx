import Link from "next/link";
import { Box, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <Box
      h="64px"
      p="10px 20px"
      position="sticky"
      top="0"
      display="flex"
      justifyContent="space-between"
      bgColor="#23272e"
      borderBottom="1px solid gray"
      zIndex={8}
    >
      <Link href="/">
        <Heading color="#fff">EasyDAO</Heading>
      </Link>
      <ConnectButton />
    </Box>
  );
}

export default Navbar;
