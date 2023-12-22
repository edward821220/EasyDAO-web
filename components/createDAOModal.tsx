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
import { useContractWrite } from "wagmi";
import { CONTRACT_INFOS } from "../abi/contracts";

interface FounderInfo {
  founder: string;
  shares: BigInt;
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
  const { register, control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      DAOName: "",
      tokenName: "",
      tokenSymbol: "",
      founders: [
        { founder: "", shares: BigInt(0) },
        { founder: "", shares: BigInt(0) },
        { founder: "", shares: BigInt(0) },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "founders",
  });
  const { isLoading, write } = useContractWrite({
    address: CONTRACT_INFOS.DiamondFactory.address,
    abi: CONTRACT_INFOS.DiamondFactory.abi,
    functionName: "createDAODiamond",
    onSuccess: (data) => {
      toast({
        title: "Transaction succeeded",
        description: (
          <Link href={`https://etherscan.io/tx/${data?.hash}`} isExternal>
            Dao Created <ExternalLinkIcon mx="2px" />
          </Link>
        ),
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Transaction failed",
        description: "DAO creation failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });
  const toast = useToast();

  const onSubmit = (formData: FormData) => {
    if (isLoading) return;
    write?.({
      args: [
        formData.DAOName,
        formData.founders.map((founder) => ({
          ...founder,
          shares: BigInt(Number(founder.shares) * 10 ** 18),
        })),
        formData.tokenName,
        formData.tokenSymbol,
        CONTRACT_INFOS.DiamondCutFacet.address,
        CONTRACT_INFOS.DiamondLoupeFacet.address,
        CONTRACT_INFOS.DaoFacet.address,
        CONTRACT_INFOS.DaoInit.address,
      ],
    });
    toast({
      title: "Transaction submitted",
      description: "Please wait for transaction to be confirmed",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    onClose();
    reset();
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
                <Input
                  required
                  placeholder="DAO Name"
                  {...register("DAOName")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Name</FormLabel>
                <Input
                  required
                  placeholder="Token Name"
                  {...register("tokenName")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Symbol</FormLabel>
                <Input
                  required
                  placeholder="Token Symbol"
                  {...register("tokenSymbol")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Founders Info (Address & Initial Balance)</FormLabel>
                {fields.map((field, index) => (
                  <Box mb={2} key={field.id}>
                    <Input
                      required
                      mb={1}
                      placeholder={`Founder ${index + 1} Address`}
                      {...register(`founders.${index}.founder`)}
                    />
                    <Input
                      min={1}
                      required
                      placeholder={`Founder ${index + 1} Initial Balance`}
                      type="number"
                      {...register(`founders.${index}.shares`)}
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
                    append({ founder: "", shares: BigInt(0) });
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
