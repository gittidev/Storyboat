// src/pages/LandingPage/LandingNav.tsx
import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Popover,
    Button,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const LandingNav: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [navHeight, setNavHeight] = useState<string>('7vh');
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const leftMenuItems = [
        { name: '작품 예시', path: '/?page=lanstory' },
        { name: '주요 기능', path: '/?page=friends' },
        { name: '추가 기능', path: '/?page=MainAI' },
        { name: '사용 후기', path: '/?page=LanReview' },
    ];

    const rightMenuItems = [
        { name: '로그인', path: '/login' },
        { name: '메인으로', path: '/storyboat' }
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    const updateHeight = () => {
        const newHeight = window.innerHeight * 0.07;
        setNavHeight(`${newHeight}px`);
    };

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return (
        <AppBar 
            position="static" 
            elevation={0} 
            sx={{ height: navHeight }}
        >
            <Toolbar>
                <img src={logo} alt="로고" style={{ width: 40, height: 40, marginRight: 16 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    StoryBoat
                </Typography>
                {isMobile ? (
                    <>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Popover
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <List>
                                {leftMenuItems.concat(rightMenuItems).map((item) => (
                                    <ListItem button key={item.name} onClick={() => handleNavigation(item.path)}>
                                        <ListItemText primary={item.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Popover>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '15px', paddingLeft: '40px' }}>
                            {leftMenuItems.map((item) => (
                                <Button
                                    key={item.name}
                                    color="inherit"
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {rightMenuItems.map((item) => (
                                <Button
                                    key={item.name}
                                    color="inherit"
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default LandingNav;
