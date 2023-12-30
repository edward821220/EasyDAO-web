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

interface AuctionFormData {
  amount: bigint;
  startPrice: bigint;
  duration: bigint;
}
interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  account: Address;
  daoAddress: Address;
}
function AuctionModal(props: AuctionModalProps) {
  const { isOpen, onClose, chainId, chainName, account, daoAddress } = props;
  const toast = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const { register, handleSubmit, reset } = useForm<AuctionFormData>({
    defaultValues: {
      amount: BigInt(0),
      startPrice: BigInt(0),
      duration: BigInt(0),
    },
  });

  const { isLoading: isLoadingAuction, write: createAuction } =
    useContractWrite({
      chainId,
      address: CONTRACT_INFOS.Market.address,
      abi: CONTRACT_INFOS.Market.abi,
      functionName: "createAuction",
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
              Create Auction succeeded! <ExternalLinkIcon mx="2px" />
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
          description: "Create Auction failed",
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

  // const { isLoading: isLoadingFixedSale, write: createFixedSale } =
  //   useContractWrite({
  //     ...contract,
  //     functionName: "createFixedSale",
  //     onSuccess: (data) => {
  //       toast({
  //         title: "Transaction succeeded",
  //         description: (
  //           <Link
  //             href={`https://${chainName.toLowerCase()}.etherscan.io/tx/${
  //               data?.hash
  //             }`}
  //             isExternal
  //           >
  //             Create Auction succeeded! <ExternalLinkIcon mx="2px" />
  //           </Link>
  //         ),
  //         status: "success",
  //         duration: 10000,
  //         isClosable: true,
  //       });
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Transaction failed",
  //         description: "Create Auction failed",
  //         status: "error",
  //         duration: 10000,
  //         isClosable: true,
  //       });
  //     },
  //   });
  const onSubmit = async (formData: AuctionFormData) => {
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
        createAuction?.({
          args: [
            daoAddress,
            BigInt(Number(formData.amount) * 10 ** 18),
            BigInt(Number(formData.startPrice) * 10 ** 18),
            BigInt(Number(formData.duration)),
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
      createAuction?.({
        args: [
          daoAddress,
          BigInt(Number(formData.amount) * 10 ** 18),
          BigInt(Number(formData.startPrice) * 10 ** 18),
          BigInt(Number(formData.duration)),
        ],
      });
    }
    onClose();
    reset();
  };
  const isLoading = isApproving || isLoadingAuction;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Auction</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mt={4}>
                <FormLabel>Start Price (ETH)</FormLabel>
                <NumberInput>
                  <NumberInputField {...register("startPrice")} />
                </NumberInput>
                <FormLabel mt={4}>Amount</FormLabel>
                <NumberInput>
                  <NumberInputField {...register("amount")} />
                </NumberInput>
                <FormLabel mt={4}>Duration (Days)</FormLabel>
                <NumberInput>
                  <NumberInputField {...register("duration")} />
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

export default AuctionModal;
