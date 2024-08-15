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
import { useRecoilValue } from 'recoil';
import { refreshTokenState } from '../../recoil/atoms/authAtom'; // Recoil 상태를 불러오는 경로로 수정하세요.

const LandingNav: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [navHeight, setNavHeight] = useState<string>('7vh');
    const navigate = useNavigate();

    const isLoggedIn = useRecoilValue(refreshTokenState);

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
        { name: '메인으로', path: '/storyboat' },
        ...(!isLoggedIn ? [{ name: '로그인', path: '/login' }] : []),
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    const updateHeight = () => {
        const newHeight = window.innerHeight * 0.085;
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
            position="fixed" 
            elevation={0} 
            sx={{
                height: navHeight, 
                backgroundColor: 'rgba(0, 0, 0, 0)',  // Transparent background
                top: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.drawer + 1  // Ensure it floats above other content
            }}
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
                                    sx={{ fontSize: '1.2rem' }}  // 글씨 크기 조정
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
                                    sx={{ fontSize: '1.2rem' }}  // 글씨 크기 조정
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
