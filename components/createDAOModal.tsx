import { useForm, useFieldArray } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
import { AddIcon, ExternalLinkIcon, MinusIcon } from "@chakra-ui/icons";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_INFOS } from "../abi/contracts";

interface FounderInfo {
  founder: string;
  initialBalance: BigInt;
}
interface FormData {
  DAOName: string;
  tokenName: string;
  tokenSymbol: string;
  founders: FounderInfo[];
}
interface CreateDAOModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CreateDAOModal(props: CreateDAOModalProps) {
  const { isOpen, onClose } = props;
  const { register, watch, control, handleSubmit, formState } =
    useForm<FormData>({
      defaultValues: {
        DAOName: "",
        tokenName: "",
        tokenSymbol: "",
        founders: [
          { founder: "", initialBalance: BigInt(0) },
          { founder: "", initialBalance: BigInt(0) },
          { founder: "", initialBalance: BigInt(0) },
        ],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "founders",
  });
  const watchDAOName = watch("DAOName");
  const watchTokenName = watch("tokenName");
  const watchTokenSymbol = watch("tokenSymbol");
  const watchFounders = watch("founders");
  const { config } = usePrepareContractWrite({
    address: CONTRACT_INFOS.DiamondFactory.address,
    abi: CONTRACT_INFOS.DiamondFactory.abi,
    functionName: "createDAODiamond",
    args: [
      watchDAOName,
      watchFounders,
      watchTokenName,
      watchTokenSymbol,
      CONTRACT_INFOS.DiamondCutFacet.address,
      CONTRACT_INFOS.DiamondLoupeFacet.address,
      CONTRACT_INFOS.DaoFacet.address,
      CONTRACT_INFOS.DaoInit.address,
    ],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const toast = useToast();

  const onSubmit = () => {
    if (isLoading) return;
    write?.();
    toast({
      title: "Transaction submitted",
      description: isSuccess ? (
        <Link href={`https://etherscan.io/tx/${data?.hash}`} isExternal>
          Dao Created <ExternalLinkIcon mx="2px" />
        </Link>
      ) : (
        "DAO creation failed"
      ),
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your DAO</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={4}>
              <FormControl>
                <FormLabel>DAO Name</FormLabel>
                <Input placeholder="DAO Name" {...register("DAOName")} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Name</FormLabel>
                <Input placeholder="Token Name" {...register("tokenName")} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Symbol</FormLabel>
                <Input
                  placeholder="Token Symbol"
                  {...register("tokenSymbol")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Founders Info (Address & Initial Balance)</FormLabel>
                {fields.map((field, index) => (
                  <Box mb={2} key={field.id}>
                    <Input
                      mb={1}
                      placeholder={`Founder ${index + 1} Address`}
                      {...register(`founders.${index}.founder`)}
                    />
                    <Input
                      placeholder={`Founder ${index + 1} Initial Balance`}
                      type="number"
                      {...register(`founders.${index}.initialBalance`)}
                    />
                  </Box>
                ))}
              </FormControl>
              <Flex mt="4" alignItems="center" justifyContent="space-around">
                <Flex
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => {
                    if (fields.length >= 10) return;
                    append({ founder: "", initialBalance: BigInt(0) });
                  }}
                >
                  <AddIcon mr="1" />
                  <Text>Add Founder</Text>
                </Flex>
                <Flex
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => {
                    if (fields.length <= 3) return;
                    remove(fields.length - 1);
                  }}
                >
                  <MinusIcon mr="1" cursor="pointer" />
                  <Text>Remove Founder</Text>
                </Flex>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                mr={3}
              >
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
