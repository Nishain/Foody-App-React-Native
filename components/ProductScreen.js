import React, { useEffect, useState, useMemo } from 'react'
import database from '@react-native-firebase/database';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import TextInput from './common/TextInput';

import DropDownPicker from 'react-native-dropdown-picker';
import theme from './common/theme';
import CustomSnackBar from './common/CustomSnackBar';
import CustomButton from './common/CustomButton';

const fields = {
    name: {},
    description: { multiline: true },
    'discount limit': { validation: /^[0-9]+$/, numberOnly: true },
    price: { validation: /^[0-9]+$/, numberOnly: true }
}
const refs = Object.keys(fields).map(_=> { return { ref : undefined } })
export default function ProductScreen({ route }) {
    
    const reference = database().ref('/')
    const get = (key, fieldName = 'value') => fieldData[key] ? fieldData[key][fieldName] : undefined
    const [fieldData, setFieldData] = useState({})
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState(undefined)
    useEffect(()=>{
        
        setFieldData({})
        // do not remove selected category list if selected item is already
        // provivded or else it will clear the category list of updating item
        if(!(route.params?.selectedItem)){
            setSelectedCategories([])
        }else{
            setSelectedCategories(route.params?.selectedCategories)
        }
            
    },[route.params?.selectedItem])

    const changeInputText = (key, text) => {
        setFieldData({ ...fieldData, [key]: { 'value': text } })
    }
    const createOrUpdateFood = (updateItemKey) => {
        if (validateFields(updateItemKey != undefined)){ //ignore checking empty fields if updating
            return
        }
        var parsedData = {}
        for (const key in fieldData) {
           
            parsedData[key] = fields[key].numberOnly ? parseFloat(fieldData[key].value) : fieldData[key].value
        }
        parsedData.categories = selectedCategories //unwrapping the parameter
        if (updateItemKey)
            reference.child('food').child(updateItemKey).update(parsedData, () => { setSnackbarMsg('Product has successfully updated') })
        else
            reference.child('food').push(parsedData, () => { setSnackbarMsg('Product has successfully created') })

    }
    const validateFields = (ignoreEmptyFields = false) => {
        var validationFailed = false
        const errorFields = {}
        for (const field in fields) {
            if ((get(field) || '') == '') {
                if (ignoreEmptyFields) { // if only user is updating a food item, user can leave other fields empty...
                    if (fieldData[field]) //the field is not undefined but empty string so undefined it to prevent
                        //updating food attributes with empty values....
                        delete fieldData[field]
                    continue
                }
                validationFailed = true
                errorFields[field] = {
                    'error': `${field} should not be empty`
                }
            } else if (fields[field].validation) {

                if (!get(field).match(fields[field].validation)) {
                    errorFields[field] = {
                        'error': `please enter a valid ${field}`
                    }
                    validationFailed = true
                }
            }
        }
        if (selectedCategories.length == 0) {
            setSnackbarMsg('Food should at least belong to single category')
            validationFailed = true
        }
        if (!validationFailed && parseFloat(get('discount limit')) > 100) { //if discount field in correct data format 
            //then check for discount range
            errorFields['discount limit'] = {
                'error': 'Discount must be with range of 100'
            }
            validationFailed = true
        }
        if (validationFailed) {
            setFieldData({ ...fieldData, ...errorFields })
        }
        return validationFailed
    }
    useEffect(() => {
        reference.child('category').on('value', (snapshot) => {
            if (!snapshot.val())
                return
            const newCategoryList = []
            const categoryData = snapshot.val()
            for (const categoryKey in categoryData) {
                newCategoryList.push(categoryData[categoryKey])
            }
            setCategories(newCategoryList)
        }, (error) => {
            console.error(error)
        })

    }, [])
    const parsedCategoryListForDropDown =  useMemo(()=>categories.map(category => { return { value: category, label: category } }),[categories])
    const generateUIFields = () => {
        const uiFields = 
            Object.keys(fields).map((field, index) => <TextInput
                key={index}
                description={field}
                label={field}
                keyboardType={fields[field].numberOnly ? "decimal-pad" : "default"}
                innerRef={(input)=>refs[index].ref = input}
                onSubmitEditing={()=>{
                if(index < refs.length - 1)  
                    refs[index + 1].ref.focus()
                }}
                defaultValue={ route.params?.selectedItem ? route.params.selectedItem[field] : undefined }
                returnKeyType={index == (fields.length - 1) ? 'done' : 'next'}
                onChangeText={(text) => { changeInputText(field, text) }}
                error={get(field, 'error')}
                multiline={fields[field].multiline}
                errorText={get(field, 'error') || ''}
            />)
          // add the category dropdown in in 3rd position in input fields...  
         uiFields.splice(2, 0, <View key="categoryDropdown"><Text style={{ marginBottom: 10 }}>Category</Text><SafeAreaView key="dropDown" style={{ flex: 1 }}>
            
            <DropDownPicker
                listMode="SCROLLVIEW"
                open={dropdownOpen}
                multiple={true}
                placeholder="Select a category"
                setOpen={setDropdownOpen}
                value={selectedCategories}
                mode='BADGE'
                setValue={(val) => {
                    setSelectedCategories(val)
                    setDropdownOpen(false)
                }}
                // setItems={(newItems)=>{setFieldData({...fieldData,categories:{value:newItems}})}}
                searchable={true}
                items={parsedCategoryListForDropDown}
            />
        </SafeAreaView></View>)
         
        return uiFields
    }

    return <View style={styles.container}>
        <ScrollView>
            <Text style={styles.header}>Add Food</Text>
            {generateUIFields()}
            {/* function will create or update depends if a existed item is provided in route param... */}
            <CustomButton mode="contained" onPress={() => { createOrUpdateFood(route.params?.selectedItem?.key) }} title={route.params?.selectedItem ? 'Update' : 'Create'} />
        </ScrollView>
        <CustomSnackBar message={snackbarMsg} setMessage={setSnackbarMsg} />
    </View>
}
const styles = StyleSheet.create({
    container: {

        padding: 15,
        paddingBottom: 0,
    },
    searchbar: {
        alignSelf: 'center',
        margin: 5,
        borderRadius: 50
    },
    header: {
        alignSelf: 'center',
        fontSize: 29,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
})