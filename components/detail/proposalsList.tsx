import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Link,
  Badge,
  Button,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, decodeEventLog, parseAbiItem } from "viem";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { CONTRACT_INFOS } from "../../abi/contracts";

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
  proposalId: bigint;
  totalSupplySnapshot: bigint;
  proposalType: string;
  description: string;
}

interface ProposalsListProps {
  chainId: number;
  chainName: string;
  account: Address;
  daoAddress: Address;
}
function ProposalsList({
  chainId,
  chainName,
  account,
  daoAddress,
}: ProposalsListProps) {
  const toast = useToast();
  const publicClient = getPublicClient();
  const [proposalEvents, setProposalEvents] = useState<ProposalCreatedEvent[]>(
    []
  );
  const proposalEventsRef = useRef<ProposalCreatedEvent[]>([]);
  const contract = {
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    chainId,
  };

  const { data: proposalDetails } = useContractRead({
    ...contract,
    functionName: "getProposals",
    watch: true,
  });
  const fromBlock = proposalDetails?.[0]?.snapshotId;

  useEffect(() => {
    if (!daoAddress) return;
    if (!fromBlock) return;
    const getAllEvents = async () => {
      const logs = await publicClient.getLogs({
        address: daoAddress,
        event: parseAbiItem(
          "event ProposalCreated(uint256 indexed proposalId,uint256 indexed totalSupplySnapshot, string proposalType, string description)"
        ),
        fromBlock,
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
      proposalEventsRef.current = decodedLogs;
    };
    getAllEvents();
  }, [publicClient, daoAddress, fromBlock]);

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
      const newEvents = proposalEventsRef.current.concat(decodedLogs);
      proposalEventsRef.current = newEvents;
      setProposalEvents(newEvents);
    },
  });

  const { isLoading: isLoadingVote, write: vote } = useContractWrite({
    ...contract,
    functionName: "vote",
    onSuccess: (data) => {
      toast({
        title: "Transaction succeeded",
        description: (
          <Link
            href={`https://${chainName.toLowerCase()}.etherscan.io/tx/${
              data?.hash
            }`}
            isExternal
          >
            Voted! <ExternalLinkIcon mx="2px" />
          </Link>
        ),
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Transaction failed",
        description: "Vote failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });
  const { isLoading: isLoadingExecute, write: execute } = useContractWrite({
    ...contract,
    functionName: "executeProposal",
    onSuccess: (data) => {
      toast({
        title: "Transaction succeeded",
        description: (
          <Link
            href={`https://${chainName.toLowerCase()}.etherscan.io/tx/${
              data?.hash
            }`}
            isExternal
          >
            Executed! <ExternalLinkIcon mx="2px" />
          </Link>
        ),
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Transaction failed",
        description: "Execute failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });
  const { isLoading: isLoadingCancel, write: cancel } = useContractWrite({
    ...contract,
    functionName: "cancelProposal",
    onSuccess: (data) => {
      toast({
        title: "Transaction succeeded",
        description: (
          <Link
            href={`https://${chainName.toLowerCase()}.etherscan.io/tx/${
              data?.hash
            }`}
            isExternal
          >
            Canceled! <ExternalLinkIcon mx="2px" />
          </Link>
        ),
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Transaction failed",
        description: "Cancel failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });

  const handleVote = (proposalId: bigint, side: 0 | 1) => {
    if (isLoadingVote) return;
    vote?.({ args: [proposalId, side] });
  };

  const handleExecute = (proposalId: bigint, proposalType: string) => {
    if (isLoadingExecute) return;
    const type = proposalType.split(" ")[0];
    const needETH = type === "Upgrade" || type === "Downgrade";
    execute?.({
      args: [proposalId],
      value: needETH ? BigInt(0.06 * 10 ** 18) : BigInt(0),
    });
  };

  const handleCancel = (proposalId: bigint) => {
    if (isLoadingCancel) return;
    cancel?.({ args: [proposalId] });
  };
  return (
    <Box mt={6}>
      {proposalDetails?.map((proposal, index) => {
        const createdAt = new Date(Number(proposal.createdAt) * 1000);
        const endAt = new Date(createdAt.valueOf() + 7 * 24 * 60 * 60 * 1000);
        return (
          <Box
            key={Number(proposal.id)}
            p={4}
            mb={4}
            border="1px solid gray"
            borderRadius="12px"
          >
            <Flex
              justifyContent="space-between"
              flexWrap="wrap"
              rowGap={2}
              columnGap={4}
              mb={2}
            >
              <Flex gap={2} alignItems="baseline">
                <Badge
                  px={2}
                  py={1}
                  colorScheme={convertStatus(proposal.status)?.color}
                  borderRadius="12px"
                >
                  {convertStatus(proposal.status)?.label}
                </Badge>
                <Box>ID: {String(proposal.id)}</Box>
              </Flex>
              <Box>Type: {proposalEvents?.[index]?.proposalType}</Box>
              <Box wordBreak="break-all">
                Description: {proposalEvents?.[index]?.description}
              </Box>
              <Box wordBreak="break-all">Author: {proposal.author}</Box>
            </Flex>
            <Box mb={1}>Yes: </Box>
            <Progress
              mb={1}
              colorScheme="teal"
              size="lg"
              value={
                proposalEvents?.[index]
                  ? (Number(proposal.votesYes) * 100) /
                    Number(proposalEvents?.[index]?.totalSupplySnapshot)
                  : 0
              }
              cursor="pointer"
              onClick={() => {
                handleVote(proposal.id, 0);
              }}
            />
            <Box mb={1}>No:</Box>
            <Progress
              mb={1}
              colorScheme="pink"
              size="lg"
              value={
                proposalEvents?.[index]
                  ? (Number(proposal.votesNo) * 100) /
                    Number(proposalEvents?.[index]?.totalSupplySnapshot)
                  : 0
              }
              cursor="pointer"
              onClick={() => {
                handleVote(proposal.id, 1);
              }}
            />
            <Flex mt={6} justifyContent="space-between" flexWrap="wrap">
              <Box mr={4}>
                Created Time: {createdAt.toLocaleDateString()}{" "}
                {createdAt.toLocaleTimeString()}
              </Box>
              <Box>
                End Time: {new Date(endAt).toLocaleDateString()}{" "}
                {new Date(endAt).toLocaleTimeString()}{" "}
              </Box>
            </Flex>
            <Flex justifyContent="flex-end" mt={4} gap={4}>
              {convertStatus(proposal.status)?.label === "Pending" &&
                account === proposalDetails?.[index].author && (
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      handleCancel(proposal.id);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              {convertStatus(proposal.status)?.label === "Approved" &&
                proposalEvents?.[index]?.proposalType !== "Other" && (
                  <Button
                    colorScheme="cyan"
                    isLoading={isLoadingExecute}
                    onClick={() => {
                      handleExecute(
                        proposal.id,
                        proposalEvents?.[index]?.proposalType
                      );
                    }}
                  >
                    Execute
                  </Button>
                )}
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
}

export default ProposalsList;
