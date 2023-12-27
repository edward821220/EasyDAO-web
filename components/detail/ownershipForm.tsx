import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useContractWrite } from "wagmi";
import { Address, encodeFunctionData, getFunctionSelector } from "viem";
import type { AbiFunction } from "abitype";
import { CONTRACT_INFOS } from "../../abi/contracts";

interface OwnershipData {
  description: string;
  owner: string;
}

interface OwnershipProps {
  chainName: string;
  daoAddress: `0x${string}`;
  onClose: () => void;
}

function OwnershipForm({ chainName, daoAddress, onClose }: OwnershipProps) {
  const toast = useToast();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<OwnershipData>({
    defaultValues: {
      description: "",
      owner: "",
    },
  });

  const { isLoading, write } = useContractWrite({
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "createProposal",
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
            Proposal Created <ExternalLinkIcon mx="2px" />
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
        description: "Proposal creation failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (formData: OwnershipData) => {
    if (isLoading) return;
    const functionSelectors = (
      CONTRACT_INFOS.OwnershipFacet.abi.filter(
        (abi) => abi.type === "function"
      ) as AbiFunction[]
    ).map(getFunctionSelector);
    const cut = [
      {
        facetAddress: CONTRACT_INFOS.OwnershipFacet.address,
        action: 0,
        functionSelectors,
      },
    ];
    const initData = encodeFunctionData({
      abi: CONTRACT_INFOS.OwnershipInit.abi,
      functionName: "init",
      args: [formData.owner as Address],
    });
    const diamondCutData = encodeFunctionData({
      abi: CONTRACT_INFOS.DiamondCutFacet.abi,
      functionName: "diamondCutByProposal",
      args: [cut, CONTRACT_INFOS.OwnershipInit.address, initData],
    });

    write?.({
      args: [diamondCutData, "Upgrade Ownership", formData.description],
    });

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
    <form key="OwnershipForm" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <FormControl>
          <FormLabel mt={4}>Proposal Description</FormLabel>
          <Input
            required
            mb={1}
            placeholder={"Proposal Description"}
            {...register("description")}
          />
          <FormLabel mt={4}>New Owner</FormLabel>
          <Input
            required
            mb={1}
            placeholder={"New Owner"}
            {...register("owner", {
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/,
                message: "Invalid address",
              },
            })}
          />
          {errors.owner && (
            <Text mb={1} color="red">
              {errors.owner.message}
            </Text>
          )}
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button type="submit" colorScheme="blue" isLoading={isLoading} mr={3}>
          Submit
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </form>
  );
}

export default OwnershipForm;