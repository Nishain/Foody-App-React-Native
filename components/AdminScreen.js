import React, { useState } from "react"
import Icon  from "react-native-vector-icons/FontAwesome"
import CategoryScreen from "./CategoryScreen"
import ProductScreen from "./ProductScreen"
import CartScreen from './CartScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import theme from "./common/theme"

import { Text, View } from "react-native"
const Tab = createBottomTabNavigator();
export default function AdminScreen (){
    // const [navigationIndex,setNavigationIndex] = useState(0)
    return (
        <Tab.Navigator screenOptions={{
            headerShown : false,

            tabBarActiveTintColor : 'white',
            tabBarInactiveTintColor : theme.colors.primary,
            tabBarLabelStyle : {fontSize : 15,fontWeight : 'bold'},
            tabBarActiveBackgroundColor : theme.colors.primary
        }} >
            {/* <Text style={{fontWeight : 'bold'}} */}
          {[['product',ProductScreen,'cutlery'],['category',CategoryScreen,'list-ul'],['cart',CartScreen,'shopping-basket']].map((tab,index)=>
                <Tab.Screen key={index} name={tab[0]} component={tab[1]} title={tab[0]} options={{tabBarIcon : ({color,size})=><Icon name={tab[2]} color={color} size={size}/>}} />
            )}  
          
        </Tab.Navigator>
      );
    // return <BottomNavigation 
    
    // onIndexChange={setNavigationIndex}
    // navigationState={{index : navigationIndex, routes : [['product','cutlery'],['category','list-ul']].map(item=>{
    //     return {'key' : item[0],'title' : item[0] }
    // })}}
    // renderScene={BottomNavigation.SceneMap({
    //     product : ()=><ProductScreen/>,
    //     category : ()=><CategoryScreen/>
    // })}></BottomNavigation>
}