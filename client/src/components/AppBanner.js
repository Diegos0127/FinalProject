import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import { purple} from '@mui/material/colors'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notSplash, setNotSplash] = useState(false)
    const isMenuOpen = Boolean(anchorEl);
    let iconColor = purple['A200']
    if(!auth.loggedIn)
        iconColor = 'clear';
    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    if(notSplash!==(window.location.pathname !== "/"))
        setNotSplash(window.location.pathname !== "/");
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const changeScreen = () => {
        setNotSplash(true);
    };
    const handleGuest = () => {
        setNotSplash(true);
        auth.loginGuest();
    };
    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }
    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    return (
        <Box sx={{ width: "100%", height: "6.5vh" }} >
            <AppBar position="static" sx={{ bgcolor: 'primary.main',width: "100%", height: "100%" }}>
                <Toolbar>
                    <img style={{width: "auto", height: "100%"}}src={process.env.PUBLIC_URL+'PlaylisterLogo.png'}  />
                    <Box sx={{ flexGrow: 1 }}></Box>
                    {auth.loggedIn||notSplash||auth.guest?<Box sx={{ display: {  md: 'flex' } }}>
                        <IconButton
                            
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleSortMenuOpen}
                            color="inherit"
                            sx = {{backgroundColor: iconColor, border:2, borderColor:'black'}}
                        >
                            {auth.loggedIn ? <div>{auth.getUserInitials()}</div>:<AccountCircle sx={{fontSize:'25px'}}/>}
                        </IconButton>
                    </Box>:<Grid container >
                    <Grid item xs = {0} md = {6} lg ={7} ></Grid>
                <Grid item md = {3} lg={2} onClick={handleGuest}>
                    <Link id = "splash-button" to='/' >Continue As Guest</Link>
                </Grid>
                <Grid item xs ={4} md = {2} onClick={changeScreen}>
                    <Link id = "splash-button" to='/register/'>Create Account</Link>
                </Grid>
                <Grid item xs = {3} md = {1} onClick={changeScreen}>
                    <Link id = "splash-button" to='/login/'>Login</Link>
                </Grid>
            </Grid>}
                    
                </Toolbar>
            </AppBar>
            { auth.loggedIn?loggedInMenu:loggedOutMenu  }
        </Box>
    );
}