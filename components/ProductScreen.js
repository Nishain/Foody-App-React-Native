import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNavigation, Button, Searchbar } from 'react-native-paper';
import TextInput from './common/TextInput';

import DropDownPicker from 'react-native-dropdown-picker';
import theme from './common/theme';
import CustomSnackBar from './common/CustomSnackBar';
import CustomSearchBar from './common/SearchBar';

export default function ProductScreen(){
    const fields = {
        name : {},
        description : { multiline : true },
        'discount limit' : { validation : /^[0-9]+$/,numberOnly : true },
        price : { validation : /^[0-9]+$/, numberOnly : true}
    }//['name',['description','@multiline'],['discount limit',/^[0-9]+$/],'price',/^[0-9]+$/]
   
    const reference = database().ref('/')
    const get = (key,fieldName='value') => fieldData[key] ? fieldData[key][fieldName] : undefined
    const [fieldData,setFieldData] = useState({})
    const [categories,setCategories] = useState([])
    const [selectedCategories,setSelectedCategories] = useState([])
    const [dropdownOpen,setDropdownOpen] = useState(false)
    const [snackbarMsg,setSnackbarMsg] = useState(undefined)
    const changeInputText = (key,text)=>{
        setFieldData({...fieldData,[key]:{'value':text}})
    }
    const createFood = () => {
        if(validateFields())
            return
        var parsedData = {}
        for(const key in fieldData){
            parsedData[key] = fields[key].numberOnly ? parseFloat(fieldData[key].value) : fieldData[key].value
        }
        parsedData.categories = selectedCategories //unwrapping the parameter
        reference.child('food').push(parsedData,()=>{setSnackbarMsg('Product has successfully created')})
        
    }
    const validateFields = () => {
        var validationFailed = false
        for(const field in fields){
            if((get(field) || '') == ''){
                validationFailed = true
                errorFields[field] = {
                    'error' : `${field} should not be empty`
                }
            }else if(fields[field].validation){
                
                if(!get(field).match(fields[field].validation)){
                    errorFields[field] = {
                        'error' : `please enter a valid ${field}`
                    }
                    validationFailed = true
                }
            }
        }
        if(selectedCategories.length == 0){
            setSnackbarMsg('Food should at least belong to single category')
            validationFailed = true
        }
        if(validationFailed){
            setFieldData({...fieldData,...errorFields})
        }
        return validationFailed
    }
    useEffect(()=>{
        reference.child('category').on('value',(snapshot)=>{
            if(!snapshot.val())
                return
            const newCategoryList = []    
            const categoryData = snapshot.val()    
            for(const categoryKey in categoryData){
                newCategoryList.push(categoryData[categoryKey])
            }
            setCategories(newCategoryList)
        },(error) => {
            console.error(error)
        })
        
    },[])
    const generateUIFields = ()=> {
        const uiFields = Object.keys(fields).map((field,index)=> <TextInput 
        key={index}
        description={field} 
        label={field} 
        returnKeyType={index == (fields.length - 1) ? 'done' : 'next'}
        onChangeText={(text)=>{changeInputText(field,text)}}
        error={ get(field,'error') }
        multiline={fields[field].multiline}
        errorText={ get(field,'error') || '' }
        />)
        uiFields.splice(2,0,<SafeAreaView style={{flex : 1}}>
        <Text style={{marginBottom : 10}}>Category</Text>
         <DropDownPicker
            key="dropDown"
            open={dropdownOpen}
            multiple={true}
            placeholder="Select a category"
            setOpen={setDropdownOpen}
            value={selectedCategories}
            mode='BADGE'
            setValue={(val)=>{
                setSelectedCategories(val)
                setDropdownOpen(false)
            }}
            // setItems={(newItems)=>{setFieldData({...fieldData,categories:{value:newItems}})}}
            searchable={true}
            items={categories.map(category=>{return {value : category, label : category}})}
            />
        </SafeAreaView>)
        return uiFields
    }
    return <View style={styles.container}>
        <ScrollView>
        <CustomSearchBar placeholder="Search" />
        <Text style={styles.header}>Add Food</Text>
            {generateUIFields()}
            <Button mode='contained' onPress={createFood}>Create</Button>
        
        
        </ScrollView>
        <CustomSnackBar  message={snackbarMsg} setMessage={setSnackbarMsg} />
    </View>
}
const styles = StyleSheet.create({
    container : {
      
        padding : 15,
        paddingBottom : 0,
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