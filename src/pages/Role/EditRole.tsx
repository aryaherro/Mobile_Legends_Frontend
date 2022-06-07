import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function EditRole() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [role, setRole] = useState({
    name: "",
    file: "",
    preview: "",
    deleted_image: false,
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  async function getRole() {
    const role = await axios.get(`http://localhost:9000/role/${id}`);
    setRole({
      name: role.data.name,
      file: role.data.image,
      preview: role.data.image_url,
      deleted_image: false,
    });
  }
  useEffect(() => {
    if (!role.name) getRole();
  });

  const loadImage = (e: any) => {
    try {
      const image = e.target.files[0];
      setRole({
        ...role,
        file: image,
        preview: URL.createObjectURL(image),
        deleted_image: false,
      });
    } catch (error) {}
  };
  const saveRole = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    if (role.file) formData.append("file", role.file);
    formData.append("name", role.name);
    formData.append("deleted_image", role.deleted_image.toString());
    try {
      await axios.patch(`http://localhost:9000/role/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      toast({
        title: `Role "${role.name}" has been Edited`,
        status: "info",
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
                    onClick={async () => {
                      setRole({
                        ...role,
                        preview: "",
                        file: "",
                        deleted_image: true,
                      });
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
            defaultValue={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
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

export default EditRole;
