import { ListItem, UnorderedList } from "@chakra-ui/react";
import { formatEther } from "viem";
import { Address, useContractRead, useToken } from "wagmi";
import { CONTRACT_INFOS } from "../../abi/contracts";

interface OverviewProps {
  daoAddress: Address;
  daoName: string;
  tokenBalance: string;
  chainId: number;
}
function Overview({
  daoAddress,
  daoName,
  tokenBalance,
  chainId,
}: OverviewProps) {
  const contract = {
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    chainId,
  };
  const { data: totalSupply } = useContractRead({
    ...contract,
    functionName: "totalSupply",
    watch: true,
  });
  const { data: tokenData } = useToken(contract);

  return (
    <UnorderedList mt={6} fontSize="20px" spacing={2}>
      <ListItem>Organization Name: {daoName}</ListItem>
      <ListItem>Contract Address: {daoAddress}</ListItem>
      <ListItem>Token Name: {tokenData?.name}</ListItem>
      <ListItem>Token Symbol: {tokenData?.symbol}</ListItem>
      <ListItem>Total Supply: {formatEther(totalSupply || BigInt(0))}</ListItem>
      <ListItem>Your Balance: {tokenBalance}</ListItem>
    </UnorderedList>
  );
}

export default Overview;
