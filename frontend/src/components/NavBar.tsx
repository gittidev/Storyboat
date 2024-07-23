import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { styled,  useTheme,  Theme,  CSSObject } from "@mui/material/styles";
import {
  FolderOpenRoundedIcon,
  AddReactionRoundedIcon,
  LightbulbIcon,
  MediationRoundedIcon,
  DriveFileRenameOutlineRoundedIcon,
  Face5Icon,
  BatchPredictionIcon,
  SettingsRoundedIcon,
  SailingRoundedIcon,
  AccountCircleIcon
} from "./Icons";

import {
  Box,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemButton,
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "../assets/logo.png";


// 코드 작성 영역 ---------------------------------------------------------------------
const drawerWidth = 220;

const StyledLink = styled(RouterLink)`
  color: black;
  text-decoration: none;
  width: 100%;
`;

const StyledBox = styled(Box)`
  width : 100%;
  height : 100%
`;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});


const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

//Drawer 메인 헤더
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));





//Drawer 설정
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));



//실제 렌더링 관련 영역
export default function NavBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);


  const toggleDrawer = () => {
    setOpen(!open);
  };



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //렌더링 영역
  return (
    //상단 푸른색 툴바 영역
    <Box sx={{ display: "flex" , margin:'0px'}}>
      {/* 간격 설정용 */}
      {/* <CssBaseline /> */}

      {/* duffuTdmfEo  */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
        <StyledLink to="/">  
            <ListItem disablePadding >
                <ListItemButton>
                  <ListItemIcon>
                  <img src={Logo} width={25} alt="Logo" />
                  </ListItemIcon>
                  <ListItemText 
                      primary="StoryBoat" 
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: '24px',
                        fontStyle: 'italic',
                        fontWeight: 900, 
                        lineHeight: '36px', 
                      }}/>
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon  /> : <ChevronRightIcon />}
        </IconButton>
        
        </DrawerHeader>

        <Divider /> {/* 나만의 공간 */}
        <List>
        <StyledLink to="/main/mystory">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FolderOpenRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="나만의 스토리" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/main/mychar">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AddReactionRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="나만의 캐릭터" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/main/myidea">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <LightbulbIcon />
                  </ListItemIcon>
                  <ListItemText primary="나만의 아이디어" />
                </ListItemButton>
              </ListItem>
          </StyledLink>  
        </List>

        <Divider /> {/* 팀공간 */}
       
        <List>
        <StyledLink to="/main/storybox">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                      <MediationRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Story Box" />
                </ListItemButton>
              </ListItem>
          </StyledLink>

          <StyledLink to="/main/storyedit">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DriveFileRenameOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Story 보관소" />
                </ListItemButton>
              </ListItem>
          </StyledLink>

          <StyledLink to="/main/charbox">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Face5Icon />
                  </ListItemIcon>
                  <ListItemText primary="캐릭터 보관소" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/main/ideabox">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <BatchPredictionIcon />
                  </ListItemIcon>
                  <ListItemText primary="아이디어 보관소" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/main/studio">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <SettingsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="스튜디오 설정" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
        </List>
        <Divider />
        <List>{/* 팀찾기 */}
        <StyledLink to="/main/findteam">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <SailingRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="팀 찾기" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
        </List>
        <Divider />
            <ListItem sx={{ height :'auto'}}/>
        <Divider />

        <StyledLink to="/main/profile">  
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="내 정보" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
      </Drawer>
      
    </Box>
  );
}
                                                                                                                                                                               