import React,{useState} from "react"
import { StyleSheet, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from "./theme"
export default function CustomSearchBar({ placeholder,onSearch }) {
    const [searchText,setSearchText] = useState('')
    const changeSearchText = (txt) => {
        if(txt.length == 0){
            setSearchText(undefined)
            onSearch(undefined)
        }else
            setSearchText(txt)
    }
    return <View style={styles.searchContainer}>
        <Icon name='search' size={30} color='grey' style={{ flex: 0 }} />
        <TextInput placeholder={placeholder} style={styles.searchText} onChangeText={changeSearchText} />
        <Icon name='search' onPress={()=>{ onSearch(searchText) }} size={30} color='white' style={styles.searchButton} />
    </View>
}
const styles = StyleSheet.create({
    searchText: {
        fontSize: 20,
        
        color: 'black',
        flex: 1
    },
    searchButton : {
        backgroundColor : theme.colors.primary,
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