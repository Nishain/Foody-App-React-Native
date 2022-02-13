import React,{useState} from "react"
import { StyleSheet, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from "./theme"
export default function CustomSearchBar({ placeholder,onSearch }) {
    const searchTextInput = { ref : undefined }
    const changeSearchText = (txt) => {
        if(txt.length == 0){
            onSearch(undefined)
        }else
            onSearch(txt)
    }
    const clearSearch = ()=>{   
        searchTextInput.ref.clear()
        onSearch(undefined)
    }
    return <View style={styles.searchContainer}>
        <Icon name='search' size={30} color='grey' style={{ flex: 0 }} />
        <TextInput ref={(input)=>{ searchTextInput.ref = input }} placeholder={placeholder} style={styles.searchText} onChangeText={changeSearchText} />
        <Icon name='clear' onPress={clearSearch} size={25} color='white' style={styles.clearButton} />
    </View>
}
const styles = StyleSheet.create({
    searchText: {
        fontSize: 20,
        color: 'black',
        flex: 1
    },
    clearButton : {
        backgroundColor : theme.colors.secondary,
        marginRight : 7,
        borderRadius : 100,
        padding : 5,
        flex : 0
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