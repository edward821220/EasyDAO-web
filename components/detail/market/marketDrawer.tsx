import {
  Box,
  Text,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Address } from "viem";
import { useToken } from "wagmi";
import AuctionModal from "./auctionModal";
import AuctionsList from "./auctionsList";

interface MarketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  chainName: string;
  account: Address;
  daoAddress: Address;
}
function MarketDrawer(props: MarketDrawerProps) {
  const { isOpen, onClose, chainId, chainName, account, daoAddress } = props;
  const {
    isOpen: isOpenAuction,
    onOpen: onOpenAuction,
    onClose: onCloseAuction,
  } = useDisclosure();

  const { data: tokenData } = useToken({
    chainId,
    address: daoAddress,
  });

  return (
    <>
      <Drawer
        variant="bottom"
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
      >
        <DrawerOverlay />
        <DrawerContent height="calc(100vh - 64px)">
          <DrawerCloseButton />
          <DrawerHeader>
            {tokenData?.name}({tokenData?.symbol}) Market
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <Flex gap={4} alignItems="center">
                <Text fontSize="20px">Auction</Text>
                <Button colorScheme="teal" onClick={onOpenAuction}>
                  Start Auction
                </Button>
              </Flex>
              <AuctionsList
                chainId={chainId}
                chainName={chainName}
                account={account}
                daoAddress={daoAddress}
              />
            </Box>
            <Box>
              <Flex mt={10} gap={4} alignItems="center">
                <Text fontSize="20px">Fixed Price</Text>
                <Button colorScheme="teal" onClick={() => {}}>
                  Sell at Fixed Price
                </Button>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AuctionModal
        isOpen={isOpenAuction}
        onClose={onCloseAuction}
        chainId={chainId}
        chainName={chainName}
        account={account}
        daoAddress={daoAddress}
      />
    </>
  );
}

export default MarketDrawer;
