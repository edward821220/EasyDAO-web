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
import MintForm from "./mintForm";
import UpgradeForm from "./upgradeForm";
import OtherForm from "./otherForm";

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
                <MenuItem onClick={() => handleSelect("Other")}>Other</MenuItem>
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
          {proposalType === "Upgrade" && (
            <UpgradeForm
              chainName={chainName}
              daoAddress={daoAddress}
              onClose={onClose}
            />
          )}
          {proposalType === "Other" && (
            <OtherForm
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
