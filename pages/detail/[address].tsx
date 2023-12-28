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
import { AddIcon } from "@chakra-ui/icons";
import { Address } from "viem";
import { useAccount, useNetwork, useContractRead, useBalance } from "wagmi";
import { readContract } from "@wagmi/core";
import { useIsMounted } from "../../hooks/useIsMounted";
import { CONTRACT_INFOS } from "../../abi/contracts";
import Overview from "../../components/detail/overview";
import ProposalsList from "../../components/detail/proposalsList";
import CreateProposalModal from "../../components/detail/createProposalModal";
import OwnershipModal from "../../components/detail/ownershipModal";
import DividendModal from "../../components/detail/dividendModal";

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
  const {
    isOpen: isOpenDividend,
    onOpen: onOpenDividend,
    onClose: onCloseDividend,
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

  const { data: tokenBalance } = useBalance({
    address: account,
    token: daoAddress,
    chainId: chainId,
    watch: true,
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
              tokenBalance={tokenBalance?.formatted || "0"}
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
                    colorScheme="facebook"
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
                  <Button
                    size="lg"
                    colorScheme="facebook"
                    onClick={() => onOpenDividend()}
                  >
                    Dividend
                  </Button>
                )}
                {hasVaultFacet && (
                  <Button size="lg" colorScheme="facebook">
                    Vault
                  </Button>
                )}
              </Flex>
            </Box>
          )}
          <Flex mt={10} alignItems="center">
            <Heading as="h2">Proposals</Heading>
            <AddIcon
              ml={4}
              boxSize={6}
              cursor="pointer"
              onClick={() => {
                if (tokenBalance && Number(tokenBalance?.formatted) >= 100) {
                  onOpenProposal();
                  return;
                } else {
                  toast({
                    title: "You don't have enough tokens.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            />
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
        facetAddresses={facetAddresses || []}
      />
      {hasOwnershipFacet && (
        <OwnershipModal
          isOpen={isOpenOwnership}
          onClose={onCloseOwnership}
          chainName={chainName}
          daoAddress={daoAddress}
          facetAddresses={facetAddresses || []}
        />
      )}
      {hasDividendFacet && (
        <DividendModal
          isOpen={isOpenDividend}
          onClose={onCloseDividend}
          chainId={chainId}
          chainName={chainName}
          account={account}
          daoAddress={daoAddress}
        />
      )}
    </div>
  );
}
