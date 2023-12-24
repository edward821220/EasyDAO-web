import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import MintForm from "./mintFrom";

interface CreateDAOModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainName: string;
  daoAddress: `0x${string}`;
}
export function CreateProposalModal(props: CreateDAOModalProps) {
  const [proposalType, setProposalType] = useState("Mint");
  const { isOpen, onClose, chainName, daoAddress } = props;

  const handleSelect = (option: string) => {
    setProposalType(option);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Create Proposal</ModalHeader>
          <ModalCloseButton />
          <FormControl px={6}>
            <FormLabel>Proposal Type</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="teal"
                rightIcon={<ChevronDownIcon />}
              >
                {proposalType}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSelect("Mint")}>Mint</MenuItem>
                <MenuItem onClick={() => handleSelect("Upgrade")}>
                  Upgrade
                </MenuItem>
              </MenuList>
            </Menu>
          </FormControl>
          {proposalType === "Mint" && (
            <MintForm
              chainName={chainName}
              daoAddress={daoAddress}
              onClose={onClose}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
