import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BottomNavigation, Button, Searchbar } from 'react-native-paper';
import TextInput from './common/TextInput';

import DropDownPicker from 'react-native-dropdown-picker';
import theme from './common/theme';

const NAME='name',DESCRIPTION='description',CATEGORIES='categories',SELECTED_CATEGORIES='selectedCategories'
export default function ProductScreen(){
    const reference = database().ref('/categories/')
    const get = (key,fieldName='value') => fieldData[key] ? fieldData[key][fieldName] : undefined
    const [fieldData,setFieldData] = useState({name:{},description:{},categories:{value : ["hello",'orange','apple','grapes']}})
    const [selectedCategories,setSelectedCategories] = useState([])
    const [dropdownOpen,setDropdownOpen] = useState(false)
    
    const changeInputText = (key,text)=>{
        setFieldData({...fieldData,[key]:{'value':text}})
    }
    useEffect(()=>{
    },[])
    
    return <View style={styles.container}>
        <Searchbar style={styles.searchbar} placeholder='Search' icon="search"/>
        <Text style={styles.header}>Add Food</Text>
        <TextInput 
         description="Food Name"
         label="Food Name"
         returnKeyType="next"
         onChangeText={(text) => changeInputText(NAME, text)}
         error={get(NAME,'error')}
         errorText={get(DESCRIPTION,'error') || ''}
         />
         <TextInput 
         description="Food decription"
         label="Food Desciption"
         returnKeyType="next"
         multiline
         onChangeText={(text) => changeInputText(DESCRIPTION, text)}
         error={get(DESCRIPTION,'error')}
         errorText={get(DESCRIPTION,'error') || ''}
         />
        <Text style={{marginBottom : 10}}>Category</Text>
         <DropDownPicker
            open={dropdownOpen}
            multiple={true}
            placeholder="Select a category"
            setOpen={setDropdownOpen}
            value={selectedCategories}
            mode='BADGE'
            setValue={setSelectedCategories}
            // setItems={(newItems)=>{setFieldData({...fieldData,categories:{value:newItems}})}}
            searchable={true}
            items={get(CATEGORIES).map(category=>{return {value : category, label : category}})}
            />
        <TextInput description="Discount limit" label="Discount limit"/>
        <Button mode='contained'>Create</Button>
        
    </View>
}
const styles = StyleSheet.create({
    container : {
        padding : 15
    },
    searchbar : {
        alignSelf : 'center',
        margin : 5,
        borderRadius : 50
    },
    header: {
        alignSelf: 'center',
        fontSize: 29,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
})