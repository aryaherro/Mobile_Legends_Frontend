import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Select } from "chakra-react-select";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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

function EditHero() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [hero, setHero] = useState({
    name: "",
    release: "2016",
    file: "",
    preview: "",
    roles: [],
    deleted_image: false,
  });
  const [allRoles, setAllRoles] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  async function getHero() {
    const hero = await axios.get(`http://localhost:9000/hero/${id}`);
    setHero({
      name: hero.data.name,
      release: hero.data.release,
      file: hero.data.image,
      preview: hero.data.image_url ? hero.data.image_url : "",
      roles: hero.data.roles.map((role: { id: string; name: string }) => ({
        value: role.id,
        label: role.name,
      })),
      deleted_image: false,
    });
  }

  async function getRoles() {
    const response = await axios.get("http://localhost:9000/role/");
    setAllRoles(
      response.data.map((role: { id: string; name: string }) => ({
        value: role.id,
        label: role.name,
      }))
    );
  }

  useEffect(() => {
    if (allRoles.length === 0) {
      getRoles();
      getHero();
    }
  }, []);

  const loadImage = (e: any) => {
    try {
      const image = e.target.files[0];
      setHero({ ...hero, file: image, preview: URL.createObjectURL(image) });
    } catch (error) {}
  };

  const saveHero = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", hero.file);
    formData.append("name", hero.name);
    formData.append("release", hero.release);
    formData.append("roles", JSON.stringify(hero.roles));
    formData.append("deleted_image", hero.deleted_image.toString());
    try {
      await axios.patch(`http://localhost:9000/hero/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      toast({
        title: `Hero "${hero.name}" has been Edited`,
        status: "info",
        isClosable: true,
        position: "top-right",
        duration: 4000,
      });
      navigate("/hero");
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
          Add hero
        </Heading>
        <FormControl id="picture" isRequired>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center w="full">
              <Avatar
                size="2xl"
                src={hero.preview}
                name={hero.preview === "" ? hero.name : ""}
              >
                {hero.preview !== "" ? (
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={async () => {
                      setHero({
                        ...hero,
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
            defaultValue={hero.name}
            onChange={(e) => setHero({ ...hero, name: e.target.value })}
          />
        </FormControl>
        <FormControl id="release" isRequired>
          <FormLabel>release</FormLabel>
          <NumberInput
            min={2016}
            defaultValue={hero.release}
            onChange={(valueString) =>
              setHero({ ...hero, release: valueString })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        {hero.roles ? (
          <Select
            closeMenuOnSelect={hero.roles.length >= 2 ? true : false}
            menuPlacement="auto"
            isMulti
            options={allRoles}
            placeholder="Select roles"
            isOptionDisabled={() => hero.roles.length >= 3}
            onChange={(o: any) => {
              setHero({
                ...hero,
                roles: o,
              });
            }}
            value={hero.roles!}
          />
        ) : (
          ""
        )}

        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => navigate("/hero")}
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
            onClick={saveHero}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default EditHero;
