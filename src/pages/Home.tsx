import { Text, Link, VStack } from "@chakra-ui/react";
import { Logo } from "../Logo";

export default function Home() {
  return (
    <VStack spacing={8}>
      <Logo h="40vmin" pointerEvents="none" />
      <Text>
        Still learning{" "}
        <Link
          color="teal.500"
          fontSize="2xl"
          href="http://reactjs.org/"
          target="_blank"
        >
          React
        </Link>
        {", "}
        <Link
          color="teal.500"
          fontSize="2xl"
          href="http://chakra-ui.com/"
          target="_blank"
        >
          Chakra UI
        </Link>{" "}
        from{" "}
        <Link
          color="teal.500"
          fontSize="2xl"
          href="http://google.com/"
          target="_blank"
        >
          google's
        </Link>
      </Text>
    </VStack>
  );
}
