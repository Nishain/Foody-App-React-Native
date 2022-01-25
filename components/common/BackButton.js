import React from 'react'
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import theme from './theme';
//arrow-left
export default function BackButton({goBack}){
    return <TouchableOpacity style={style.button} onPress={goBack}>
        <Icon name="camera" size={25} color="#fff" />
    </TouchableOpacity>
    
}
const style = StyleSheet.create({
    button : {
        borderRadius : 100,
        padding : 10,
        backgroundColor : theme.colors.primary,
        alignSelf : 'flex-start',
        margin : 15,
        elevation : 10
        // position :'absolute',
        // top : 20,
        // left : 4
    }
})