import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import React from 'react'
import theme from './components/common/theme';
import LoginScreen from './components/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()
export default App = () => {
    return <Provider theme={theme}>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="login" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    </NavigationContainer>
    </Provider>
}