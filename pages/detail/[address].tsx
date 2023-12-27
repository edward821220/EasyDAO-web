import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Address } from "viem";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { useIsMounted } from "../../hooks/useIsMounted";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { CreateProposalModal } from "../../components/detail/createProposalModal";
import Overview from "../../components/detail/overview";
import ProposalsList from "../../components/detail/proposalsList";
import OwnershipModal from "../../components/detail/ownershipModal";

export default function Detail() {
  const toast = useToast();
  const isMounted = useIsMounted();
  const {
    isOpen: isOpenProposal,
    onOpen: onOpenProposal,
    onClose: onCloseProposal,
  } = useDisclosure();
  const {
    isOpen: isOpenOwnership,
    onOpen: onOpenOwnership,
    onClose: onCloseOwnership,
  } = useDisclosure();
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
  const { data: facetAddresses } = useContractRead({
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.DiamondLoupeFacet.abi,
    functionName: "facetAddresses",
    watch: true,
  });
  const hasUpgradedFeatures =
    Array.isArray(facetAddresses) && facetAddresses?.length > 3;

  const hasOwnershipFacet = facetAddresses?.includes(
    CONTRACT_INFOS.OwnershipFacet.address
  );
  const hasDividendFacet = facetAddresses?.includes(
    CONTRACT_INFOS.DividendFacet.address
  );
  const hasVaultFacet = facetAddresses?.includes(
    CONTRACT_INFOS.VaultFacet.address
  );

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
          {hasUpgradedFeatures && (
            <Box>
              <Heading as="h2" mt={6}>
                Upgraded Features
              </Heading>
              <Flex mt={6} gap={6} flexWrap="wrap">
                {hasOwnershipFacet && (
                  <Button
                    size="lg"
                    colorScheme="yellow"
                    onClick={async () => {
                      const owner = await readContract({
                        address: daoAddress,
                        abi: CONTRACT_INFOS.OwnershipFacet.abi,
                        functionName: "owner",
                      });
                      if (owner === account) {
                        onOpenOwnership();
                      } else {
                        toast({
                          title: "You are not the owner of this DAO",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Ownership
                  </Button>
                )}
                {hasDividendFacet && (
                  <Button size="lg" colorScheme="yellow">
                    Dividend
                  </Button>
                )}
                {hasVaultFacet && (
                  <Button size="lg" colorScheme="yellow">
                    Vault
                  </Button>
                )}
              </Flex>
            </Box>
          )}
          <Flex mt={10} alignItems="center">
            <Heading as="h2">Proposals</Heading>
            <Button ml={6} colorScheme="facebook" onClick={onOpenProposal}>
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
        isOpen={isOpenProposal}
        onClose={onCloseProposal}
        chainName={chainName}
        daoAddress={daoAddress}
      />
      <OwnershipModal
        isOpen={isOpenOwnership}
        onClose={onCloseOwnership}
        chainName={chainName}
        daoAddress={daoAddress}
      />
    </div>
  );
}
