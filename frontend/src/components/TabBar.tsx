import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { blue } from '@mui/material/colors';

interface LinkTabProps {
  label: string;
  path: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component={Link}
      to={props.path}
      label={props.label}
      sx={{backgroundColor: 'blue', color : 'white' , borderRadius: '10px',}}
    />
  );
}

export default function TabBar() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    switch (location.pathname) {
      case '/main/studio/studioSettings':
        setValue(0);
        break;
      case '/main/studio/subscription':
        setValue(1);
        break;
      case '/main/studio/teamsetting':
        setValue(2);
        break;
      default:
        setValue(0);
    }
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', display:'flex' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        role="navigation">
        <LinkTab label="스튜디오 설정" path="/main/studio/studioSettings" />
        <LinkTab label="요금제&플랜" path="/main/studio/subscription" />
        <LinkTab label="팀 관리" path="/main/studio/teamsetting" />
      </Tabs>
    </Box>
  );
}
