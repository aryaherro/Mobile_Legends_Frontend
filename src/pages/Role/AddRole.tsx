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
  Tooltip,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { FiFile } from "react-icons/fi";

function AddRole() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [role, setRole] = useState({
    name: "",
    file: "",
    preview: "",
  });
  const navigate = useNavigate();
  const toast = useToast();

  const loadImage = (e: any) => {
    const image = e.target.files[0];
    setRole({ ...role, file: image, preview: URL.createObjectURL(image) });
  };
  const saveRole = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", role.file);
    formData.append("name", role.name);
    try {
      await axios.post("http://localhost:9000/role", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      toast({
        title: `Role "${role.name}" has been added`,
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
                src={role.preview}
                name={role.preview === "" ? role.name : ""}
              >
                {role.preview !== "" ? (
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={() =>
                      setRole({
                        ...role,
                        preview: "",
                        file: "",
                      })
                    }
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
            required={true}
            placeholder="Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
          />
        </FormControl>
        <Stack
          spacing={6}
          direction={["column", "row"]}
          justify={"space-between"}
        >
          <Button
            bg={"red.400"}
            color={"white"}
            w="sm"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => navigate("/role")}
          >
            Cancel
          </Button>
          <Tooltip
            hasArrow
            label="Nama Role tidak boleh kosong"
            shouldWrapChildren
            isDisabled={role.name !== ""}
          >
            <Button
              isDisabled={role.name === ""}
              bg={"blue.400"}
              color={"white"}
              w="unset"
              _hover={{
                bg: "blue.500",
              }}
              onClick={saveRole}
            >
              Submit
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default AddRole;
