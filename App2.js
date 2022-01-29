import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { Provider, Text } from 'react-native-paper';


import LoginScreen from './components/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AdminScreen from './components/AdminScreen';
import { Modal, View } from 'react-native';
import {theme} from './components/common/theme';
const Stack = createNativeStackNavigator()
export default App = () => {
    const ModalScreen = () => {
        return <Modal.Container animationType="slide"
            transparent={true}
            visible={true}

            style={{ backgroundColor: 'red', bottom: 0, position: 'absolute' }}>
            <Text>Hello world</Text>
        </Modal.Container>
    }
    return <Provider theme={theme} settings={{icon : props => <AwesomeIcon {...props} />}}>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="admin" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="admin" component={AdminScreen} />
        </Stack.Navigator>
    </NavigationContainer>
    </Provider>
}