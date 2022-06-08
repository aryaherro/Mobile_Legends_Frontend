import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Flex,
  VStack,
  Divider,
  chakra,
  Grid,
  Avatar,
  GridItem,
  Container,
  Box,
  List,
  HStack,
  Text,
  Button,
  Stack,
  Center,
  Wrap,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ListHero = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [heroes, setHeroes] = useState([]);
  const [hero, setHero] = useState({
    id: "",
    name: "",
    image: "",
  });
  useEffect(() => {
    getHeroes();
  }, []);

  const getHeroes = async () => {
    const response = await axios.get("http://localhost:9000/hero/");
    setHeroes(response.data);
  };

  const deleteHero = async (id: string, name: string) => {
    await axios.delete(`http://localhost:9000/hero/${id}`);
    onClose();
    getHeroes();

    toast({
      title: `Hero "${name}" has been deleted`,
      status: "error",
      isClosable: true,
      position: "top-right",
      duration: 4000,
    });
  };

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
              Hero
            </chakra.h2>
            <Link to="/hero/add">
              <Button colorScheme="blue" size="md">
                Add New Hero
              </Button>
            </Link>
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex flexDirection={"column"}>
            <Text fontSize={"4xl"} fontWeight={"bold"}>
              {heroes.length}
            </Text>
            <Box fontSize={"xl"}>Heroes on Database</Box>
          </Flex>
        </GridItem>
      </Grid>
      <Divider mt={2} mb={2} />
      <Wrap spacing="10px" justify="center">
        {heroes.map((hero: any) => (
          <Box
            maxW={"300px"}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
            key={hero.id}
            borderWidth={"1px"}
          >
            <Stack textAlign={"center"} align={"center"}>
              <Text
                fontSize={"xl"}
                fontWeight={500}
                color={"green.500"}
                rounded={"full"}
              >
                {hero.name}
              </Text>
              <Avatar
                src={hero.image_url}
                size={"2xl"}
                name={!hero.image_url ? hero.name : ""}
              />
            </Stack>

            <Box px={3} py={2}>
              <List spacing={3} h={"150px"}>
                {hero.roles.map((role: any) => (
                  <HStack justifyContent={"center"} key={role.id}>
                    <Avatar src={role.image_url} size={"sm"} />
                    <Text>{role.name}</Text>
                  </HStack>
                ))}
              </List>
              <Center>
                <HStack>
                  <Link to={`/hero/${hero.id}`}>
                    <Button colorScheme="yellow">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setHero({
                        id: hero.id,
                        name: hero.name,
                        image: hero.image_url,
                      });
                      onOpen();
                    }}
                    colorScheme="red"
                  >
                    Delete
                  </Button>
                </HStack>
              </Center>
            </Box>
          </Box>
        ))}
      </Wrap>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Hero
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Are you sure to delete</Text>
              <Center>
                <HStack>
                  <Avatar
                    size="md"
                    src={hero.image}
                    name={!hero.image ? hero.name : ""}
                  ></Avatar>
                  <Text fontSize="4xl">{hero.name}</Text>
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
                  deleteHero(hero.id, hero.name);
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
export default ListHero;
