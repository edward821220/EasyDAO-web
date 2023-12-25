import { useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import { useContractWrite } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import { CONTRACT_INFOS } from "../../abi/contracts";
import { useState } from "react";

interface Receiver {
  receiver: string;
  amount: BigInt;
}
interface UpgradeFormData {
  description: string;
  receivers: Receiver[];
}

interface UpgradeFormProps {
  chainName: string;
  daoAddress: `0x${string}`;
  onClose: () => void;
}

function UpgradeForm({ chainName, daoAddress, onClose }: UpgradeFormProps) {
  const [upgradeType, setUpgradeType] = useState("Ownership");
  const toast = useToast();
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm<UpgradeFormData>({
    defaultValues: {
      description: "",
      receivers: [
        {
          receiver: "",
          amount: BigInt(0),
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "receivers",
  });

  const { isLoading, write } = useContractWrite({
    address: daoAddress,
    abi: CONTRACT_INFOS.DaoFacet.abi,
    functionName: "createProposal",
    onSuccess: (data) => {
      toast({
        title: "Transaction succeeded",
        description: (
          <Link
            href={`https://${chainName.toLowerCase()}.etherscan.io/tx/${
              data?.hash
            }`}
            isExternal
          >
            Proposal Created <ExternalLinkIcon mx="2px" />
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
        description: "Proposal creation failed",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (formData: UpgradeFormData) => {
    if (isLoading) return;

    const data = encodeFunctionData({
      abi: CONTRACT_INFOS.DaoFacet.abi,
      functionName: "mintByProposal",
      args: [
        formData.receivers.map((receiver) => ({
          receiver: receiver.receiver as Address,
          amount: BigInt(Number(receiver.amount) * 10 ** 18),
        })),
      ],
    });
    write?.({
      args: [data, "Mint", formData.description],
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

  const handleSelect = (option: string) => {
    setUpgradeType(option);
  };

  return (
    <form key="UpgradeForm" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <FormControl>
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
              <MenuItem onClick={() => handleSelect("Ownership")}>
                Ownership
              </MenuItem>
              <MenuItem onClick={() => handleSelect("Dividend")}>
                Dividend
              </MenuItem>
              <MenuItem onClick={() => handleSelect("Vault")}>Vault</MenuItem>
            </MenuList>
          </Menu>
        </FormControl>
        <FormControl>
          <FormLabel mt={4}>Proposal Description</FormLabel>
          <Input
            required
            mb={1}
            placeholder={"Proposal Description"}
            {...register("description")}
          />
          <FormLabel mt={4}>Receivers</FormLabel>
          {fields.map((field, index) => {
            const error = errors?.receivers?.[index]?.receiver?.message;
            return (
              <Box mb={2} key={field.id}>
                <Input
                  required
                  mb={1}
                  placeholder={`Receiver ${index + 1} Address`}
                  {...register(`receivers.${index}.receiver`, {
                    pattern: {
                      value: /^0x[a-fA-F0-9]{40}$/,
                      message: "Invalid address",
                    },
                  })}
                />
                {error && (
                  <Text mb={1} color="red">
                    {error}
                  </Text>
                )}
                <Input
                  min={1}
                  required
                  placeholder={`Receiver ${index + 1} Amount`}
                  type="number"
                  {...register(`receivers.${index}.amount`)}
                />
              </Box>
            );
          })}
        </FormControl>
        <Flex mt="4" alignItems="center" justifyContent="space-around">
          <Flex
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              if (fields.length >= 50) return;
              append({ receiver: "", amount: BigInt(0) });
            }}
          >
            <AddIcon mr="1" />
            <Text>Add Receiver</Text>
          </Flex>
          <Flex
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              if (fields.length <= 1) return;
              remove(fields.length - 1);
            }}
          >
            <MinusIcon mr="1" cursor="pointer" />
            <Text>Remove Receiver</Text>
          </Flex>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button type="submit" colorScheme="blue" isLoading={isLoading} mr={3}>
          Submit
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </form>
  );
}

export default UpgradeForm;
