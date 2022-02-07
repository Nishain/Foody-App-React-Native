import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import TextInput from './common/TextInput';

import DropDownPicker from 'react-native-dropdown-picker';
import theme from './common/theme';
import CustomSnackBar from './common/CustomSnackBar';
import CustomButton from './common/CustomButton';
import { useMemo } from 'react/cjs/react.development';

export default function ProductScreen({ route }) {
    const fields = {
        name: {},
        description: { multiline: true },
        'discount limit': { validation: /^[0-9]+$/, numberOnly: true },
        price: { validation: /^[0-9]+$/, numberOnly: true }
    }
    const reference = database().ref('/')
    const get = (key, fieldName = 'value') => fieldData[key] ? fieldData[key][fieldName] : undefined
    const [fieldData, setFieldData] = useState({})
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState(route.params?.selectedCategories || [])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState(undefined)

    useEffect(()=>{
        setFieldData({})
        setSelectedCategories([])
    },[route.params?.selectedItem])

    const changeInputText = (key, text) => {
        setFieldData({ ...fieldData, [key]: { 'value': text } })
    }
    const createOrUpdateFood = (updateItemKey) => {
        if (validateFields(updateItemKey != undefined)) //ignore checking empty fields if updating
            return
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
                if (ignoreEmptyFields) {
                    if (fieldData[field]) //case if user entered a empty string to input discard it as undefined
                        fieldData[field] = undefined
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
        if (!validationFailed && parseFloat(get('discount limit')) <= 100) { //if discount field in correct data type but out of range
            setFieldData({ ...fieldData, 'discount limit': { error: 'Discount must be with range of 100' } })
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
                defaultValue={route.params?.selectedItem ? route.params.selectedItem[field] : undefined}
                returnKeyType={index == (fields.length - 1) ? 'done' : 'next'}
                onChangeText={(text) => { changeInputText(field, text) }}
                error={get(field, 'error')}
                multiline={fields[field].multiline}
                errorText={get(field, 'error') || ''}
            />)
         uiFields.splice(2, 0, <><Text style={{ marginBottom: 10 }}>Category</Text><SafeAreaView key="dropDown" style={{ flex: 1 }}>
            
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
        </SafeAreaView></>)
         
        return uiFields
    }

    return <View style={styles.container}>
        <ScrollView>
            <Text style={styles.header}>Add Food</Text>
            {generateUIFields()}
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