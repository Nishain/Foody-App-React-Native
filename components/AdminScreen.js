import React, { useState } from "react"
import { BottomNavigation } from "react-native-paper"
import ProductScreen from "./ProductScreen"

export default function AdminScreen (){
    const [navigationIndex,setNavigationIndex] = useState(0)
    return <BottomNavigation 
    onIndexChange={setNavigationIndex}
    navigationState={{index : navigationIndex, routes : ['product','category'].map(title=>{
        return {'key' : title,'title' : title }
    })}}
    renderScene={BottomNavigation.SceneMap({
        product : ()=><ProductScreen/>,
        category : ()=><ProductScreen/>
    })}></BottomNavigation>
}