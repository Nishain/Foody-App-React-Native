import React, { useState } from "react"
import { BottomNavigation } from "react-native-paper"
import CategoryScreen from "./CategoryScreen"
import ProductScreen from "./ProductScreen"

export default function AdminScreen (){
    const [navigationIndex,setNavigationIndex] = useState(0)
    return <BottomNavigation 
    
    onIndexChange={setNavigationIndex}
    navigationState={{index : navigationIndex, routes : [['product','cutlery'],['category','list-ul']].map(item=>{
        return {'key' : item[0],'title' : item[0] }
    })}}
    renderScene={BottomNavigation.SceneMap({
        product : ()=><ProductScreen/>,
        category : ()=><CategoryScreen/>
    })}></BottomNavigation>
}