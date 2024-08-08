import * as React from "react";
import { Link } from "react-router-dom";
import "../../assets/stylesheets/custom-scrollbar.css";
import { styled, Theme, CSSObject } from "@mui/material/styles";
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
  AccountCircleIcon,
  BorderColorRoundedIcon,
} from "./Icons";

import {
  Box,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "../../assets/logo.png";

import CustomButton from "./CustomButton";
import StudioSelected from "../StudioSetting/StudioSelected";
import useModal from "../../hooks/useModal";
import CustomModal from "./CustomModal";
import StudioForm from "../StudioSetting/StudioForm";

//메뉴 핸들러
//메뉴 핸들러
import LongMenu from "./LongMenu";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { accessTokenState } from "../../recoil/atoms/authAtom";
import { logout } from "../../apis/auth";

const drawerWidth = 220;

const StyledLink = styled(Link)`
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
  width: `calc(${theme.spacing(8)})`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)})`,

  },
});

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

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  fontWeight: 'bold',
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
  },
}));

const CustomListItem = styled(ListItem)(() => ({
  fontWeight: 'bold',
  "&:hover": {
    background: 'linear-gradient(to left, #f2ffe4, #cce8ff)',
  },
}));

const sections = [
  {
    title: "나만의 공간",
    links: [
      { to: "/storyboat/mystory", text: "나만의 스토리", icon: <FolderOpenRoundedIcon /> },
      { to: "/storyboat/mystoryedit", text: "내 스토리 집필하기", icon: <BorderColorRoundedIcon /> },
      { to: "/storyboat/mychar", text: "나만의 캐릭터", icon: <AddReactionRoundedIcon /> },
      { to: "/storyboat/myidea", text: "나만의 아이디어", icon: <LightbulbIcon /> },
    ],
  },
  {
    title: "팀공간",
    links: [
      { to: "/storyboat/storybox", text: "Story Box", icon: <MediationRoundedIcon /> },
      { to: "/storyboat/storyedit", text: "Story 집필하기", icon: <DriveFileRenameOutlineRoundedIcon /> },
      { to: "/storyboat/charbox", text: "캐릭터 보관소", icon: <Face5Icon /> },
      { to: "/storyboat/ideabox", text: "아이디어 보관소", icon: <BatchPredictionIcon /> },
      { to: "/storyboat/studios", text: "스튜디오 설정", icon: <SettingsRoundedIcon /> },
    ],
  },
  {
    title: "팀찾기",
    links: [{ to: "/storyboat/invitations", text: "팀 찾기", icon: <SailingRoundedIcon /> }],
  },
];

//네브바
export default function NavBar() {
  const [open, setOpen] = React.useState(true);
  // const setRefreshToken = useSetRecoilState(refreshTokenState)
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { open: isModalOpen, handleOpen, handleClose } = useModal();

  const menuOptions = [
    {label : '로그아웃', value :'logout', color : 'red',  }
  ];
  
  const token = useRecoilValue(accessTokenState)
  
  const handleMenuClick = async (value: string) => {
    switch (value) {
      case 'logout':
        await logout(token); // 로그아웃 함수 호출
        // setRefreshToken(false); // 로그인 상태 업데이트
        navigate('/'); // 로그아웃 후 홈으로 이동
        break;
      default:
        console.log('알 수 없는 옵션 선택');
    }
  };

  return (
    <Box sx={{ display: "flex", margin: "0px" }}>
      <Drawer variant="permanent" open={open}>
        <CustomListItem disablePadding>
          <CustomListItemButton sx={{ p: "3px 12px" }}>
            <StyledLink to="/">
              <ListItemIcon>
                <img src={Logo} width={35} alt="Logo" />
              </ListItemIcon>
            </StyledLink>
            <Typography variant="h5" component={"span"} fontFamily={"Arial"} fontWeight={"bold"}>
              StoryBoat
            </Typography>
          </CustomListItemButton>
          <IconButton onClick={toggleDrawer}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
        </CustomListItem>

        <Divider />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px", padding: "0px 16px" }}>
          <CustomButton content= { open ? "스튜디오 생성하기" : "+"}  width={open ? "200px" : "40px"} onClick={handleOpen} />
          <StudioSelected listopen={open} />
        </div>

        <CustomModal open={isModalOpen} onClose={handleClose}>
          <StudioForm onClose={handleClose} />
        </CustomModal>

        {sections.map((section) => (
          <React.Fragment key={section.title}>
            <Divider />
            <List>
              {section.links.map((link) => (
                <StyledLink to={link.to} key={link.to}>
                  <CustomListItem disablePadding>
                    <CustomListItemButton sx={{ p: "3px 16px" }}>
                      <ListItemIcon>{link.icon}</ListItemIcon>
                      <ListItemText primary={link.text} />
                    </CustomListItemButton>
                  </CustomListItem>
                </StyledLink>
              ))}
            </List>
          </React.Fragment>
        ))}

        <Divider />
        <ListItem sx={{ height: "200px" }} />
        <Divider />
        <CustomListItem disablePadding>
          <StyledLink to="/storyboat/profile">
            <CustomListItemButton sx={{ p: "3px 16px" }}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="내 정보" />
            </CustomListItemButton>
          </StyledLink>
          <LongMenu options={menuOptions}  onClick={handleMenuClick}/>
        </CustomListItem>
      </Drawer>
    </Box>
  );
}
