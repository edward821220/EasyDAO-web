import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  FormLabel,
  FormControl,
  Link,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Address } from "viem";
import { useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../../../abi/contracts";

interface CrowdfundingFormData {
  amount: bigint;
  token: string;
  description: string;
}
interface CrowdfundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  daoAddress: Address;
}
function CrowdfundingModal(props: CrowdfundingModalProps) {
  const { isOpen, onClose, chainId, chainName, daoAddress } = props;
  const toast = useToast();
  const [crowdfundingType, setCrowdfundingType] = useState("ETH");
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CrowdfundingFormData>({
    defaultValues: {
      amount: BigInt(0),
      token: "",
      description: "",
    },
  });

  const contract = {
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.VaultFacet.abi,
  };

  const { isLoading: isLoadingETH, write: crowdfundingETH } = useContractWrite({
    ...contract,
    functionName: "createCrowdfundingETH",
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
            Create crowdfunding succeeded! <ExternalLinkIcon mx="2px" />
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
        description: "Create crowdfunding failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });
  const { isLoading: isLoadingERC20, write: crowdfundingERC20 } =
    useContractWrite({
      ...contract,
      functionName: "createCrowdfundingERC20",
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
              Create crowdfunding succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Create crowdfunding failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const isLoading = isLoadingETH || isLoadingERC20;

  const handleCrowdfundingType = (option: string) => {
    setCrowdfundingType(option);
  };

  const onSubmit = (formData: CrowdfundingFormData) => {
    if (isLoading) return;
    if (crowdfundingType === "ETH") {
      crowdfundingETH?.({
        args: [
          formData.description,
          BigInt(Number(formData.amount) * 10 ** 18),
        ],
      });
    } else {
      crowdfundingERC20?.({
        args: [
          formData.description,
          formData.token as Address,
          BigInt(Number(formData.amount) * 10 ** 18),
        ],
      });
    }
    toast({
      title: "Transaction submitted",
      description: "Please wait for transaction to be confirmed",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    onClose();
    reset();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Crowdfunding</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="teal"
                  rightIcon={<ChevronDownIcon />}
                >
                  {crowdfundingType}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleCrowdfundingType("ETH")}>
                    ETH
                  </MenuItem>
                  <MenuItem onClick={() => handleCrowdfundingType("ERC20")}>
                    ERC20
                  </MenuItem>
                </MenuList>
              </Menu>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  required
                  placeholder="Description"
                  {...register("description")}
                />
                <FormLabel mt={4}>Amount</FormLabel>
                <Input
                  required
                  type="number"
                  min={1}
                  placeholder="Amount"
                  {...register("amount")}
                />
                {crowdfundingType === "ERC20" && (
                  <>
                    <FormLabel mt={4}>Token Address</FormLabel>
                    <Input
                      required
                      placeholder="Token Address"
                      {...register("token", {
                        pattern: {
                          value: /^0x[a-fA-F0-9]{40}$/,
                          message: "Invalid address",
                        },
                      })}
                    />
                    {errors.token && (
                      <Text mt={1} color="red">
                        {errors.token.message}
                      </Text>
                    )}
                  </>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                mr={3}
              >
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CrowdfundingModal;
