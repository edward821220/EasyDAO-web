import {
  Badge,
  Box,
  Button,
  Flex,
  Link,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, formatEther } from "viem";
import { useContractRead, useContractWrite } from "wagmi";
import { useState } from "react";
import { CONTRACT_INFOS } from "../../../abi/contracts";

interface IAuctionsListProps {
  account: Address;
  daoAddress: Address;
  chainId: number;
  chainName: string;
}

function AuctionsList(props: IAuctionsListProps) {
  const { account, daoAddress, chainId, chainName } = props;
  const toast = useToast();
  const [bidPrice, setBidPrice] = useState(0);
  const contract = {
    chainId,
    address: CONTRACT_INFOS.Market.address,
    abi: CONTRACT_INFOS.Market.abi,
  };
  const { data: auctionsInfo } = useContractRead({
    ...contract,
    functionName: "checkAuctions",
    args: [daoAddress],
    watch: true,
  });

  const { isLoading: isLoadingEndAuction, write: endAuction } =
    useContractWrite({
      ...contract,
      functionName: "endAuction",
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
              End Auction succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "End Auction failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingCancelAuction, write: cancelAuction } =
    useContractWrite({
      ...contract,
      functionName: "cancelAuction",
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
              Cancel Auction succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Cancel Auction failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingBid, write: bid } = useContractWrite({
    ...contract,
    functionName: "bid",
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
            Bid succeeded! <ExternalLinkIcon mx="2px" />
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
        description: "Bid failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });
  return (
    <>
      {Number(auctionsInfo?.length) > 0 ? (
        <Flex mt={4} gap={4} flexWrap="wrap">
          {auctionsInfo?.map((auction, index) => {
            const isTimeout =
              new Date() > new Date(Number(auction.endTime) * 1000);
            const isEnded = auction.ended;
            const hasBidder =
              auction.highestBidder !==
              "0x0000000000000000000000000000000000000000";
            return (
              <Box
                key={index}
                p={4}
                width="300px"
                border="1px solid gray"
                borderRadius="8px"
              >
                <Badge
                  p={2}
                  mb={2}
                  colorScheme={isTimeout || isEnded ? "red" : "green"}
                  borderRadius="8px"
                >
                  {isEnded ? "Ended" : isTimeout ? "Timeout" : "Ongoing"}
                </Badge>
                <Text>Seller: {auction.seller.slice(0, 10)}...</Text>
                <Text>Highest Bid: {formatEther(auction.highestBid)}</Text>
                <Text>Start Price: {formatEther(auction.startPrice)}</Text>
                <Text>Amount: {formatEther(auction.tokenAmount)}</Text>
                <Text>
                  {hasBidder &&
                    `Highest Bidder: ${auction.highestBidder.slice(0, 10)}...`}
                </Text>
                <Text wordBreak="break-word">
                  End Time:{" "}
                  {new Date(Number(auction.endTime) * 1000).toLocaleString()}
                </Text>
                <Flex mt={4} gap={2} justifyContent="flex-end">
                  {!isEnded && !isTimeout && (
                    <>
                      <NumberInput>
                        <NumberInputField
                          value={bidPrice}
                          onChange={(e) => {
                            setBidPrice(Number(e.target.value));
                          }}
                        />
                      </NumberInput>
                      <Button
                        isLoading={isLoadingBid}
                        colorScheme="blue"
                        onClick={() => {
                          bid?.({
                            args: [daoAddress, BigInt(index + 1)],
                            value: BigInt(bidPrice * 10 ** 18),
                          });
                        }}
                      >
                        Bid
                      </Button>
                    </>
                  )}
                  {isTimeout && !isEnded && (
                    <Button
                      isLoading={isLoadingEndAuction}
                      onClick={() => {
                        endAuction?.({
                          args: [daoAddress, BigInt(index + 1)],
                        });
                      }}
                      colorScheme="orange"
                    >
                      End
                    </Button>
                  )}
                  {account === auction.seller && !hasBidder && !isEnded && (
                    <Button
                      isLoading={isLoadingCancelAuction}
                      colorScheme="red"
                      onClick={() => {
                        cancelAuction?.({
                          args: [daoAddress, BigInt(index + 1)],
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })}
        </Flex>
      ) : (
        <Box my={10} textAlign="center" fontSize="36px">
          No Auction
        </Box>
      )}
    </>
  );
}

export default AuctionsList;
