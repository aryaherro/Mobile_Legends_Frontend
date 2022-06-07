import { ChakraProvider, theme } from "@chakra-ui/react";
import Nav from "./components/navbar/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HeroList from "./pages/Hero/ListHero";
import RoleList from "./pages/Role/ListRole";
import AddRole from "./pages/Role/AddRole";
import EditRole from "./pages/Role/EditRole";
import AddHero from "./pages/Hero/AddHero";
import EditHero from "./pages/Hero/EditHero";

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<HeroList />} />
        <Route path="/role" element={<RoleList />} />
        <Route path="/role/add" element={<AddRole />} />
        <Route path="/role/:id" element={<EditRole />} />
        <Route path="/hero/add" element={<AddHero />} />
        <Route path="/hero/:id" element={<EditHero />} />
      </Routes>
    </ChakraProvider>
  </BrowserRouter>
);
