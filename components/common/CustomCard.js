import React from "react";
import { StyleSheet, View } from "react-native";
import theme from "./theme";
export default function CustomCard({ children }) {
    return <View style={styles.itemContainer}>
        <View style={styles.blueBox} />
        <View style={styles.itemInnerContent}>{children}</View>
    </View>
}
const styles = StyleSheet.create({
    itemContainer: {
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        alignItems : 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingLeft: 0,
        borderRadius: 10,
        padding: 10,
        margin: 7
    },
    blueBox: {
        backgroundColor: theme.colors.primary,
        height: '100%',
        width: '2%',
        marginRight: 10,
        borderRadius: 100
    },
    itemInnerContent: {
        marginRight : '5%',
        flex : 1,
        alignSelf : 'stretch',
        alignItems : 'center',
        flexDirection: "row",
        justifyContent : 'space-between'
    }
})