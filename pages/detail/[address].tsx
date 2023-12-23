import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { CONTRACT_INFOS } from "../../abi/contracts";

export default function Detail() {
  const router = useRouter();
  const { address: account } = useAccount();
  const { address: daoAddress } = router.query;
  const { chain } = useNetwork();
  const { data: daoName } = useContractRead<
    typeof CONTRACT_INFOS.DaoFacet.abi,
    "daoName",
    string
  >({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "daoName",
    chainId: chain?.id || 11155111,
  });
  const { data: tokenName } = useContractRead<
    typeof CONTRACT_INFOS.DaoFacet.abi,
    "name",
    string
  >({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "name",
    chainId: chain?.id || 11155111,
  });
  const { data: tokenSymbol } = useContractRead<
    typeof CONTRACT_INFOS.DaoFacet.abi,
    "symbol",
    string
  >({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "symbol",
    chainId: chain?.id || 11155111,
  });
  const { data: totalSupply } = useContractRead<
    typeof CONTRACT_INFOS.DaoFacet.abi,
    "totalSupply",
    BigInt
  >({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "totalSupply",
    chainId: chain?.id || 11155111,
  });
  const { data: balance } = useContractRead<
    typeof CONTRACT_INFOS.DaoFacet.abi,
    "balanceOf",
    BigInt
  >({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "balanceOf",
    chainId: chain?.id || 11155111,
    args: [account],
    watch: true,
  });

  return (
    <Box h="calc(100vh - 64px)" color="white" bgColor="#23272f">
      <Box maxW="1280px" m="0 auto" py="50px" px="20px">
        <Box>{daoName}</Box>
        <Box>{daoAddress}</Box>
        <Box>{tokenName}</Box>
        <Box>{tokenSymbol}</Box>
        <Box>{String(totalSupply)}</Box>
        <Box>{String(balance)}</Box>
      </Box>
    </Box>
  );
}
