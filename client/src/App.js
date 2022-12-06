import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey,purple} from '@mui/material/colors'
import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen
} from './components'
/*
    This is our application's top-level component.
    
    @author Diego Sandoval
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author Diego Sandoval
*/
const mainColor = grey[400];
const theme = createTheme({
    palette:{
        primary: {
            main:'#e0e0e0',
            light:'#ffffff',
            dark:'#c4c4c4'
        },
        secondary:purple
    }
})
const App = () => {   
    return (
        <BrowserRouter>
            <ThemeProvider theme = {theme}>
                <AuthContextProvider>
                    <GlobalStoreContextProvider>              
                        <AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            
                        </Switch>
                    </GlobalStoreContextProvider>
                </AuthContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App