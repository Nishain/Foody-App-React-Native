import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon  from 'react-native-vector-icons/MaterialIcons'
var timeout
export default function CustomSnackBar({message,setMessage}){
    if(timeout != null)
        clearTimeout(timeout)
    timeout = setTimeout(()=>{setMessage(null)},2500)
    return message != null?  <View style={style.snackBar}>
        <Text style={style.text}>{message}</Text>
        <Icon color='white' size={20} name='close' style={{flex : 0}} onPress={()=>{setMessage(null)}}/>
    </View> : null
}
const style = StyleSheet.create({
    text : {
        color : 'white',
        textAlign : 'left',
        flex : 1
    },
    snackBar : {
        flexDirection : 'row',
        backgroundColor : 'black',
        color : 'white',
        padding : 15,
         width : '100%',
        alignSelf : 'stretch',
        margin : 10,
        flex : 0,
        position : 'absolute',
        bottom  : 0,
        // width : '100%',
        borderRadius : 10
    }
})