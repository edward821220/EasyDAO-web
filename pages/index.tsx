import Head from "next/head";
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
import { CreateDAOModal } from "../components/createDAOModal";
import { useAccount, useContractRead } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CONTRACT_INFOS } from "../abi/contracts";

interface DAOInfo {
  daoAddress: string;
  daoName: string;
}
const Home: NextPage = () => {
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
  });

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
            <Text>Engage in governance through proposals and voting.</Text>
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
              <GridItem
                key={dao.daoAddress}
                p="1.25rem"
                textAlign="center"
                border="1px solid gray"
                borderRadius="0.375rem"
                boxShadow="rgba(0, 0, 0, 0.5) 0px 0px 5px"
                cursor="pointer"
                onClick={() => {}}
              >
                <Text>{dao.daoName}</Text>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>
      <CreateDAOModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Home;
