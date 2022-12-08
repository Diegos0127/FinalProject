import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors'


const SplashScreen = () => {
    const playlisterColor = red[900];

    return (
        <Box sx={{ bgcolor: 'primary.dark', height:'88vh', textAlign:'center' }}>
            <Typography color={playlisterColor} sx ={{fontStyle:'italic', fontSize:'72px'}}>
                Welcome To:
            </Typography>
            <img style ={{flexGrow: 1}} src={process.env.PUBLIC_URL+'PlaylisterLogo.png'} alt=""/>
            <Typography variant ="h4" mx = {"14%"} sx ={{fontWeight:'bold'}}>
                An app where you can store all of your favorite songs into different playlists
                 for different moods and situations. Don't know what to play? Browse a catalogue of playlists
                made by other users and make them your own by duplicating and modifying them. If you want to share 
                your awesome playlists, feel free to publish them so everyone can see them and share their opinion!
            </Typography>
            <br/>
            <Grid item md = {12}>
                    <Typography variant ="h5" sx ={{fontWeight:'bold', fontSize:'18px'}}>
                       Developed by: Diego Sandoval
                    </Typography>
                </Grid>
        </Box>
    )
}

export default SplashScreen;