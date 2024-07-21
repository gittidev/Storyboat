import * as React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Box, Drawer, Button as MuiButton, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Logo from '../assets/logo.png';
import {
  FolderOpenRoundedIcon, AddReactionRoundedIcon, LightbulbIcon, MediationRoundedIcon,
  DriveFileRenameOutlineRoundedIcon, Face5Icon, BatchPredictionIcon, SettingsRoundedIcon,
  SailingRoundedIcon, ArrowBackIosNewRoundedIcon
} from './Icons';

type Anchor = 'left';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  textSize?: string;
}

const theme = createTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '30px',
          marginLeft: '3px',
          '& .MuiSvgIcon-root': {
            fontSize: '16px',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontSize: '10px',
          color: 'black',
          marginLeft: '16px',
        },
      },
    },
  },
});

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to, textSize } = props;

  return (
    <li>
      <ListItem component={Link} to={to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText
          primary={primary}
          sx={{
            fontFamily: 'Inter',
            color: 'black',
            marginLeft: icon ? '0px' : '0px',
            fontSize: textSize || 'inherit',
          }}
        />
      </ListItem>
    </li>
  );
}

interface NavBarProps {
  onToggle: (open: boolean) => void;
}

export default function NavBar({ onToggle }: NavBarProps) {
  const [state, setState] = React.useState({
    left: true,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
    onToggle(open); // Update the width based on the drawer state
  };



  //네브바 목록
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250, color: 'inherit' }}
      role="presentation"
    >
      <ThemeProvider theme={theme}>
        <List>
          <div>
            <RouterLink to={'/'}>
              <img src={Logo} width={30} />
              <ListItemLink to="/" primary="StoryBoat"/>
            </RouterLink>
            <ArrowBackIosNewRoundedIcon onClick={toggleDrawer(anchor, false)} />
          </div>
        </List>
        <Divider />
        <List>
          <ListItemText primary="개인 보관함" sx={{ color: 'black', marginLeft: '16px', fontSize: '10px' }} />
          <ListItemLink to="/main/mystory" primary="나만의 스토리" icon={<FolderOpenRoundedIcon />} />
          <ListItemLink to="/main/mychar" primary="나만의 캐릭터" icon={<AddReactionRoundedIcon />} />
          <ListItemLink to="/main/myidea" primary="나만의 아이디어" icon={<LightbulbIcon />} />
        </List>
        <Divider />
        <List aria-label="main mailbox folders">
          <ListItemText primary="스튜디오 보관함" sx={{ color: 'black', marginLeft: '16px', fontSize: '12px' }} />
          <ListItemLink to="/main/storybox" primary="Story Box" icon={<MediationRoundedIcon />} />
          <ListItemLink to="/main/storyedit" primary="Story 보관소" icon={<DriveFileRenameOutlineRoundedIcon />} />
          <ListItemLink to="/main/charbox" primary="캐릭터 보관소" icon={<Face5Icon />} />
          <ListItemLink to="/main/ideabox" primary="아이디어 보관소" icon={<BatchPredictionIcon />} />
          <ListItemLink to="/main/studio" primary="스튜디오 설정" icon={<SettingsRoundedIcon />} />
        </List>
        <Divider />
        <List aria-label="main mailbox folders">
          <ListItemLink to="/main/findteam" primary="팀 찾기" icon={<SailingRoundedIcon />} />
        </List>
        <Divider />
        <List aria-label="main mailbox folders">
          <ListItemLink to="/main/profile" primary="사용자명" />
        </List>
      </ThemeProvider>
    </Box>
  );

  return (
    <>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <MuiButton
            onClick={toggleDrawer(anchor, true)}
            sx={{
              border: '1px solid #D9D9D9',
              padding: '10px',
              borderRadius: '0px 16px 16px 0px',
            }}
          >
            <img src={Logo} width={30} />
          </MuiButton>






            {/* 내부 네브바 */}
          <Drawer
            elevation={0}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            hideBackdrop={true}
          >
            {list(anchor)}
          </Drawer>



        </React.Fragment>
      ))}
    </>
  );
}
