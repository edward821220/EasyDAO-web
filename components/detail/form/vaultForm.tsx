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
import { useContractWrite } from "wagmi";
import { Address, encodeFunctionData, getFunctionSelector } from "viem";
import type { AbiFunction } from "abitype";
import { CONTRACT_INFOS } from "../../../abi/contracts";

interface VaultData {
  description: string;
}

interface VaultProps {
  chainName: string;
  daoAddress: Address;
  onClose: () => void;
  isOwner?: boolean;
}

function VaultForm({ chainName, daoAddress, onClose, isOwner }: VaultProps) {
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<VaultData>({
    defaultValues: {
      description: "",
    },
  });

  const { isLoading: isLoadingCreateProposal, write: createProposal } =
    useContractWrite({
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

  const { isLoading: isLoadingDiamondCut, write: diamondCut } =
    useContractWrite({
      address: daoAddress,
      abi: CONTRACT_INFOS.DiamondCutFacet.abi,
      functionName: "diamondCut",
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
              Upgrade Succeeded
              <ExternalLinkIcon mx="2px" />
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
          description: "Upgrade failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const isLoading = isLoadingCreateProposal || isLoadingDiamondCut;

  const onSubmit = (formData: VaultData) => {
    if (isLoading) return;
    const functionSelectors = (
      CONTRACT_INFOS.VaultFacet.abi.filter(
        (abi) => abi.type === "function"
      ) as AbiFunction[]
    ).map(getFunctionSelector);
    const cut = [
      {
        facetAddress: CONTRACT_INFOS.VaultFacet.address,
        action: 0,
        functionSelectors,
      },
    ];
    const initData = encodeFunctionData({
      abi: CONTRACT_INFOS.VaultInit.abi,
      functionName: "init",
    });

    if (isOwner) {
      diamondCut?.({
        args: [cut, CONTRACT_INFOS.VaultInit.address, initData],
        value: BigInt(0.06 * 10 ** 18),
      });
    } else {
      const diamondCutByProposalData = encodeFunctionData({
        abi: CONTRACT_INFOS.DiamondCutFacet.abi,
        functionName: "diamondCutByProposal",
        args: [cut, CONTRACT_INFOS.VaultInit.address, initData],
      });
      createProposal?.({
        args: [diamondCutByProposalData, "Upgrade Vault", formData.description],
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
    <form key="VaultForm" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        {!isOwner && (
          <FormControl>
            <FormLabel mt={4}>Proposal Description</FormLabel>
            <Input
              required
              mb={1}
              placeholder={"Proposal Description"}
              {...register("description")}
            />
          </FormControl>
        )}
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

export default VaultForm;
