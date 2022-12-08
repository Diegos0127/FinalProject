import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import AuthContext from '../auth'
import SplashScreen from './SplashScreen';

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (auth.loggedIn ||auth.guest)
        return <HomeScreen />
    else
        return <SplashScreen />
}