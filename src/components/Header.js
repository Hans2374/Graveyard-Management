import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Button, Box, MenuItem, Select, 
    Link, useTheme, useMediaQuery, IconButton
} from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";
import VI from "../assets/vietnam.png";
import EN from "../assets/united-kingdom.png";
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'var(--primary-color)', 
    boxShadow: 'none', 
    transition: theme.transitions.create(['box-shadow', 'background-color'], {
        duration: theme.transitions.duration.short,
        easing: theme.transitions.easing.easeInOut,
    }),
    '&.sticky': {
        backgroundColor: 'var(--primary-color)', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
    },
}));

export const Header = () => {
    const [language, setLanguage] = useState('vi');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.only('xl'));

    const toLoginPage = () => {
        navigate('/login');
    }

    const getLogo = () => {
        return isXs ? logo1 : logo;
    };

    const getLogoSize = () => {
        if (isXs) return { width: 45, height: 45 };
        if (isSm) return { width: 150, height: 50 };
        if (isMd) return { width: 140, height: 49 };
        if (isLg) return { width: 155, height: 54 };
        return { width: 170, height: 60 };  // xl size
    };

    const getFontSize = () => {
        if (isXs) return 10;
        if (isSm) return 11;
        if (isMd) return 12;
        if (isLg) return 13;
        return 14;  // xl size
    };

    const handleLanguageChange = (event) => setLanguage(event.target.value);

    return (
        <StyledAppBar position='sticky' sx={{ backgroundColor: 'var(--primary-color)' }}>
            <Toolbar>
                <Link to="/">
                    <img
                        src={getLogo()}
                        alt="logo"
                        style={{
                            ...getLogoSize(),
                            padding: 5,
                            cursor: 'pointer'
                        }}
                    />
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Select
                    color='inherit'
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    sx={{
                        width: 100,
                        borderRadius: 3,
                        marginRight: 3,
                        height: 40,
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        boxShadow: '0px 3px 2px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            backgroundColor: '#f5f5f5',
                        },
                        fontSize: getFontSize(),
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <img
                                src={selected === 'vi' ? VI : EN}
                                alt={selected === 'vi' ? 'Vietnamese flag' : 'UK flag'}
                                style={{ width: 24, height: 24, marginRight: 8 }}
                            />
                            {selected.toUpperCase()}
                        </Box>
                    )}
                >
                    <MenuItem value="vi">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={VI} alt="Vietnamese flag" style={{ width: 24, height: 24, marginRight: 8 }} />
                            VI
                        </Box>
                    </MenuItem>
                    <MenuItem value="en">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={EN} alt="UK flag" style={{ width: 24, height: 24, marginRight: 8 }} />
                            EN
                        </Box>
                    </MenuItem>
                </Select>
                {isLoggedIn ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" sx={{ scale: 1.2, marginRight: 2 }} aria-label="chat">
                            <ChatBubbleIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ scale: 1.2, marginRight: 2 }} aria-label="notification">
                            <CircleNotificationsIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ scale: 1.2, marginRight: 2 }} aria-label="account">
                            <AccountCircleIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Button
                        variant='contained'
                        color='inherit'
                        endIcon={<AccountCircleIcon sx={{ color: 'var(--secondary-color)', scale: 1.5 }} />}
                        onClick={toLoginPage}
                        sx={{
                            height: 40,
                            borderRadius: 3,
                            padding: '15px',
                            fontSize: getFontSize(),
                            paddingRight: '20px',
                            backgroundColor: 'white',
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </Toolbar>
        </StyledAppBar>
    );
};
