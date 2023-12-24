import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useToken,
  useBalance,
  useAccount,
  useNetwork,
  useContractReads,
} from "wagmi";
import { useIsMounted } from "../../hooks/useIsMounted";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { CreateProposalModal } from "../../components/detail/createProposalModal";

export default function Detail() {
  const isMounted = useIsMounted();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { address: daoAddress } = router.query;
  const contract = {
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    chainId: chain?.id || 11155111,
  };
  const { data } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "daoName",
      },
    ],
    watch: true,
  });
  console.log(data?.[0]?.result);
  const daoName = data?.[0]?.result;
  const { data: tokenData } = useToken({
    address: daoAddress as `0x${string}`,
    chainId: chain?.id || 11155111,
  });
  const { data: tokenBalance } = useBalance({
    address: account,
    token: daoAddress as `0x${string}`,
    chainId: chain?.id || 11155111,
    watch: true,
  });

  if (!isMounted) return null;
  if (!daoName) router.push("/");

  return (
    <div>
      <Head>
        <title>{daoName}</title>
        <link href="../static/icon.png" rel="icon" />
      </Head>
      <Box h="calc(100vh - 64px)" color="white" bgColor="#23272f">
        <Box maxW="1280px" m="0 auto" py="50px" px="20px">
          <Heading as="h2">Overview</Heading>
          <UnorderedList mt={6} fontSize="20px" spacing={2}>
            <ListItem>Organization Name: {daoName}</ListItem>
            <ListItem>Contract Address: {daoAddress}</ListItem>
            <ListItem>Token Name: {tokenData?.name}</ListItem>
            <ListItem>Token Symbol: {tokenData?.symbol}</ListItem>
            <ListItem>
              Total Supply: {tokenData?.totalSupply.formatted}
            </ListItem>
            <ListItem>Your Balance: {tokenBalance?.formatted}</ListItem>
          </UnorderedList>
          <Flex mt={6} alignItems="center">
            <Heading as="h2">Proposals</Heading>
            <Button ml={6} colorScheme="facebook" onClick={onOpen}>
              Create Proposal
            </Button>
          </Flex>
          <Box></Box>
        </Box>
      </Box>
      <CreateProposalModal
        isOpen={isOpen}
        onClose={onClose}
        chainName={chain?.name || "sepolia"}
        daoAddress={daoAddress as `0x${string}`}
      />
    </div>
  );
}
