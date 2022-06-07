import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  Icon,
  IconButton,
  Center,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { FiFile } from "react-icons/fi";

function AddRole() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const loadImage = (e: any) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };
  const saveRole = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    try {
      await axios.post("http://localhost:9000/role", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      toast({
        title: `Role "${name}" has been added`,
        status: "success",
        isClosable: true,
        position: "top-right",
        duration: 4000,
      });
      navigate("/role");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Add Role
        </Heading>
        <FormControl id="picture" isRequired>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center w="full">
              <Avatar
                size="2xl"
                src={preview}
                name={preview === "" ? name : ""}
              >
                {preview !== "" ? (
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={() => {
                      setPreview("");
                      setFile("");
                    }}
                  />
                ) : null}
              </Avatar>
            </Center>
            <Center w="full">
              <InputGroup>
                <Button
                  leftIcon={<Icon as={FiFile} />}
                  onClick={() => fileRef?.current?.click()}
                >
                  Upload
                </Button>
                <Input
                  ref={fileRef}
                  type={"file"}
                  onChange={loadImage}
                  accept={"image/*"}
                  hidden
                  multiple={false}
                ></Input>
              </InputGroup>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="name" isRequired>
          <FormLabel>name</FormLabel>
          <Input
            placeholder="Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => navigate("/role")}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={saveRole}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default AddRole;
