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

interface DividendData {
  description: string;
  duration: bigint;
  annualRate: bigint;
}

interface DividendProps {
  chainName: string;
  daoAddress: Address;
  onClose: () => void;
  isOwner?: boolean;
}

function DividendForm(props: DividendProps) {
  const { chainName, daoAddress, onClose, isOwner } = props;
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<DividendData>({
    defaultValues: {
      description: "",
      duration: BigInt(0),
      annualRate: BigInt(0),
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
  const onSubmit = (formData: DividendData) => {
    if (isLoading) return;
    const functionSelectors = (
      CONTRACT_INFOS.DividendFacet.abi.filter(
        (abi) => abi.type === "function"
      ) as AbiFunction[]
    ).map(getFunctionSelector);
    const cut = [
      {
        facetAddress: CONTRACT_INFOS.DividendFacet.address,
        action: 0,
        functionSelectors,
      },
    ];
    const initData = encodeFunctionData({
      abi: CONTRACT_INFOS.DividendInit.abi,
      functionName: "init",
      args: [BigInt(Number(formData.duration) * 604800), formData.annualRate],
    });
    if (isOwner) {
      diamondCut?.({
        args: [cut, CONTRACT_INFOS.DividendInit.address, initData],
        value: BigInt(0.06 * 10 ** 18),
      });
    } else {
      const diamondCutData = encodeFunctionData({
        abi: CONTRACT_INFOS.DiamondCutFacet.abi,
        functionName: "diamondCutByProposal",
        args: [cut, CONTRACT_INFOS.DividendInit.address, initData],
      });

      createProposal?.({
        args: [diamondCutData, "Upgrade Dividend", formData.description],
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
    <form key="DividendForm" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <FormControl>
          <FormLabel mt={4}>Proposal Description</FormLabel>
          <Input
            required
            mb={1}
            placeholder={"Proposal Description"}
            {...register("description")}
          />
          <FormLabel mt={4}>Duration (Weeks)</FormLabel>
          <Input
            mb={1}
            required
            type="number"
            min={1}
            placeholder={"Duration (Weeks)"}
            {...register("duration")}
          />
          <FormLabel mt={4}>Annual Rate (%)</FormLabel>
          <Input
            mb={1}
            required
            type="number"
            min={1}
            placeholder={"Annual Rate (%)"}
            {...register("annualRate")}
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

export default DividendForm;
