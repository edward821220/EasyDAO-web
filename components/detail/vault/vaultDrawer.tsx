import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Link,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  CircularProgress,
  CircularProgressLabel,
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, formatEther } from "viem";
import { readContract, writeContract, getPublicClient } from "@wagmi/core";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../../../abi/contracts";
import { ERC20_APPROVE_ABI } from "../../../abi/approve";
import CrowdfundingModal from "./crowdfundingModal";

interface VaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  account: Address;
  tokenBalance: number;
  daoAddress: Address;
}
function VaultDrawer(props: VaultDrawerProps) {
  const {
    isOpen,
    onClose,
    chainId,
    chainName,
    account,
    tokenBalance,
    daoAddress,
  } = props;
  const toast = useToast();
  const publicClient = getPublicClient();
  const {
    isOpen: isOpenCrowdfunding,
    onOpen: onOpenCrowdfunding,
    onClose: onCloseCrowdfunding,
  } = useDisclosure();
  const [amounts, setAmounts] = useState<number[]>([]);
  const [isApproving, setIsApproving] = useState(false);

  const contract = {
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.VaultFacet.abi,
  };
  const { data: crowdfundingInfos } = useContractRead({
    ...contract,
    functionName: "checkCrowdfundingInfos",
    watch: true,
    onSuccess(data) {
      amounts.length < data.length &&
        setAmounts(new Array(data.length).fill(0));
    },
  });

  const { isLoading: isLoadingContributeETH, write: contributeETH } =
    useContractWrite({
      ...contract,
      functionName: "contributeETH",
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
              Contribute succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Contribute failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingWithdrawETH, write: withdrawETH } =
    useContractWrite({
      ...contract,
      functionName: "withdrawETHByCrowdfunding",
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
              Withdraw succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Withdraw failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingContributeERC20, write: contributeERC20 } =
    useContractWrite({
      ...contract,
      functionName: "contributeERC20",
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
              Contribute succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Contribute failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { isLoading: isLoadingWithdrawERC20, write: withdrawERC20 } =
    useContractWrite({
      ...contract,
      functionName: "withdrawERC20ByCrowdfunding",
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
              Withdraw succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Withdraw failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });
  const handleContributeETH = (id: bigint, amount: bigint) => {
    contributeETH?.({ args: [id], value: amount });
  };

  const handleWithdrawETH = (id: bigint) => {
    withdrawETH?.({ args: [id] });
  };

  const handleContributeERC20 = (id: bigint, amount: bigint) => {
    contributeERC20?.({ args: [id, amount] });
  };

  const handleWithdrawERC20 = (id: bigint) => {
    withdrawERC20?.({ args: [id] });
  };

  const isLoadingContribute =
    isLoadingContributeETH || isLoadingContributeERC20 || isApproving;
  const isLoadingWithdraw = isLoadingWithdrawETH || isLoadingWithdrawERC20;

  return (
    <>
      <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Vault</DrawerHeader>
          <DrawerBody>
            <Button
              mb={6}
              colorScheme="teal"
              onClick={() => {
                tokenBalance > 0
                  ? onOpenCrowdfunding()
                  : toast({
                      title: "You are nut the member of this DAO",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
              }}
            >
              Create Crowdfunding
            </Button>
            {crowdfundingInfos?.map((crowdfundingInfo, index) => {
              const isETH =
                crowdfundingInfo.token ===
                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
              const progress =
                (Number(crowdfundingInfo.currentAmount) * 100) /
                Number(crowdfundingInfo.targetAmount);
              const amount = amounts[index];
              return (
                <Box
                  key={index}
                  p={4}
                  mb={4}
                  border="1px solid gray"
                  borderRadius="12px"
                >
                  <Flex
                    gap={4}
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Box maxW="80%">
                      <Text>ID: {index + 1}</Text>
                      <Text wordBreak="break-word">
                        Description: {crowdfundingInfo.title}
                      </Text>
                      <Text wordBreak="break-all">
                        Initiator: {crowdfundingInfo.crowdfundingInitiator}
                      </Text>
                      <Text wordBreak="break-all">
                        {isETH ? "" : `Token: ${crowdfundingInfo.token}`}
                      </Text>
                      <Text>
                        Target Amount:{" "}
                        {formatEther(crowdfundingInfo.targetAmount)}
                      </Text>
                      <Text>
                        Current Amount:{" "}
                        {formatEther(crowdfundingInfo.currentAmount)}
                      </Text>
                    </Box>
                    <CircularProgress
                      value={progress}
                      color="green.400"
                      size="80px"
                    >
                      <CircularProgressLabel>{progress}%</CircularProgressLabel>
                    </CircularProgress>
                  </Flex>
                  <Flex
                    mt={2}
                    gap={4}
                    justifyContent="flex-end"
                    flexWrap="wrap"
                  >
                    {account === crowdfundingInfo.crowdfundingInitiator || (
                      <>
                        <NumberInput width="30%">
                          <NumberInputField
                            value={amount}
                            onChange={(e) =>
                              setAmounts(
                                amounts.map((amount, amountIndex) =>
                                  amountIndex === index
                                    ? Number(e.target.value)
                                    : amount
                                )
                              )
                            }
                          />
                        </NumberInput>
                        <Button
                          isLoading={isLoadingContribute}
                          colorScheme="facebook"
                          onClick={async () => {
                            if (amount <= 0) {
                              toast({
                                title: "Invalid amount",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              });
                              return;
                            }
                            if (isETH) {
                              handleContributeETH(
                                BigInt(index),
                                BigInt(amount * 10 ** 18)
                              );
                            } else {
                              const allowance = await readContract({
                                address: crowdfundingInfo.token,
                                abi: ERC20_APPROVE_ABI,
                                functionName: "allowance",
                                args: [account, daoAddress],
                              });
                              if (Number(allowance) < amount * 10 ** 18) {
                                setIsApproving(true);
                                try {
                                  const data = await writeContract({
                                    address: crowdfundingInfo.token,
                                    abi: ERC20_APPROVE_ABI,
                                    functionName: "approve",
                                    args: [
                                      daoAddress,
                                      BigInt(amount * 10 ** 18),
                                    ],
                                  });
                                  await publicClient.waitForTransactionReceipt({
                                    hash: data.hash,
                                  });
                                  setIsApproving(false);
                                } catch {
                                  toast({
                                    title: "Approve failed",
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                  });
                                  setIsApproving(false);
                                }
                              } else {
                                handleContributeERC20(
                                  BigInt(index),
                                  BigInt(amount * 10 ** 18)
                                );
                              }
                            }
                          }}
                        >
                          Contribute
                        </Button>
                      </>
                    )}
                    {account === crowdfundingInfo.crowdfundingInitiator && (
                      <Button
                        colorScheme="pink"
                        isLoading={isLoadingWithdraw}
                        onClick={() => {
                          isETH
                            ? handleWithdrawETH(BigInt(index))
                            : handleWithdrawERC20(BigInt(index));
                        }}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Flex>
                </Box>
              );
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <CrowdfundingModal
        isOpen={isOpenCrowdfunding}
        onClose={onCloseCrowdfunding}
        chainId={chainId}
        chainName={chainName}
        daoAddress={daoAddress}
      />
    </>
  );
}

export default VaultDrawer;
