import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Address } from "viem";
import OwnershipForm from "./form/ownershipForm";

interface OwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainName: string;
  daoAddress: Address;
}
function OwnershipModal(props: OwnershipModalProps) {
  const { isOpen, onClose, chainName, daoAddress } = props;
  const [actionType, setActionType] = useState("Transfer Ownership");
  const [upgradeType, setUpgradeType] = useState("Dividend");

  const handleActionType = (option: string) => {
    setActionType(option);
  };

  const handleUpgradeType = (option: string) => {
    setUpgradeType(option);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Ownership</ModalHeader>
          <ModalCloseButton />
          <FormControl px={6}>
            <FormLabel>Action Type</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="teal"
                rightIcon={<ChevronDownIcon />}
              >
                {actionType}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => handleActionType("Transfer Ownership")}
                >
                  Transfer Ownership
                </MenuItem>
                <MenuItem onClick={() => handleActionType("Upgrade")}>
                  Upgrade
                </MenuItem>
              </MenuList>
            </Menu>
          </FormControl>
          {actionType === "Transfer Ownership" && (
            <OwnershipForm
              chainName={chainName}
              daoAddress={daoAddress}
              onClose={onClose}
              isOwner
            />
          )}
          {actionType === "Upgrade" && (
            <>
              <FormControl px={6} mt={4}>
                <FormLabel>Upgrade Type</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="orange"
                    rightIcon={<ChevronDownIcon />}
                  >
                    {upgradeType}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleUpgradeType("Dividend")}>
                      Dividend
                    </MenuItem>
                    <MenuItem onClick={() => handleUpgradeType("Vault")}>
                      Vault
                    </MenuItem>
                  </MenuList>
                </Menu>
              </FormControl>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default OwnershipModal;
