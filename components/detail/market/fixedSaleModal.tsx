import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  FormLabel,
  FormControl,
  NumberInput,
  NumberInputField,
  Link,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../../../abi/contracts";

interface FixedSaleFormData {
  amount: bigint;
  pricePerToken: bigint;
}
interface FixedSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  account: Address;
  daoAddress: Address;
}
function FixedSaleModal(props: FixedSaleModalProps) {
  const { isOpen, onClose, chainId, chainName, account, daoAddress } = props;
  const toast = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const { register, handleSubmit, reset } = useForm<FixedSaleFormData>({
    defaultValues: {
      amount: BigInt(0),
      pricePerToken: BigInt(0),
    },
  });

  const { isLoading: isLoadingFixedSale, write: createFixedSale } =
    useContractWrite({
      chainId,
      address: CONTRACT_INFOS.Market.address,
      abi: CONTRACT_INFOS.Market.abi,
      functionName: "createFixedSale",
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
              Create FixedSale succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Create FixedSale failed",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      },
    });

  const { data: allowance } = useContractRead({
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "allowance",
    watch: true,
    args: [account, CONTRACT_INFOS.Market.address],
  });

  const onSubmit = async (formData: FixedSaleFormData) => {
    if (isLoading) return;
    if (Number(allowance) < formData.amount) {
      setIsApproving(true);
      try {
        await writeContract({
          address: daoAddress,
          abi: CONTRACT_INFOS.DaoFacet.abi,
          functionName: "approve",
          args: [
            CONTRACT_INFOS.Market.address,
            BigInt(Number(formData.amount) * 10 ** 18),
          ],
        });
        setIsApproving(false);
        createFixedSale?.({
          args: [
            daoAddress,
            BigInt(Number(formData.amount) * 10 ** 18),
            BigInt(Number(formData.pricePerToken) * 10 ** 18),
          ],
        });
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
      createFixedSale?.({
        args: [
          daoAddress,
          BigInt(Number(formData.amount) * 10 ** 18),
          BigInt(Number(formData.pricePerToken) * 10 ** 18),
        ],
      });
    }
    onClose();
    reset();
  };
  const isLoading = isApproving || isLoadingFixedSale;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>FixedSale</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mt={4}>
                <FormLabel>Price Per Token (ETH)</FormLabel>
                <NumberInput>
                  <NumberInputField {...register("pricePerToken")} />
                </NumberInput>
                <FormLabel mt={4}>Amount</FormLabel>
                <NumberInput>
                  <NumberInputField {...register("amount")} />
                </NumberInput>
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

export default FixedSaleModal;
