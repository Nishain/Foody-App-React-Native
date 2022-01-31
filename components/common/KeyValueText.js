import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "./theme";
import Icon from 'react-native-vector-icons/MaterialIcons'
const KeyValueText = ({ qtyEditable,qtyChangeHandler, description, value, isVerical }) => {
    
    return <View style={{ flexDirection: isVerical ? 'column' : 'row' }}>
        
        <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{description}{' '}</Text>
        
        {qtyEditable ?
            <View style={{ flexDirection: 'row' }}>
                <Icon style={styles.roundButton} name={'remove'} onPress={()=>{qtyChangeHandler('remove')}} color={'white'} size={15} />
                <Text style={isVerical ? { marginLeft: 10 } : {}}>{value}</Text>
                <Icon style={styles.roundButton} name={'add'} onPress={()=>{qtyChangeHandler('add')}} size={15} color={'white'} />
            </View> :
            <Text style={isVerical ? { marginLeft: 10 } : {}}>{value}</Text>
        }
    </View>
}
const styles = StyleSheet.create({
    roundButton : {
        marginLeft : 10,
        marginRight : 10,
        backgroundColor : theme.colors.primary,
        padding : 5 ,
        borderRadius : 50
    }
})
export default KeyValueText