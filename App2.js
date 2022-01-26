import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import React from 'react'
import theme from './components/common/theme';
import LoginScreen from './components/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from './components/ProductScreen';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AdminScreen from './components/AdminScreen';
const Stack = createNativeStackNavigator()
export default App = () => {
    return <Provider theme={theme} settings={{icon : props => <AwesomeIcon {...props} />}}>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="product" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="product" component={AdminScreen} />
        </Stack.Navigator>
    </NavigationContainer>
    </Provider>
}