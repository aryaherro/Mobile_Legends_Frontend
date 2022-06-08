import { useRef, useEffect, useState } from "react";
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
  IconButton,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  Icon,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { FiFile } from "react-icons/fi";
import { Select } from "chakra-react-select";

function AddHero() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [hero, setHero] = useState({
    name: "",
    release: "2016",
    file: "",
    preview: "",
    roles: [],
  });
  const [allRoles, setAllRoles] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    getAllRoles();
  }, []);
  const getAllRoles = async () => {
    const response = await axios.get("http://localhost:9000/role/");
    setAllRoles(
      response.data.map((role: { id: string; name: string }) => ({
        value: role.id,
        label: role.name,
      }))
    );
  };

  const loadImage = (e: any) => {
    const image = e.target.files[0];
    setHero({ ...hero, file: image, preview: URL.createObjectURL(image) });
  };

  const saveHero = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", hero.file);
    formData.append("name", hero.name);
    formData.append("release", hero.release);
    formData.append("roles", JSON.stringify(hero.roles));
    try {
      await axios.post("http://localhost:9000/hero", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      toast({
        title: `Hero "${hero.name}" has been added`,
        status: "success",
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
          Add Hero
        </Heading>
        <FormControl id="userName">
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
                    onClick={() => {
                      setHero({ ...hero, preview: "", file: "" });
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
            required={true}
            placeholder="Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={hero.name}
            onChange={(e: any) => setHero({ ...hero, name: e.target.value })}
          />
        </FormControl>
        <FormControl id="release" isRequired>
          <FormLabel>release</FormLabel>
          <NumberInput
            defaultValue={2016}
            min={2016}
            value={hero.release}
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
        <Select
          closeMenuOnSelect={hero.roles.length >= 2 ? true : false}
          menuPlacement="auto"
          isMulti
          options={allRoles}
          placeholder="Select roles"
          isOptionDisabled={() => hero.roles.length >= 3}
          onChange={(o: any) =>
            setHero({ ...hero, roles: o.map((o: any) => o.value) })
          }
        />
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
          <Tooltip
            hasArrow
            label="Nama Hero tidak boleh kosong"
            shouldWrapChildren
            isDisabled={hero.name !== ""}
          >
            <Button
              isDisabled={hero.name === ""}
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
          </Tooltip>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default AddHero;
