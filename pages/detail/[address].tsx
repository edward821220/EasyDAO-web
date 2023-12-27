import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { Address } from "viem";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import { useIsMounted } from "../../hooks/useIsMounted";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { CreateProposalModal } from "../../components/detail/createProposalModal";
import Overview from "../../components/detail/overview";
import ProposalsList from "../../components/detail/proposalsList";

export default function Detail() {
  const isMounted = useIsMounted();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { chain } = useNetwork();
  const { address: account } = useAccount() as { address: Address };
  const { address: daoAddress } = router.query as { address: Address };
  const chainId = chain?.id || 11155111;
  const chainName = chain?.name || "sepolia";

  const { data: daoName } = useContractRead({
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "daoName",
    onError: () => {
      router.push("/");
    },
  });

  if (!isMounted) return null;

  return (
    <div>
      <Head>
        <title>{daoName}</title>
        <link href="../static/icon.png" rel="icon" />
      </Head>
      <Box minH="calc(100vh - 64px)" color="white" bgColor="#23272f">
        <Box maxW="1280px" m="0 auto" py="50px" px="20px">
          <Heading as="h2">Overview</Heading>
          {daoName && (
            <Overview
              daoName={daoName}
              daoAddress={daoAddress}
              account={account}
              chainId={chainId}
            />
          )}
          <Heading as="h2" mt={6}>
            Upgraded Features
          </Heading>
          <Flex mt={6} gap={6} flexWrap="wrap">
            <Button size="lg" colorScheme="yellow">
              Ownership
            </Button>
            <Button size="lg" colorScheme="yellow">
              Dividend
            </Button>
            <Button size="lg" colorScheme="yellow">
              Vault
            </Button>
          </Flex>

          <Flex mt={10} alignItems="center">
            <Heading as="h2">Proposals</Heading>
            <Button ml={6} colorScheme="facebook" onClick={onOpen}>
              Create Proposal
            </Button>
          </Flex>
          <ProposalsList
            chainId={chainId}
            chainName={chainName}
            account={account}
            daoAddress={daoAddress}
          />
        </Box>
      </Box>
      <CreateProposalModal
        isOpen={isOpen}
        onClose={onClose}
        chainName={chainName}
        daoAddress={daoAddress}
      />
    </div>
  );
}
