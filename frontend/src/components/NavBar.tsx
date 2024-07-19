import * as React from 'react';
import {      
  Link as RouterLink, 
  LinkProps as RouterLinkProps } from 'react-router-dom';
import { Box, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, Typography, } from '@mui/material';

import Logo from '../assets/logo.png'


type Anchor = 'left';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
  }
  

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  },
);

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  return (
    <li>
      <ListItem component={Link} to={to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}



export default function NavBar() {
    const [state, setState] = React.useState({
        left: false, 
      });


      const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };


  // navbar 내용 들어가는 부분 ...
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250, color : 'inherit' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >

      <List>   
      <ListItemLink to="/mystory" primary="StoryBoat" icon={''} sx={{
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '24px',
          fontStyle: 'italic',
          fontWeight: 900,
          lineHeight: '36px', // 150%
      }}/>
      </List>     
      
      <Divider />
      
      <List>        
        <ListItemLink to="/mystory" primary="나만의 스토리" icon={''} />
        <ListItemLink to="/mychar" primary="나만의 캐릭터" icon={''} />
        <ListItemLink to="/myidea" primary="나만의 아이디어" icon={''} />
      </List>


      <Divider />
          <List aria-label="main mailbox folders">
            <ListItemLink to="/storybox" primary="Story Box" icon={''} />
            <ListItemLink to="/storyedit" primary="Story 보관소" icon={''} />
            <ListItemLink to="/charbox" primary="캐릭터 보관소" icon={''} />
            <ListItemLink to="/ideabox" primary="아이디어 보관소" icon={''} />
            <ListItemLink to="/studio" primary="스튜디오 설정" icon={''} />
          </List>



      <Divider />

      <List aria-label="main mailbox folders">
            <ListItemLink to="/inbox" primary="Inbox" icon={ '' } />
            <ListItemLink to="/findteam" primary="팀 찾기" icon={''} />

      </List>
      <Divider />

      <List aria-label="main mailbox folders">
      <ListItemLink to="/profile" primary="사용자명" icon={''} />
          

      </List>

        
      

    </Box>
    );




    return(
    
        <>

        {(['left'] as const).map((anchor) => (
        
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>

          <Button></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}






        </>
    )

}
