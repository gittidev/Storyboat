import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import "../assets/stylesheets/custom-scrollbar.css"
import { styled,  Theme,  CSSObject } from "@mui/material/styles";
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
  Typography
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "../assets/logo.png";
import LongMenu from "./LongMenu";

import SelectStudio from "./SelectStudio";
import { handleMenuClick } from "../utils/menuUtils";
import CustomButton from "./CustomButton";





// 코드 작성 영역 ---------------------------------------------------------------------
const drawerWidth = 220;

const StyledLink = styled(RouterLink)`
  color: black;
  text-decoration: none;
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


//프로필 longMenu용 옵션
const menuOptions = ['로그아웃'];


//실제 렌더링 navbar 영역
export default function NavBar() {
  const [open, setOpen] = React.useState(true);


  const toggleDrawer = () => {
    setOpen(!open);
  };


  //렌더링 영역
  return (
    //상단 푸른색 툴바 영역
    <Box sx={{ display: "flex" , margin:'0px'}} >

      {/* duffuTdmfEo  */}
      <Drawer variant="permanent" open={open}>

            <ListItem disablePadding >
                <ListItemButton sx={{p : '3px 16px' }}> 
                <StyledLink to="/">  
                  <ListItemIcon>
                  <img src={Logo} width={35} alt="Logo" />
                  </ListItemIcon>
                </StyledLink>

              <Typography variant="h5" component={'span'} fontFamily={'Arial'} fontWeight={'bold'} >
                    StoryBoat
              </Typography> 
                </ListItemButton>
                <IconButton onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon  /> : <ChevronRightIcon />}
              </IconButton>
              </ListItem>

        

        <Divider /> 

        {/* 참여중인 스튜디오 고르기 */}
        <div style={{display : 'flex' , flexDirection : 'column', alignItems:'center', marginTop :'10px'}}>
        <CustomButton content="스튜디오 생성하기" bgcolor="green" width="200px"/>
        <SelectStudio/>
        </div>

    
        <Divider /> {/* 나만의 공간 */}
        <List>
        <StyledLink to="/storyboat/mystory">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                    <FolderOpenRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="나만의 스토리" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/storyboat/mychar">  
            <ListItem disablePadding>
                <ListItemButton  sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                    <AddReactionRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="나만의 캐릭터" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/storyboat/myidea">  
            <ListItem disablePadding sx={{m:0}}>
                <ListItemButton  sx={{p : '3px 16px' }}>
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
        <StyledLink to="/storyboat/storybox">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                      <MediationRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Story Box" />
                </ListItemButton>
              </ListItem>
          </StyledLink>

          <StyledLink to="/storyboat/storyedit">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                    <DriveFileRenameOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Story 편집하기" />
                </ListItemButton>
              </ListItem>
          </StyledLink>

          <StyledLink to="/storyboat/charbox">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                    <Face5Icon />
                  </ListItemIcon>
                  <ListItemText primary="캐릭터 보관소" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/storyboat/ideabox">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                  <BatchPredictionIcon />
                  </ListItemIcon>
                  <ListItemText primary="아이디어 보관소" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
          <StyledLink to="/storyboat/studio">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                  <SettingsRoundedIcon />
                  </ListItemIcon >
                  <ListItemText primary="스튜디오 설정" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
        </List>
        <Divider />
        <List>{/* 팀찾기 */}
        <StyledLink to="/storyboat/findteam">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                  <SailingRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="팀 찾기" />
                </ListItemButton>
              </ListItem>
          </StyledLink>
        </List>
        <Divider />
            <ListItem sx={{ height :'200px'}}/>
        <Divider />

        <StyledLink to="/storyboat/profile">  
            <ListItem disablePadding>
                <ListItemButton sx={{p : '3px 16px' }}>
                  <ListItemIcon>
                  <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="내 정보" />
                  <LongMenu options={menuOptions} onClick={handleMenuClick} />
                </ListItemButton>
              </ListItem>
          </StyledLink>
      </Drawer>
      
    </Box>
  );
}
                                                                                                                                                                               