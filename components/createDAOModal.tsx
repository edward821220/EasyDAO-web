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
} from "@chakra-ui/react";
import { useRef } from "react";

interface CreateDAOModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CreateDAOModal(props: CreateDAOModalProps) {
  const { isOpen, onClose } = props;
  const initialRef = useRef(null);

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your DAO</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>DAO Name</FormLabel>
              <Input ref={initialRef} placeholder="DAO Name" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Token Name</FormLabel>
              <Input placeholder="Token Name" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
