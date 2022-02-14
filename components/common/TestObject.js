import React,{useEffect} from "react"
import { View,Text } from "react-native"

export default function TestObject(props){
    useEffect(()=>{
        // console.log('hmm...arr is changed')
    },[props.val])
    return <View><Text> Hello</Text></View>
}