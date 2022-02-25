import React, { useEffect, useState, useMemo } from 'react'
import database from '@react-native-firebase/database';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import TextInput from './common/TextInput';

import DropDownPicker from 'react-native-dropdown-picker';
import theme from './common/theme';
import CustomSnackBar from './common/CustomSnackBar';
import CustomButton from './common/CustomButton';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
const fields = {
    name: {},
    description: { multiline: true },
    'discount limit': { validation: /^[0-9]+$/, numberOnly: true },
    price: { validation: /^[0-9]+$/, numberOnly: true },
}
const refs = Object.keys(fields).map(_ => { return { ref: undefined } })
export default function ProductScreen({ route }) {
    const storageReference = storage()
    const reference = database().ref('/')
    const get = (key, fieldName = 'value') => fieldData[key] ? fieldData[key][fieldName] : undefined
    const [fieldData, setFieldData] = useState({})
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState(undefined)
    useEffect(() => {

        setFieldData({})
        // do not remove selected category list if selected item is already
        // provivded or else it will clear the category list of updating item
        if (!(route.params?.selectedItem)) {
            setSelectedCategories([])
        } else {
            setSelectedCategories(route.params?.selectedCategories)
        }

    }, [route.params?.selectedItem])

    const changeInputText = (key, text) => {
        setFieldData({ ...fieldData, [key]: { 'value': text } })
    }
    //for selecting image from gallery.....
    const selectImage = async () => {
        const results = await launchImageLibrary({ mediaType: 'photo' })
        if (results.didCancel) {
            return
        }
        //if user ever deprecate file access permission to the app....
        if (results.errorCode == 'permission') {
            setSnackbarMsg('Sorry permission is not granted to access files')
            return
        }
        //like normal input field data the uri of the local image is saved in fieldData object...
        setFieldData({ ...fieldData, 'image': { 'value': results.assets[0].uri } })
    }
    const createOrUpdateFood = (updateItemKey) => {
        if (validateFields(updateItemKey != undefined)) { //ignore checking empty fields if updating
            return
        }
        var parsedData = {}
        const imagePath = fieldData.image?.value
        for (const key in fieldData) {
            parsedData[key] = fields[key]?.numberOnly ? parseFloat(fieldData[key].value) : fieldData[key].value
        }
        delete parsedData.image //safely delete 'image' attribute to prevent it from written into
        //firebase database....
        parsedData.categories = selectedCategories //unwrapping the parameter
        if (updateItemKey) { //update mode...
            reference.child('food').child(updateItemKey).update(parsedData, async () => {
                if (imagePath) // update image only if user have provided a one....
                    await storageReference.ref('foodImages/' + updateItemKey).putFile(imagePath)
                setSnackbarMsg('Product has successfully updated')
            })
        }
        else { // create mode...
            let newRef = reference.child('food').push(parsedData, async () => {
                await storageReference.ref('foodImages/' + newRef.key).putFile(imagePath)
                setSnackbarMsg('Product has successfully created')
            })
        }

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
        
        if (!ignoreEmptyFields && !get('image')) {
            setSnackbarMsg('Should select a product image')
            //instantly failed the validation and no need to
            //update errorFields when user not provided a image only on create mode - when
            //ignoreEmptyFields is false
            return true
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
    const parsedCategoryListForDropDown = useMemo(() => categories.map(category => { return { value: category, label: category } }), [categories])
    const generateUIFields = () => {
        var uiFields =
            //pop() called to remove last 'image' field as it is not text input field...
            Object.keys(fields).map((field, index) => <TextInput
                key={index}
                description={field}
                label={field}
                keyboardType={fields[field].numberOnly ? "decimal-pad" : "default"}
                innerRef={(input) => refs[index].ref = input}
                onSubmitEditing={() => {
                    if (index < refs.length - 1)
                        refs[index + 1].ref.focus()
                }}
                defaultValue={route.params?.selectedItem ? route.params.selectedItem[field] : undefined}
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
        //add image field.....
        //if either field data or route params have image use it for source props....
        //if user haven't picked a image then fieldData['image']?.value would be undefined and
        //original image of the product is should be shown given by route.params (if the product is updating)
        uiFields.push(
            useMemo(() => route.params?.selectedItem.image || fieldData['image']?.value ?
                <Image key="uploadImg" source={{ uri: fieldData['image']?.value || route.params?.selectedItem.image }}
                    style={{ width: 200, height: 200 }} /> : null, [fieldData['image']?.value, route.params?.selectedItem.image]
            )
        )
        return uiFields
    }

    return <View style={styles.container}>
        <ScrollView>
            <Text style={styles.header}>Add Food</Text>
            {generateUIFields()}
            <CustomButton title="Select a Image" mode="outlined" onPress={selectImage} buttonStyle={{ marginVertical: 10 }} />
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