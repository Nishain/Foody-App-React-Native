import React from 'react'
import { useState } from 'react'
import { FlatList, View,SafeAreaView, StyleSheet } from 'react-native'
import { Text,Searchbar, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomSnackBar from './common/CustomSnackBar'
import TextInput from './common/TextInput'
import theme from './common/theme'
export default function CategoryScreen(){
    const [data,setData] = useState(['camel','Affreica','something','nothing','anything'])
    const [categoryName,setCategoryName] = useState('')
    const [snackBarMessage,setSnackBarMessage] = useState(null)
    const removeElement = (element)=>{
        data.splice(data.indexOf(element),1)
        setData([...data])
    }
    const renderItem = (itemValue)=>{
        return <View style={styles.itemCell}>
            <Text>{itemValue.item}</Text>
            <Icon size={15} onPress={()=>removeElement(itemValue.item)} name="close"/>
        </View>
    }
    const addCategory = ()=>{
        if(data.findIndex(value=>value.toLowerCase() == categoryName.toLowerCase()) > -1){
            setSnackBarMessage('Category name should be unique')
            return
        }
        const newData = [...data]
        newData.push(categoryName)
        setData(newData)
    }
    return <View style={styles.container}>
        <Text style={styles.header}>Categories</Text>
        <Searchbar style={styles.searchBar} placeholder="Search categories" icon="search"/>
        <View style={styles.addRow}>
            <TextInput onChangeText={setCategoryName} placeholder="Add Category" containerStyle={{flex : 1}}/><Button style={{flex : 0,marginStart : 10}} onPress={addCategory} mode='contained'>Add</Button>
        </View>
        <FlatList style={styles.flatList} data={data} renderItem={renderItem} keyExtractor={(value)=>data.indexOf(value)}/>
        <CustomSnackBar setMessage={setSnackBarMessage} message={snackBarMessage}/>
    </View>
}
const styles = StyleSheet.create({
    container : {
        height : '100%'
    },  
    itemCell : {
        backgroundColor : '#fff',
        padding : 10,
        borderBottomColor : '#000',
        borderBottomWidth : 1,
        margin : 2,
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    addRow : {
        alignSelf : 'stretch',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        
        // alignItems : 'center',
        marginLeft : 5,
        marginRight : 5
    },
    flatList : {
        padding : 5,
        margin : 5,
        borderRadius : 10
    },

    searchBar : {
        margin : 10,
        borderRadius : 50
    },
    header : theme.headerStyle
})