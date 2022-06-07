import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Box,
  VStack,
  Button,
  Divider,
  chakra,
  Grid,
  GridItem,
  Container,
  Flex,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Avatar,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ListRole = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [roles, setRoles] = useState([]);
  const toast = useToast();
  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const response = await axios.get("http://localhost:9000/role/");
    setRoles(response.data);
  };
  const deleteRole = async (id: string, name: string) => {
    await axios.delete(`http://localhost:9000/role/${id}`);
    onClose();
    getRoles();

    toast({
      title: `Role "${name}" has been deleted`,
      status: "error",
      isClosable: true,
      position: "top-right",
      duration: 4000,
    });
  };

  const [role, setRole] = useState({
    id: "",
    name: "",
    image: "",
  });

  return (
    <Box as={Container} maxW="container.lg" mt={4} p={4}>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        <GridItem colSpan={{ base: 1, sm: 2, md: 1 }}>
          <VStack alignItems="flex-start" spacing="10px">
            <chakra.h2 fontSize="3xl" fontWeight="700">
              Role
            </chakra.h2>
            <Link to="/role/add">
              <Button colorScheme="blue" size="md">
                Add New Role
              </Button>
            </Link>
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex flexDirection={"column"}>
            <Text fontSize={"4xl"} fontWeight={"bold"}>
              {roles.length}
            </Text>
            <Box fontSize={"xl"}>Role on Database</Box>
          </Flex>
        </GridItem>
      </Grid>
      <Divider mt={2} mb={2} />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th textAlign={"center"}>id</Th>
              <Th textAlign={"center"}>image</Th>
              <Th textAlign={"center"}>name</Th>
              <Th textAlign={"center"}>action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {roles.map((role: any, i: number) => (
              <Tr key={role.id}>
                <Td textAlign={"center"}>{i + 1}</Td>
                <Td>
                  <Center>
                    <Avatar
                      size="xs"
                      src={role.image_url}
                      name={!role.image_url ? role.name : ""}
                    ></Avatar>
                  </Center>
                </Td>
                <Td>
                  <Center>{role.name}</Center>
                </Td>
                <Td>
                  <Center>
                    <HStack>
                      <Link to={`/role/${role.id}`}>
                        <Button size={"md"} colorScheme="yellow">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          setRole({
                            id: role.id,
                            name: role.name,
                            image: role.image_url,
                          });
                          onOpen();
                        }}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Center>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Role
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Are you sure to delete</Text>
              <Center>
                <HStack>
                  <Avatar size="md" src={role.image}></Avatar>
                  <Text fontSize="4xl">{role.name}</Text>
                </HStack>
              </Center>
              <Text>You can't undo this action afterwards.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteRole(role.id, role.name);
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
export default ListRole;
