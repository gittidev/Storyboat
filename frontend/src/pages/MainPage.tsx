import NavBar from "../components/Commons/NavBar.tsx";
import { Outlet } from "react-router-dom";
import TopBar from "../components/Commons/TopBar.tsx";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)`
  height: "100vh";
  overflow: "hidden";
  display: "flex";
  flex-direction: "column";
`;

const MainPage = () => {



  
  return (
    <Box sx={{ display: "flex", height: "100vh", width:'100%' }}>
      <NavBar />
      <StyledBox sx={{ flexGrow: 1 }}>
        <TopBar />
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "auto", // Add this line to make the container scrollable
            height: "calc(100vh - 64px)", // Adjust this to match the height of your TopBar
            padding: 2,
          }}
        >
          <Outlet />
        </Container>
      </StyledBox>
    </Box>
  );
};

export default MainPage;
