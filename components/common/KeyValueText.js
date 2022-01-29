import React from "react";
import { Text, View } from "react-native";
import theme from "./theme";
const KeyValueText = ({description,value,isVerical})=>{
    return <View style={{flexDirection : isVerical ? 'column' : 'row'}}>
        <Text style={{color : theme.colors.primary , fontWeight : 'bold'}}>{description} </Text>
        <Text style={isVerical ? {marginLeft : 10} : {}}>{value}</Text>
    </View>
}
export default KeyValueText