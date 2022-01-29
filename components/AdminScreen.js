import React, { useState } from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import CategoryScreen from "./CategoryScreen"
import ProductScreen from "./ProductScreen"
import CartScreen from './CartScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import theme from "./common/theme"
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FoodBrowseScreen from "./FoodsScreen"
import PaymentHistory from "./PaymentHistory"
const Tab = createBottomTabNavigator();
export default function AdminScreen() {
    // const [navigationIndex,setNavigationIndex] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
   

        {/* <Modal style={styles.modal}
                animationType="slide"
                transparent={true}
                visible={ModalVisible}
            > <Text>Hello wolrd</Text>
                <Button onPress={()=>{
                    setModalVisible(false)
                    setTimeout(()=>{setModalVisible(true)},2000)
                }} title="Re-open"/>
               
            </Modal> */}
        const CustomModal = ()=><Modal animationType='fade' transparent={true} onRequestClose={()=>{setModalVisible(false)}} visible={modalVisible} >
            <TouchableOpacity style={{backgroundColor : 'rgba(0, 0, 0, 0.5)',flex : 1,marginBottom:-30}} onPress={()=>{setModalVisible(false)}} />
            <View style={styles.modal}>
                <MaterialIcon name='keyboard-arrow-down' size={50} color='grey' style={{marginTop : -20}} />
            <Text  style={{color : 'black',fontSize : 20 ,fontWeight : 'bold'}}>More Options</Text>
            <View style={{alignSelf : 'flex-start'}}>
            <Text>Hello world</Text>
            </View>
            </View>
            
            
        </Modal>    
        const emptyBackground = ()=>null
        return <View >
            
            <View style={{height : '100%'}}>
            <Tab.Navigator 
            
            screenOptions={{
            headerShown: false,

            tabBarStyle: { height: '8%'},
            tabBarItemStyle: { borderTopRightRadius: 10, borderTopLeftRadius: 10, borderWidth: 2, borderColor: theme.colors.primary },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: theme.colors.primary,
            tabBarLabelStyle: { fontSize: 15 },
            tabBarActiveBackgroundColor: theme.colors.primary
        }} >

            {/* <Text style={{fontWeight : 'bold'}} */}
            {[['product', ProductScreen, 'cutlery'], ['category', CategoryScreen, 'list-ul'], ['cart', CartScreen, 'shopping-basket']].map((tab, index) =>
                <Tab.Screen key={index} name={tab[0]} component={tab[1]} title={tab[0]} options={{ tabBarIcon: ({ color, size }) => <Icon name={tab[2]} color={color} size={size} /> }} />
            )}
                <Tab.Screen  name="more" component={emptyBackground} title="More" listeners={({ navigation }) => ({
       tabPress: (e) => {
          e.preventDefault();
          setModalVisible(true)
       }
    })} options={{tabBarIcon : ({color,size}) => <Icon name='tv' color={color} size={size} />}} />
        </Tab.Navigator>
        <CustomModal />
        </View>
        
        </View>
}
const styles = StyleSheet.create({
    modal : {
        flex : 0,
        alignItems : 'center',
        backgroundColor : 'white',
        
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20 ,
        padding : 10,
        paddingTop : 20
    }
})