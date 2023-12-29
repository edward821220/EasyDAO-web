import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Address } from "viem";
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
  const {
    isOpen: isOpenCrowdfunding,
    onOpen: onOpenCrowdfunding,
    onClose: onCloseCrowdfunding,
  } = useDisclosure();

  return (
    <>
      <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Vault</DrawerHeader>
          <DrawerBody>
            <Button
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
