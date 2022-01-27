import React from "react"
import { StyleSheet, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'
export default function CustomSearchBar({ placeholder }) {
    return <View style={styles.searchContainer}>
        <Icon name='search' size={30} color='grey' style={{ flex: 0 }} />
        <TextInput placeholder={placeholder} style={styles.searchText} />
    </View>
}
const styles = StyleSheet.create({
    searchText: {
        fontSize: 20,
        
        color: 'black',
        flex: 1
    },
    searchContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 3,
        flexDirection: 'row',
        margin: 10,
        paddingLeft: '5%',
        borderRadius: 50
    }
})