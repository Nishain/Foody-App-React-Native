import React from "react"
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import theme from "./theme"
const styles = StyleSheet.create({
    common: {
        flexDirection: 'row',
        borderRadius: 10,
        padding : 8,
        fontWeight : 'bold',
        justifyContent : 'center',
        alignItems: 'center'
    },
    contained: {
        backgroundColor: theme.colors.primary,
    },
    containedText: { color: 'white',fontWeight : 'bold' },
    outlinedText: { color: theme.colors.primary,fontWeight : 'bold' },

    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: theme.colors.primary,
    }
})
const modes = {
    contained: styles.contained,
    outlined: styles.outlined
}
export default function CustomButton({ title, mode, onPress, children }) {
    return <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ ...styles.common, ...modes[mode] }} >
            {/* <Text style={{ ...styles[`${mode}Text`], flex: 0 }}>{title}</Text> */}
            {[<Text style={{ ...styles[`${mode}Text`], flex: 0 }}>{title}</Text>,children]}
        </View>
    </TouchableWithoutFeedback>
}
