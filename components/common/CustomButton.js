import React from "react"
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import theme from "./theme"
const styles = StyleSheet.create({
    common: {
        flexDirection: 'row',
        borderRadius: 10,
        padding: 8,
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    contained: {
        backgroundColor: theme.colors.primary,
        color: 'white'
    },
    containedText: { color: 'white', fontWeight: 'bold' },
    outlinedText: { color: theme.colors.primary, fontWeight: 'bold' },

    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: theme.colors.primary,
        color: theme.colors.primary
    }
})

export default function CustomButton({ title, mode, onPress, children, buttonStyle, disabled }) {
    const buttonWithComponent = () => <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ ...styles.common, ...styles[mode] }} >
            {[<Text key="k" style={{ ...styles[mode + 'Text'], flex: 0 }}>{title}</Text>, children]}
        </View>
    </TouchableWithoutFeedback >

    const normalButton = () => <Text style={{ ...styles.common, ...styles[mode], ...buttonStyle, opacity: disabled ? 0.5 : 1 }} {...disabled ? null : { onPress: onPress }}>{title}</Text>

    return children ? buttonWithComponent() : normalButton()

}
