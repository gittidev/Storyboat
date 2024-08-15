import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
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
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { selectedStudioState } from "../../recoil/atoms/studioAtom";
import { useNavigate } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "../../assets/logo.png";

import CustomButton from "./CustomButton";
import StudioSelected from "../StudioSetting/StudioSelected";
import useModal from "../../hooks/useModal";
import CustomModal from "./CustomModal";
import StudioForm from "../StudioSetting/StudioForm";
import LongMenu from "./LongMenu";
import { accessTokenState } from "../../recoil/atoms/authAtom";
import { logout } from "../../apis/auth";
import {
  FolderOpenRoundedIcon,
  AddReactionRoundedIcon,
  LightbulbIcon,
  MediationRoundedIcon,
  Face5Icon,
  BatchPredictionIcon,
  SettingsRoundedIcon,
  SailingRoundedIcon,
  AccountCircleIcon,
} from "./Icons";

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
  fontWeight: "bold",
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
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(to left, #f2ffe4, #cce8ff)",
  },
}));

const sections = [
  {
    title: "나만의 공간",
    links: [
      { to: "/storyboat/mystory", text: "나만의 스토리", icon: <FolderOpenRoundedIcon />, tooltip: "개인 스토리를 관리하세요" },
      { to: "/storyboat/mychar", text: "나만의 캐릭터", icon: <AddReactionRoundedIcon />, tooltip: "개인 캐릭터를 만들고 관리하세요" },
      { to: "/storyboat/myidea", text: "나만의 아이디어", icon: <LightbulbIcon />, tooltip: "아이디어를 기록하고 발전시키세요" },
    ],
  },
  {
    title: "팀공간",
    links: [
      { to: "/storyboat/storybox", text: "Story Box", icon: <MediationRoundedIcon />, tooltip: "팀의 스토리를 공유하고 협업하세요" },
      { to: "/storyboat/charbox", text: "캐릭터 보관소", icon: <Face5Icon />, tooltip: "팀의 캐릭터를 관리하세요" },
      { to: "/storyboat/ideabox", text: "아이디어 보관소", icon: <BatchPredictionIcon />, tooltip: "팀의 아이디어를 공유하고 발전시키세요" },
      { to: "/storyboat/studios", text: "스튜디오 설정", icon: <SettingsRoundedIcon />, tooltip: "스튜디오 설정을 관리하세요" },
    ],
  },
  {
    title: "팀찾기",
    links: [{ to: "/storyboat/invitations", text: "팀 찾기", icon: <SailingRoundedIcon />, tooltip: "새로운 팀을 찾거나 초대를 관리하세요" }],
  },
];

export default function NavBar() {
  const [open, setOpen] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const selectedStudio = useRecoilValue(selectedStudioState);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { open: isModalOpen, handleOpen, handleClose } = useModal();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLinkClick = (link: string, requiresStudio: boolean) => {
    if (requiresStudio && selectedStudio === "") {
      setSnackbarOpen(true);
    } else {
      navigate(link);
    }
  };

  const menuOptions = [
    { label: "로그아웃", value: "logout", color: "red" },
  ];

  const token = useRecoilValue(accessTokenState);

  const handleMenuClick = async (value: string) => {
    switch (value) {
      case "logout":
        await logout(token);
        navigate("/");
        break;
      default:
        console.log("알 수 없는 옵션 선택");
    }
  };

  return (
    <Box sx={{ display: "flex", margin: "0px" }}>
      <Drawer variant="permanent" open={open}>
        <CustomListItem disablePadding>
          <CustomListItemButton sx={{ p: "3px 12px" }}>
          <Tooltip title="홈 화면으로 돌아가기" placement="right" arrow>
              <StyledLink to="/">
                <ListItemIcon>
                  <img src={Logo} width={35} alt="Logo" />
                </ListItemIcon>
              </StyledLink>
            </Tooltip>
            <Typography variant="h5" component={"span"} fontFamily={"Arial"} fontWeight={"bold"}>
              StoryBoat
            </Typography>
          </CustomListItemButton>
          <IconButton onClick={toggleDrawer}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
        </CustomListItem>

        <Divider />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px", padding: "0px 16px" }}>
          <Tooltip title="새로운 스튜디오를 만들어 팀 작업을 시작하세요" placement="right" arrow>
            <div> {/* Wrapper div for the Tooltip */}
              <CustomButton 
                content={open ? "스튜디오 생성하기" : "+"} 
                width={open ? "200px" : "40px"} 
                onClick={handleOpen} 
                bgcolor="#77E4C8" hoverBgColor="#4C3BCF"
              />
            </div>
          </Tooltip>
          <Tooltip title="작업할 스튜디오를 선택하세요" placement="right" arrow>
            <div> {/* Wrapper div for the Tooltip */}
              <StudioSelected listopen={open} />
            </div>
          </Tooltip>
        </div>

        <CustomModal open={isModalOpen} onClose={handleClose}>
          <StudioForm onClose={handleClose} />
        </CustomModal>

        {sections.map((section) => (
          <React.Fragment key={section.title}>
            <Divider />
            <List>
              {section.links.map((link) => (
                <Tooltip key={link.to} title={link.tooltip} placement="right" arrow>
                  <CustomListItem disablePadding>
                    <CustomListItemButton
                      sx={{ p: "3px 16px" }}
                      onClick={() => handleLinkClick(link.to, section.title !== "나만의 공간" && section.title !== "팀찾기")}
                    >
                      <ListItemIcon>{link.icon}</ListItemIcon>
                      <ListItemText primary={link.text} />
                    </CustomListItemButton>
                  </CustomListItem>
                </Tooltip>
              ))}
            </List>
          </React.Fragment>
        ))}

        <Divider />
        <ListItem sx={{ height: "200px" }} />
        <Divider />
        <Tooltip title="프로필 및 설정" placement="right" arrow>
          <CustomListItem disablePadding>
            <StyledLink to="/storyboat/profile">
              <CustomListItemButton sx={{ p: "3px 16px" }}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="내 정보" />
              </CustomListItemButton>
            </StyledLink>
            <LongMenu options={menuOptions} onClick={handleMenuClick} />
          </CustomListItem>
        </Tooltip>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="스튜디오를 선택해주세요"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      />
    </Box>
  );
}
