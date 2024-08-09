import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      dir={dir}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface TabBarTestProps {
  labels: string[];
  childrenComponents: React.ReactNode[];
  width?: string;
}

const TabBar: React.FC<TabBarTestProps> = ({ labels, childrenComponents, width }) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: width || '100%' }}>
      <Paper elevation={0} sx={{ borderRadius: '10px', p: 1, bgcolor: 'grey.300' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="tabs example"
          sx={{ 
            minHeight: '30px',
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          {labels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              {...a11yProps(index)}
              sx={{
                minHeight: '32px',
                p: '10px 12px',  // Adjust padding to reduce vertical height
                borderRadius: '10px',
                bgcolor: value === index ? 'white' : 'grey.300',
                color: value === index ? 'black' : 'grey.600',
                fontWeight: value === index ? 'bold' : 'normal',
                '&:hover': {
                  bgcolor: value === index ? 'white' : 'grey.400',
                },
                mx: 0.5 // Margin X to add space between tabs
              }}
            />
          ))}
        </Tabs>
      </Paper>
      
      {labels.map((_, index) => (
        <TabPanel key={index} value={value} index={index} dir={theme.direction}>
          {childrenComponents[index]}
        </TabPanel>
      ))}
    </Box>
  );
}

export default TabBar;
