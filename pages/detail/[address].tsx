import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  ListItem,
  Progress,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { decodeEventLog, parseAbiItem } from "viem";
import {
  useToken,
  useBalance,
  useAccount,
  useNetwork,
  useContractEvent,
  useContractRead,
} from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { useIsMounted } from "../../hooks/useIsMounted";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { CreateProposalModal } from "../../components/detail/createProposalModal";

const convertStatus = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Pending", color: "yellow" };
    case 1:
      return { label: "Approved", color: "green" };
    case 2:
      return { label: "Rejected", color: "red" };
    case 3:
      return { label: "Finished", color: "blue" };
    case 4:
      return { label: "Cancelled", color: "gray" };
    default:
      return { label: "Unknown", color: "gray" };
  }
};

interface ProposalCreatedEvent {
  proposalId: BigInt;
  proposalType: string;
  description: string;
}
export default function Detail() {
  const isMounted = useIsMounted();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { address: daoAddress } = router.query;
  const publicClient = getPublicClient();
  const [proposalEvents, setProposalEvents] = useState<ProposalCreatedEvent[]>(
    []
  );
  const contract = {
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    chainId: chain?.id || 11155111,
  };

  useEffect(() => {
    const getAllEvents = async () => {
      const logs = await publicClient.getLogs({
        address: daoAddress as `0x${string}`,
        event: parseAbiItem(
          "event ProposalCreated(uint256 indexed proposalId, string proposalType, string description)"
        ),
        fromBlock: BigInt(1),
      });
      const decodedLogs = logs.map(
        (log) =>
          decodeEventLog({
            abi: CONTRACT_INFOS.DaoFacet.abi,
            data: log.data,
            topics: log.topics,
          }).args
      ) as ProposalCreatedEvent[];
      setProposalEvents(decodedLogs);
    };
    getAllEvents();
  }, [publicClient, daoAddress]);

  useContractEvent({
    ...contract,
    eventName: "ProposalCreated",
    listener(logs) {
      const decodedLogs = logs.map(
        (log) =>
          decodeEventLog({
            abi: CONTRACT_INFOS.DaoFacet.abi,
            data: log.data,
            topics: log.topics,
          }).args
      ) as ProposalCreatedEvent[];
      setProposalEvents([...proposalEvents, ...decodedLogs]);
    },
  });

  const { data: daoName } = useContractRead({
    ...contract,
    functionName: "daoName",
    onError: () => {
      router.push("/");
    },
  });
  const { data: proposalDetails } = useContractRead({
    ...contract,
    functionName: "getProposals",
  });
  const { data: tokenData } = useToken(contract);
  const { data: tokenBalance } = useBalance({
    address: account,
    token: daoAddress as `0x${string}`,
    chainId: contract.chainId,
    watch: true,
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
          <Box mt={6}>
            {proposalEvents?.map((proposal, index) => {
              const createdAt = new Date(
                Number(proposalDetails?.[index].createdAt) * 1000
              );
              const endAt = new Date(
                createdAt.valueOf() + 7 * 24 * 60 * 60 * 1000
              );
              return (
                <Box
                  key={Number(proposal.proposalId)}
                  p={4}
                  mb={4}
                  border="1px solid gray"
                  borderRadius="12px"
                >
                  <Grid templateColumns="1fr 1fr 2.5fr 3fr" gap={6} mb={2}>
                    <Flex gap={2} alignItems="baseline">
                      <Badge
                        p={1}
                        colorScheme={
                          convertStatus(proposalDetails?.[index].status).color
                        }
                        borderRadius="12px"
                      >
                        {convertStatus(proposalDetails?.[index].status).label}
                      </Badge>
                      <Box>ID: {String(proposal.proposalId)}</Box>
                    </Flex>
                    <Box>Type: {proposal.proposalType}</Box>
                    <Box>Description: {proposal.description}</Box>
                    <Box>Author: {proposalDetails?.[index].author}</Box>
                  </Grid>
                  <Box mb={1}>Yes: </Box>
                  <Progress
                    mb={1}
                    colorScheme="green"
                    size="lg"
                    value={
                      ((Number(proposalDetails?.[index].votesYes) / 10 ** 18) *
                        100) /
                      Number(tokenData?.totalSupply.formatted)
                    }
                  />
                  <Box mb={1}>No:</Box>
                  <Progress
                    mb={1}
                    colorScheme="red"
                    size="lg"
                    value={
                      ((Number(proposalDetails?.[index].votesYes) / 10 ** 18) *
                        100) /
                      Number(tokenData?.totalSupply.formatted)
                    }
                  />

                  <Flex justifyContent="space-between" mt={6}>
                    <Box>
                      Created Time: {createdAt.toLocaleDateString()}{" "}
                      {createdAt.toLocaleTimeString()}
                    </Box>
                    <Box>
                      End Time: {new Date(endAt).toLocaleDateString()}{" "}
                      {new Date(endAt).toLocaleTimeString()}{" "}
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Box>
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
