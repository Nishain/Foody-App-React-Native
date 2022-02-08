import React, { useMemo, useState } from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import CategoryScreen from "./CategoryScreen"
import ProductScreen from "./ProductScreen"
import CartScreen from './CartScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import theme from "./common/theme"
import { Button, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import FoodBrowseScreen from "./FoodsScreen"
import PaymentHistory from "./PaymentHistory"
import CartContext from "./contexts/CartContext"
import BillGenerateScreen from "./BillGenerateScreen"
import CustomButton from "./common/CustomButton"
import auth from '@react-native-firebase/auth'
import { useContext, useEffect } from "react/cjs/react.development"
import UserRoleContext from "./contexts/UserRoleContext"
const Tab = createBottomTabNavigator();
export default function HomeScreen({ navigation }) {
   
    
    // const [navigationIndex,setNavigationIndex] = useState(0)
    const [cart, setCart] = useState([])
    const [cartErrorCount,setCartErrorCount] = useState(0)
    const [modalTabNavigator, setModalTabNavigator] = useState(false)
    const isAdmin = useContext(UserRoleContext).isAdmin
    const tabDetails = useMemo(() => [
        ['product', FoodBrowseScreen, 'cutlery'],
        ['Generate Bill', BillGenerateScreen, 'print'],
        ['cart', CartScreen, 'shopping-basket'],
        ['paymentHistory',PaymentHistory],
        ['createFood', ProductScreen],
        ['createCategory', CategoryScreen]
    ])
    const signOut = async ()=>{
        await auth().signOut()
        navigation.replace('login')
    }
    const signOutButton = ()=> {
        return <View style={styles.signOutHeaderContainer}>
            <Text style={styles.userRoleStatus}>{isAdmin ?  "Logged in as Admin" : "Logged as normal User"}</Text>
            <CustomButton mode="contained" title="Logout" onPress={signOut} />
        </View>
    }
    //More options navigation modal component...prompt when user press more tabBottomBarButtton
    const customModal = () => {
        return <Modal animationType='slide' transparent={true} onRequestClose={() => { setModalTabNavigator(false) }} visible={!!modalTabNavigator} >
            <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, marginBottom: -30 }} onPress={() => { setModalTabNavigator(false) }} />
            {useMemo(()=> {
            return <View style={styles.modal}>
                <MaterialIcon name='menu-open' size={50} color='grey' style={{ marginTop: -20 }} />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>More Options</Text>
                <View style={{ alignSelf: 'flex-start' }}>
                    {
                        ([['Show Bill History',
                        'paymentHistory']].concat(isAdmin ? [
                            ['Create Product', 'createFood'],
                            ['Create Category', 'createCategory']
                        ] : [])).map(route => <TouchableWithoutFeedback key={route[0]} onPress={() => {
                            modalTabNavigator.jumpTo(route[1])
                            setModalTabNavigator(false)
                        }}><View style={styles.navigationSubmenuItemRow}>
                                <Text style={styles.navigationSubmenuItems}
                                >{route[0]}</Text>
                                <MaterialIcon name='keyboard-arrow-right' size={30} color='grey' />
                            </View></TouchableWithoutFeedback>)
                    }
                </View>
            </View>},[isAdmin,modalTabNavigator])}
            
         </Modal>
    }
    const getCartCount = () => {
        const cartCount = cart.map(cartItem => cartItem.quantity)
            .reduce((totalCount,currrentItemCount)=> totalCount + currrentItemCount ,0)
        return cartCount == 0 ? undefined : cartCount    
    }
    const emptyBackground = () => null //dummy component as manadatory param...
    const generateDynamicTabs = useMemo(()=>tabDetails.map((tab, index) =>
    //re-render tab components only if dependencies related to specific component changes....
     tab.length == 2 ? <Tab.Screen key={index}  name={tab[0]} component={tab[1]} options={{ tabBarButton: () => null }} />
      : <Tab.Screen key={index} name={tab[0]} component={tab[1]} title={tab[0]} options={{ ... tab[0] == 'cart' ? { tabBarBadge : getCartCount()  } : {}, tabBarIcon: ({ color, size }) => <Icon name={tab[2]} color={color} size={size} /> }} />),[cart])
    

    const extraTabPressListener = ({ navigation : tabNavigationProps }) => ({
        
        tabPress: (e) => {
            e.preventDefault();
            setModalTabNavigator(tabNavigationProps)
        }
    })
    return <View >

        <View style={{ height: '100%' }}>
            <CartContext.Provider value={{ cart: cart, setCart: setCart, cartErrorCount : cartErrorCount, setCartErrorCount : setCartErrorCount}}>
                <Tab.Navigator
                    screenOptions={{
                        // headerShown: false,
                        header : signOutButton,
                        tabBarStyle: { height: '8%' },
                        tabBarItemStyle: { borderTopRightRadius: 10, borderTopLeftRadius: 10, borderTopWidth: 2, borderColor: theme.colors.primary },
                        tabBarActiveTintColor: 'white',
                        tabBarInactiveTintColor: theme.colors.primary,
                        tabBarLabelStyle: { fontSize: 15 },
                        tabBarActiveBackgroundColor: theme.colors.primary
                    }} >
                    {generateDynamicTabs}
                     <Tab.Screen name="more" component={emptyBackground} title="More" listeners={extraTabPressListener} options={{ tabBarIcon: ({ color, size }) => <Icon name='bars' color={color} size={size} /> }} />
                </Tab.Navigator>
            </CartContext.Provider>
            {customModal()}
        </View>

    </View>
}
const styles = StyleSheet.create({
    modal: {
        flex: 0,
        alignItems: 'center',
        backgroundColor: 'white',

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        paddingTop: 20
    },
    signOutHeaderContainer : {
        padding : 5,
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    userRoleStatus : {
        borderColor : theme.colors.primary,
        borderWidth : 2,
        padding : 5,
        paddingHorizontal : 10,
        borderRadius : 7,
        color : theme.colors.primary,
        textAlign : 'center',
        fontWeight : 'bold'
    },
    navigationSubmenuItems: {
        margin: 5,
        alignSelf: 'flex-start',
        // fontWeight : 'bold',
        color: 'black',
        fontSize: 20
    },
    navigationSubmenuItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%'
    }
})