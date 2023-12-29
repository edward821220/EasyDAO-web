import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, useContractWrite } from "wagmi";
import type { AbiFunction } from "abitype";
import { CONTRACT_INFOS } from "../../../abi/contracts";
import { encodeFunctionData, getFunctionSelector } from "viem";

interface DowngradeFormData {
  description: string;
}

interface DowngradeFormProps {
  chainName: string;
  daoAddress: Address;
  downgradeType: "Ownership" | "Dividend" | "Vault";
  onClose: () => void;
}

function DowngradeForm(props: DowngradeFormProps) {
  const { chainName, daoAddress, downgradeType, onClose } = props;
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<DowngradeFormData>({
    defaultValues: {
      description: "",
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
  const onSubmit = (formData: DowngradeFormData) => {
    if (isLoading) return;

    const functionSelectors = (
      CONTRACT_INFOS[`${downgradeType}Facet`].abi.filter(
        (abi) => abi.type === "function"
      ) as AbiFunction[]
    ).map(getFunctionSelector);
    const cut = [
      {
        facetAddress: "0x0000000000000000000000000000000000000000" as const,
        action: 2,
        functionSelectors,
      },
    ];
    const initData = encodeFunctionData({
      abi: CONTRACT_INFOS[`${downgradeType}Init`].abi,
      functionName: "init",
      args:
        downgradeType === "Ownership"
          ? ["0x0000000000000000000000000000000000000000"]
          : downgradeType === "Vault"
          ? undefined
          : downgradeType === "Dividend"
          ? [BigInt(0), BigInt(0)]
          : undefined,
    });

    const diamondCutData = encodeFunctionData({
      abi: CONTRACT_INFOS.DiamondCutFacet.abi,
      functionName: "diamondCutByProposal",
      args: [cut, CONTRACT_INFOS[`${downgradeType}Init`].address, initData],
    });

    write?.({
      args: [
        diamondCutData,
        `Downgrade ${downgradeType}`,
        formData.description,
      ],
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
    <form key="DowngradeForm" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <FormControl>
          <FormLabel mt={4}>Proposal Description</FormLabel>
          <Input
            required
            mb={1}
            placeholder={"Proposal Description"}
            {...register("description")}
          />
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

export default DowngradeForm;
