import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Link,
  Badge,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, formatEther } from "viem";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../../../abi/contracts";

interface IFixedSalesListProps {
  account: Address;
  daoAddress: Address;
  chainId: number;
  chainName: string;
}

function FixedSalesList(props: IFixedSalesListProps) {
  const { account, daoAddress, chainId, chainName } = props;
  const toast = useToast();
  const [buyAmount, setBuyAmount] = useState(0);
  const contract = {
    chainId,
    address: CONTRACT_INFOS.Market.address,
    abi: CONTRACT_INFOS.Market.abi,
  };
  const { data: fixedSalesInfo } = useContractRead({
    ...contract,
    functionName: "checkFixedSales",
    args: [daoAddress],
    watch: true,
  });

  const { isLoading: isLoadingCancelSale, write: cancelSale } =
    useContractWrite({
      ...contract,
      functionName: "cancelFixedSale",
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
              Cancel Sale succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Cancel Sale failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingBuy, write: buy } = useContractWrite({
    ...contract,
    functionName: "buyFixedSale",
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
            Buy succeeded! <ExternalLinkIcon mx="2px" />
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
        description: "Buy failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      {Number(fixedSalesInfo?.length) > 0 ? (
        <Flex mt={4} gap={4} flexWrap="wrap">
          {fixedSalesInfo?.map((fixedSale, index) => {
            const isCanceled = fixedSale.canceled;
            const isSoldOut = fixedSale.soldAmount === fixedSale.tokenAmount;
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
                  colorScheme={isSoldOut || isCanceled ? "red" : "green"}
                  borderRadius="8px"
                >
                  {isCanceled ? "Canceled" : isSoldOut ? "Sold Out" : "Ongoing"}
                </Badge>
                <Text>Seller: {fixedSale.seller.slice(0, 10)}...</Text>
                <Text>
                  Price Per Token: {formatEther(fixedSale.pricePerToken)} ETH
                </Text>
                <Text>Total Amount: {formatEther(fixedSale.tokenAmount)}</Text>
                <Text>Sold Amount: {formatEther(fixedSale.soldAmount)}</Text>
                <Flex mt={4} gap={2} justifyContent="flex-end">
                  {!isCanceled && !isSoldOut && (
                    <>
                      <NumberInput>
                        <NumberInputField
                          value={buyAmount}
                          onChange={(e) => {
                            setBuyAmount(Number(e.target.value));
                          }}
                        />
                      </NumberInput>
                      <Button
                        isLoading={isLoadingBuy}
                        colorScheme="blue"
                        onClick={() => {
                          buy?.({
                            args: [
                              daoAddress,
                              BigInt(index + 1),
                              BigInt(Number(buyAmount) * 10 ** 18),
                            ],
                            value: BigInt(
                              Number(buyAmount) *
                                Number(fixedSale.pricePerToken)
                            ),
                          });
                        }}
                      >
                        Buy
                      </Button>
                    </>
                  )}
                  {account === fixedSale.seller &&
                    !isCanceled &&
                    !isSoldOut && (
                      <Button
                        isLoading={isLoadingCancelSale}
                        colorScheme="red"
                        onClick={() => {
                          cancelSale?.({
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
          No Fixed Price Sale
        </Box>
      )}
    </>
  );
}

export default FixedSalesList;
