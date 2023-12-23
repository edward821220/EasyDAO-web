import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useIsMounted } from "../hooks/useIsMounted";
import { CreateDAOModal } from "../components/createDAOModal";
import { CONTRACT_INFOS } from "../abi/contracts";

interface DAOInfo {
  daoAddress: string;
  daoName: string;
}
const Home: NextPage = () => {
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useContractRead<
    typeof CONTRACT_INFOS.DiamondFactory.abi,
    "getDAOs",
    DAOInfo[]
  >({
    address: CONTRACT_INFOS.DiamondFactory.address,
    abi: CONTRACT_INFOS.DiamondFactory.abi,
    functionName: "getDAOs",
    watch: true,
    chainId: chain?.id || 11155111,
  });

  if (!isMounted) return null;

  return (
    <div>
      <Head>
        <title>EasyDao</title>
        <meta content="Establish your DAO easily!" name="description" />
        <link href="../static/icon.png" rel="icon" />
      </Head>
      <Box h="calc(100vh - 64px)" color="white" bgColor="#23272f">
        <Box p={5}>
          <Heading as="h1" size={{ xl: "2xl", base: "xl" }} mb={3}>
            Welcome to Easy DAO
          </Heading>
          <Box fontSize={{ xl: "xl", lg: "md", base: "s" }}>
            <Text>Discover our platform for effortless DAO creation.</Text>
            <Text>Engage in governance through proposal and voting.</Text>
            <Text>
              Join us on the journey of decentralized decision-making and
              empowerment.
            </Text>
          </Box>
        </Box>
        <Box maxW="1280px" m="0 auto" py="50px" px="20px">
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="6">
            <GridItem>
              <Button
                colorScheme="facebook"
                p="1.25rem"
                w="100%"
                h="100%"
                border="1px solid gray"
                boxShadow="rgba(0, 0, 0, 0.5) 0px 0px 5px"
                onClick={() => {
                  if (!isConnected) {
                    openConnectModal?.();
                  } else {
                    onOpen();
                  }
                }}
              >
                Create Your DAO
              </Button>
            </GridItem>
            {data?.map((dao) => (
              <Link key={dao.daoAddress} href={`/detail/${dao.daoAddress}`}>
                <GridItem
                  p="1.25rem"
                  textAlign="center"
                  border="1px solid gray"
                  borderRadius="0.375rem"
                  boxShadow="rgba(0, 0, 0, 0.5) 0px 0px 5px"
                  _hover={{
                    boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 15px",
                    background: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {dao.daoName}
                </GridItem>
              </Link>
            ))}
          </Grid>
        </Box>
      </Box>
      <CreateDAOModal
        isOpen={isOpen}
        onClose={onClose}
        chainName={chain?.name || "sepolia"}
      />
    </div>
  );
};

export default Home;
