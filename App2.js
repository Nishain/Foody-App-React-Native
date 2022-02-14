import React, { useState,useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';


import LoginScreen from './components/AuthScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomePage';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import UserRoleContext from './components/contexts/UserRoleContext';
const Stack = createNativeStackNavigator()
export default App = () => {
    const currentUser = auth().currentUser
    const [isAdmin, setUserRole] = useState(false)
     useEffect(()=>{
        if (currentUser != null)
            database().ref('/user/' + currentUser.uid).once('value', (snaphot) => {
                setUserRole(snaphot.val().isAdmin)
            })
     },[])   
    // return <Provider theme={theme} settings={{ icon: props => <AwesomeIcon {...props} /> }}>
    return <UserRoleContext.Provider value={{isAdmin : isAdmin ,setIsAdmin : setUserRole}} >
        <NavigationContainer >
            <Stack.Navigator initialRouteName={currentUser == null ? "login" : "home"} screenOptions={{
                headerShown: false,
            }}>
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="home"  component={HomeScreen} />

            </Stack.Navigator>
        </NavigationContainer>
        </UserRoleContext.Provider>
    // </Provider>
}