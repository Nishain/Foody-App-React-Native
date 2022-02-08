import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { FlatList, View,SafeAreaView, StyleSheet, Text } from 'react-native'
import CustomButton from './common/CustomButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomSnackBar from './common/CustomSnackBar'
import TextInput from './common/TextInput'
import database from '@react-native-firebase/database';
import theme from './common/theme'
import CustomSearchBar from './common/SearchBar'

export default function CategoryScreen(){
    const reference = database().ref('/category/')
    const [data,setData] = useState([])
    const [categoryName,setCategoryName] = useState('')
    const [snackBarMessage,setSnackBarMessage] = useState(null)
    const [searchCriteria,setSearchCriteria] = useState(undefined)
    const removeElement = (elementIndex)=>{
        reference.child(data[elementIndex].key).remove(()=>{
            setSnackBarMessage('successfully removed category')
        })
        // data.splice(data.indexOf(elementIndex),1)
        // setData([...data])
    }

    const renderItem = (itemValue)=>{
        return <View style={styles.itemCell}>
            <Text>{itemValue.item.name}</Text>
            <Icon size={15} onPress={()=>removeElement(itemValue.index)} name="close"/>
        </View>
    }
    const addCategory = ()=>{
        if(data.findIndex(value=>value.name.toLowerCase() == categoryName.toLowerCase()) > -1){
            setSnackBarMessage('Category name should be unique')
            return
        }

        reference.push(categoryName,()=>{
            setSnackBarMessage('added Category Successfully')
        })
        // var newData = [...data]
        // newData.push({key : newGeneratedKey,name : categoryName})
        // setData(newData)
    }
    useEffect(()=>{
        reference.on('value',(snapshot) => {
            const categoryDBList = snapshot.val()
            const newData = []
            for(const category in categoryDBList){
                newData.push({key : category, name : categoryDBList[category]})
            }
            setData(newData)
        })
    },[])
    const getSearchFilteredData = ()=> useMemo(()=>searchCriteria ? data.filter(item => item.name.toLowerCase().includes(searchCriteria.toLowerCase())) : data,[searchCriteria,data])
    return <View style={styles.container}>
        <Text style={styles.header}>Categories</Text>
        <CustomSearchBar placeholder="Search categories" onSearch={setSearchCriteria} />
        <View style={styles.addRow}>
            <TextInput onChangeText={setCategoryName} placeholder="Add Category" containerStyle={{flex : 1}}/><CustomButton buttonStyle={{flex : 0,marginStart : 10}} mode="contained" title="Add" onPress={addCategory} />
        </View>
        <FlatList style={styles.flatList} data={getSearchFilteredData()} renderItem={renderItem} keyExtractor={(_,index)=>index}/>
        <CustomSnackBar setMessage={setSnackBarMessage} message={snackBarMessage}/>
    </View>
}
const styles = StyleSheet.create({
    container : {
        height : '100%'
    },  
    itemCell : {
        elevation : 2,
        shadowOffset : {
            height : 2,
            width : 0
        },
        
        backgroundColor : '#fff',
        padding : 10,
        borderBottomColor : theme.colors.primary,
        borderBottomWidth : 1,
        margin : 5,
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