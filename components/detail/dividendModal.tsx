import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  UnorderedList,
  ListItem,
  useToast,
  Link,
} from "@chakra-ui/react";
import { Address, formatEther } from "viem";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface DividendModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  account: Address;
  daoAddress: Address;
}
function DividendModal(props: DividendModalProps) {
  const { isOpen, onClose, chainId, chainName, account, daoAddress } = props;
  const toast = useToast();
  const contract = {
    chainId,
    address: daoAddress,
    abi: CONTRACT_INFOS.DividendFacet.abi,
  };
  const { data: annualRate } = useContractRead({
    ...contract,
    functionName: "getAnnualRate",
  });
  const { data: duration } = useContractRead({
    ...contract,
    functionName: "getDuration",
  });
  const { data: initialBalance } = useContractRead({
    ...contract,
    account,
    functionName: "getInitialBalance",
  });
  const { data: totalDividend } = useContractRead({
    ...contract,
    account,
    functionName: "getTotalDividend",
  });
  const { data: releasedDividend } = useContractRead({
    ...contract,
    account,
    functionName: "getReleasedDividend",
    watch: true,
  });
  const { data: calculateDividend } = useContractRead({
    ...contract,
    account,
    functionName: "calculateDividend",
    watch: true,
  });

  const { isLoading, write } = useContractWrite({
    ...contract,
    functionName: "withdrawDividend",
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Dividend</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList>
              <ListItem>{`Annual Rate: ${annualRate}%`}</ListItem>
              <ListItem>{`Duration: ${
                Number(duration) / 604800
              } Weeks`}</ListItem>
              <ListItem>
                {`Initial Balance: ${formatEther(initialBalance || BigInt(0))}`}
              </ListItem>
              <ListItem>
                {`Total Dividend: ${formatEther(totalDividend || BigInt(0))}`}
              </ListItem>
              <ListItem>
                {`Released Dividend: ${formatEther(
                  releasedDividend || BigInt(0)
                )}`}
              </ListItem>
              <ListItem>
                {`Calculate Dividend: ${formatEther(
                  calculateDividend || BigInt(0)
                )}`}
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="teal"
              onClick={() => {
                if (calculateDividend && calculateDividend > 0) {
                  write?.();
                } else {
                  toast({
                    title: "You don't have any dividend.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DividendModal;
