import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { Provider, Text } from 'react-native-paper';


import LoginScreen from './components/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './components/HomePage';
import { Modal, View } from 'react-native';
import { theme } from './components/common/theme';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import UserRoleContext from './components/UserRoleContext';
const Stack = createNativeStackNavigator()
export default App = () => {
    const currentUser = auth().currentUser
    const [isAdmin, setUserRole] = useState(false)
    if (currentUser != null)
        database().ref('/user/' + currentUser.uid).once('value', (snaphot) => {
            setUserRole(snaphot.val().isAdmin)
        })

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