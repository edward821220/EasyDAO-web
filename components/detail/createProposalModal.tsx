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
import { Address } from "viem";
import MintForm from "./form/mintForm";
import OwnershipForm from "./form/ownershipForm";
import OtherForm from "./form/otherForm";
import DividendForm from "./form/dividendForm";
import VaultForm from "./form/vaultForm";
import { CONTRACT_INFOS } from "../../abi/contracts";
import DowngradeForm from "./form/downgradeForm";

type FacetType = "Ownership" | "Dividend" | "Vault";
interface CreateDAOModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainName: string;
  daoAddress: Address;
  facetAddresses: readonly Address[];
}
export default function CreateProposalModal(props: CreateDAOModalProps) {
  const { isOpen, onClose, chainName, daoAddress, facetAddresses } = props;
  const [proposalType, setProposalType] = useState("Mint");
  const [upgradeType, setUpgradeType] = useState<FacetType | "">("");
  const [downgradeType, setDowngradeType] = useState<FacetType | "">("");

  const handleProposalType = (option: string) => {
    setProposalType(option);
  };

  const handleUpgradeType = (option: FacetType) => {
    setUpgradeType(option);
  };
  const handleDowngradeType = (option: FacetType) => {
    setDowngradeType(option);
  };

  const hasOwnershipFacet = facetAddresses?.includes(
    CONTRACT_INFOS.OwnershipFacet.address
  );
  const hasDividendFacet = facetAddresses?.includes(
    CONTRACT_INFOS.DividendFacet.address
  );
  const hasVaultFacet = facetAddresses?.includes(
    CONTRACT_INFOS.VaultFacet.address
  );
  const hasSomeFacets = hasOwnershipFacet || hasDividendFacet || hasVaultFacet;
  const hasAllFacets = hasOwnershipFacet && hasDividendFacet && hasVaultFacet;

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
                <MenuItem onClick={() => handleProposalType("Mint")}>
                  Mint
                </MenuItem>
                {!hasAllFacets && (
                  <MenuItem onClick={() => handleProposalType("Upgrade")}>
                    Upgrade
                  </MenuItem>
                )}
                {hasSomeFacets && (
                  <MenuItem onClick={() => handleProposalType("Downgrade")}>
                    Downgrade
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleProposalType("Other")}>
                  Other
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
          {!hasAllFacets && proposalType === "Upgrade" && (
            <>
              <FormControl px={6} mt={4}>
                <FormLabel>Upgrade Type</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="orange"
                    rightIcon={<ChevronDownIcon />}
                  >
                    {upgradeType || "Select Upgrade Type"}
                  </MenuButton>
                  <MenuList>
                    {!hasOwnershipFacet && (
                      <MenuItem onClick={() => handleUpgradeType("Ownership")}>
                        Ownership
                      </MenuItem>
                    )}
                    {!hasDividendFacet && (
                      <MenuItem onClick={() => handleUpgradeType("Dividend")}>
                        Dividend
                      </MenuItem>
                    )}
                    {!hasVaultFacet && (
                      <MenuItem onClick={() => handleUpgradeType("Vault")}>
                        Vault
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </FormControl>
              {upgradeType === "Ownership" && (
                <OwnershipForm
                  chainName={chainName}
                  daoAddress={daoAddress}
                  onClose={onClose}
                />
              )}
              {upgradeType === "Dividend" && (
                <DividendForm
                  chainName={chainName}
                  daoAddress={daoAddress}
                  onClose={onClose}
                />
              )}
              {upgradeType === "Vault" && (
                <VaultForm
                  chainName={chainName}
                  daoAddress={daoAddress}
                  onClose={onClose}
                />
              )}
            </>
          )}
          {hasSomeFacets && proposalType === "Downgrade" && (
            <>
              <FormControl px={6} mt={4}>
                <FormLabel>Downgrade Type</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="orange"
                    rightIcon={<ChevronDownIcon />}
                  >
                    {downgradeType || "Select Downgrade Type"}
                  </MenuButton>
                  <MenuList>
                    {hasOwnershipFacet && (
                      <MenuItem
                        onClick={() => handleDowngradeType("Ownership")}
                      >
                        Ownership
                      </MenuItem>
                    )}
                    {hasDividendFacet && (
                      <MenuItem onClick={() => handleDowngradeType("Dividend")}>
                        Dividend
                      </MenuItem>
                    )}
                    {hasVaultFacet && (
                      <MenuItem onClick={() => handleDowngradeType("Vault")}>
                        Vault
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </FormControl>
              {downgradeType && (
                <DowngradeForm
                  chainName={chainName}
                  daoAddress={daoAddress}
                  onClose={onClose}
                  downgradeType={downgradeType}
                />
              )}
            </>
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
