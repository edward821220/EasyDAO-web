import { ListItem, UnorderedList } from "@chakra-ui/react";
import { Address, useBalance, useContractRead, useToken } from "wagmi";
import { CONTRACT_INFOS } from "../../abi/contracts";

interface OverviewProps {
  daoAddress: Address;
  daoName: string;
  account: Address;
  chainId: number;
}
function Overview({ daoAddress, daoName, account, chainId }: OverviewProps) {
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
  const { data: tokenBalance } = useBalance({
    address: account,
    token: contract.address,
    chainId: contract.chainId,
    watch: true,
  });
  return (
    <UnorderedList mt={6} fontSize="20px" spacing={2}>
      <ListItem>Organization Name: {daoName}</ListItem>
      <ListItem>Contract Address: {daoAddress}</ListItem>
      <ListItem>Token Name: {tokenData?.name}</ListItem>
      <ListItem>Token Symbol: {tokenData?.symbol}</ListItem>
      <ListItem>Total Supply: {Number(totalSupply) / 10 ** 18}</ListItem>
      <ListItem>Your Balance: {tokenBalance?.formatted}</ListItem>
    </UnorderedList>
  );
}

export default Overview;
