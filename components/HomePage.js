import React, { useEffect, useMemo, useState } from "react"
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
import CartContext from "./CartContext"
import BillGenerateScreen from "./BillGenerateScreen"
import CustomButton from "./common/CustomButton"
import auth from '@react-native-firebase/auth'
import { useContext } from "react/cjs/react.development"
import UserRoleContext from "./UserRoleContext"
const Tab = createBottomTabNavigator();
const NEVER_CHANGE = 'never_change'
export default function AdminScreen({ navigation }) {
  
    // const [navigationIndex,setNavigationIndex] = useState(0)
    const [cart, setCart] = useState([])
    const [cartErrorCount,setCartErrorCount] = useState(0)
    const [modalTabNavigator, setModalTabNavigator] = useState(false)
    const isAdmin = useContext(UserRoleContext).isAdmin
    const tabDetails = useMemo(() => [
        ['product', FoodBrowseScreen, 'cutlery',[isAdmin]],
        ['Generate Bill', BillGenerateScreen, 'print',[cart]],
        ['cart', CartScreen, 'shopping-basket',[cart]],
        ['paymentHistory',PaymentHistory,[NEVER_CHANGE]],
        ['createFood', ProductScreen,[NEVER_CHANGE]],
        ['createCategory', CategoryScreen,[NEVER_CHANGE]]
    ],[])
    const signOut = async ()=>{
        await auth().signOut()
        navigation.replace('login')
    }
    const signOutButton = ()=> {
        return <View style={styles.signOutHeaderContainer}>
            <CustomButton mode="contained" title="Logout" onPress={signOut} />
        </View>
    }
    //More options navigation modal component...prompt when user press more tabBottomBarButtton
    const customModal = useMemo(() => {
        let menuList = [
            ['Show Bill History',
            'paymentHistory']
        ]
        if(isAdmin)
            menuList = menuList
            .concat([
                ['Create Product', 'createFood'],
                ['Create Category', 'createCategory']
            ])
        return <Modal animationType='fade' transparent={true} onRequestClose={() => { setModalTabNavigator(false) }} visible={!!modalTabNavigator} >
            <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, marginBottom: -30 }} onPress={() => { setModalTabNavigator(false) }} />
            <View style={styles.modal}>
                <MaterialIcon name='menu-open' size={50} color='grey' style={{ marginTop: -20 }} />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>More Options</Text>
                <View style={{ alignSelf: 'flex-start' }}>
                    {
                        menuList.map(route => <TouchableWithoutFeedback key={route[0]} onPress={() => {
                            modalTabNavigator.jumpTo(route[1])
                            setModalTabNavigator(false)
                        }}><View style={styles.navigationSubmenuItemRow}>
                                <Text style={styles.navigationSubmenuItems}
                                >{route[0]}</Text>
                                <MaterialIcon name='keyboard-arrow-right' size={30} color='grey' />
                            </View></TouchableWithoutFeedback>)
                    }
                </View>
            </View>
        </Modal>
    },[isAdmin])
    const getCartCount = () => {
        return cart.map(cartItem => cartItem.quantity)
            .reduce((totalCount,currrentItemCount)=> totalCount + currrentItemCount ,0).toString()
    }
    const emptyBackground = () => null //dummy component as manadatory param...
    const generateDynamicTabs = ()=> tabDetails.map((tab, index) =>
    //re-render tab components only if dependencies related to specific component changes....
     useMemo(() => tab.length == 2 ? <Tab.Screen key={index}  name={tab[0]} component={tab[1]} options={{ tabBarButton: () => null }} />
      : <Tab.Screen key={index} name={tab[0]} component={tab[1]} title={tab[0]} options={{ ... tab[0] == 'cart' ? { tabBarBadge : getCartCount() } : {}, tabBarIcon: ({ color, size }) => <Icon name={tab[2]} color={color} size={size} /> }} />,)
    )

    const extraTabPressListener = ({ navigation }) => ({
        tabPress: (e) => {
            e.preventDefault();
            setModalTabNavigator(navigation)
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

                    {generateDynamicTabs()}

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
        alignItems : 'flex-end'
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