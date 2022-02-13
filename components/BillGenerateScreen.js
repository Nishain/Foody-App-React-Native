import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, ScrollView, FlatList, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CartContext from "./contexts/CartContext";
import CustomButton from "./common/CustomButton";
import FileViewer from "react-native-file-viewer";
import CustomSnackBar from "./common/CustomSnackBar";
import KeyValueText from "./common/KeyValueText";
import TextInput from "./common/TextInput";
import theme from "./common/theme";
import helper from './common/helper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import template from './assets/template'
import { useMemo } from "react/cjs/react.development";
import defaultLogo from './assets/empty_logo.png'
import TestObject from "./common/TestObject";
// import template from './template.html'
var orderUniqueCode = helper.generateCode(10);

const fields = [
    { name: 'Bill Code', disabled: true, value: orderUniqueCode },
    { name: 'Order Date', disabled: true, value: new Date().toISOString().split('T')[0] },
    'Customer Name', { name: 'Tax Price', expense: true }, { name: 'Transport Price', expense: true },
    { name: 'Additional Price', expense: true },
    'Restrurant Name', { name: 'Note', multiline: true, nonMandatory: true },
    {name : 'Contact Details', validation : /^[0-9]{10}$/}, { name: 'Address', multiline: true }]

//pending list of references of upcoming input fields....    
const refs = fields.map(_=> { return { ref : undefined } })
export default function BillGenerateScreen({ navigation,route }) {
    const reference = database().ref('/history/')
    
    
    //manadatory to keep companyLogo as the first element in companyDetailsFields array
    const companyDetailsFields = ['companyLogo', 'name', 'address', 'contact']
    const fieldToIncludeOnBillHistory = ['Bill Code', 'Order Date', 'Customer Name'] //total price is automatically added...
    const [fieldValues, setFieldValues] = useState({})
    const [snackBarMsg, setSnackbarMsg] = useState(undefined)
    const [companyDetails, setCompanyDetails] = useState({})
    const [isEditingCompanyDetails, setIsEditingCompanyDetails] = useState(false)
    const cartContext = useContext(CartContext)
    const changeInputText = (key, value) => {
        setFieldValues({ ...fieldValues, [key]: { 'value': value } })
    }
    

    useEffect(() => {
        readCompanyDetailFromStore()
    }, [])
     
    const get = (key, fieldType = 'value') => {
        return fieldValues[key] ? fieldValues[key][fieldType] : undefined
    }
    const validateFields = () => {
        const errorFields = {}
        var validationError = false
        for (const fieldProperties of fields) {
            if (fieldProperties.nonMandatory || fieldProperties.disabled) //ignore checking fields with these properties....
                continue
            let fieldName = typeof fieldProperties == 'object' ? fieldProperties.name : fieldProperties

            if ((fieldValues[fieldName] ? fieldValues[fieldName].value || '' : '') == '') {
                validationError = true
                errorFields[fieldName] = { error: `${fieldName} should not be empty` }

            } else if ((fieldProperties.expense && isNaN(fieldValues[fieldName].value)) //check if expense field in correct numerical format
                //or check against given regex validation expression given by preoprty 'validation'    
                || (fieldProperties.validation && !fieldValues[fieldName].value.match(fieldProperties.validation))) {
                validationError = true
                errorFields[fieldName] = { error: `Enter a valid value for ${fieldName}` }
            }
        }
        if (validationError) {
            setFieldValues({ ...fieldValues, ...errorFields })
        }
        return validationError
    }
    const calculateTotalPrice = useMemo(()=>{
        const intialPrice = cartContext.cart.reduce((totalPrice, cartItem) => {
            totalPrice += (cartItem.price * cartItem.quantity) - (cartItem.price * ((cartItem.discount || 0) / 100))
            return totalPrice
        }, 0.0)
        //extra price calculation .... all fields which are marked { expense : true } will be added
        const utilityPrice = fields.reduce((totalUtitilityCost, fieldProperties) => {
            if (fieldProperties.expense && fieldValues[fieldProperties.name]) { //check if the field is expense field
                if (isNaN(fieldValues[fieldProperties.name].value))
                    return totalUtitilityCost // do not process if user had made a validation error...
                return totalUtitilityCost + parseFloat(fieldValues[fieldProperties.name].value)
            } else
                return totalUtitilityCost //do not make a change to price when reading non-expense field
        }, 0)
        return intialPrice + utilityPrice
    },[cartContext.cart,fieldValues])

    const generateBill = async () => {
        //refre
        
        if (Object.keys(companyDetails).length != (companyDetailsFields.length)) {
            setSnackbarMsg('You should first give all company details first!')
            return
        }
        if (cartContext.cart.length == 0) {
            setSnackbarMsg('Your cart is empty.Please add items to your cart')
            return
        }
        if (cartContext.cartErrorCount > 0) {
            setSnackbarMsg('there are some conflicts in cart.Please resolve them first')
            return
        }
        if (validateFields()){
            setSnackbarMsg('please check your fields')
            return
        }
        const primaryData = {}
        for (const fieldProperties of fields) {
            if (typeof fieldProperties == 'string' && fieldToIncludeOnBillHistory.includes(fieldProperties))
                primaryData[helper.makeCodingFriendly(fieldProperties)] = fieldValues[fieldProperties].value
            else if (fieldToIncludeOnBillHistory.includes(fieldProperties.name))
                primaryData[helper.makeCodingFriendly(fieldProperties.name)] = fieldProperties.value || fieldValues[fieldProperties.name].value
        }
        const purchaseDateTime = new Date().toUTCString()
        const dataToSubmit = {
            ...primaryData,
            totalPrice: calculateTotalPrice,
            purchasedTime : purchaseDateTime,
            cart: cartContext.cart.map(cartItem => {
                return {
                    name: cartItem.name,
                    quantity: cartItem.quantity,
                    discount: cartItem.discount || 0,
                    price: cartItem.price,

                }
            })
        }
        const pdfData = {
            primaryInfo: {
                ...fields.reduce((obj, fieldProperties) => {
                    if (typeof fieldProperties == 'string')
                        return { ...obj, [fieldProperties]: get(fieldProperties) }
                    else{
                        if(!get(fieldProperties.name)) //if value is undefined.only possible if field is marked { nonMandatory : true }
                            return obj
                        return { ...obj, [fieldProperties.name]: fieldProperties.value || get(fieldProperties.name) }
                    }
                }, {}),
                purchasedTime : purchaseDateTime,
            },
            'Total Price': dataToSubmit.totalPrice,
            cart: dataToSubmit.cart,
            companyDetails: companyDetails
        }
        
        const renderedTemplate = helper.mapToHTMLTemplate({
            cart: helper.populateArrayToHTML('cart', template, pdfData.cart),
            primaryData: helper.populateArrayToHTML('primaryData', template, Object.keys(pdfData.primaryInfo).map(key => {
                return {
                    'key': key,
                    'value': pdfData.primaryInfo[key]
                }
            })),
            totalPrice: pdfData['Total Price'],
            contactDetail: helper.populateSingleHTMLSection('contactDetail', template, companyDetails)
        }, template)
        let pdfGeneratorOptions = {
            html: renderedTemplate,
            fileName: 'Bill',
            directory: 'Documents',
        }
        let file = await RNHTMLtoPDF.convert(pdfGeneratorOptions)
        setSnackbarMsg(`File Created successfully on ${file.filePath}`)
        //this is a trick to trigger clear input fields....
        //value of clearText needs to change its value.
        //clearText simply toggle to 2 kinds of emptyness - undefined and \0
        // Note "\0" is used instead of "" beacuse "" is ignored by TextField as default value...
        //then finally self re-direct to same screen
        navigation.jumpTo('Generate Bill',{clearText : route.params?.clearText == "\0" ? undefined : "\0" })
        reference.push(dataToSubmit, () => {
            //refresh bill code for the next bill....
            orderUniqueCode = helper.generateCode(10);
            //clearing the data
            cartContext.setCart([])
            setFieldValues({})
            FileViewer.open(file.filePath).catch(err=>{
                console.log(err)
            })
            
        })//application/pdf

    }
    //intially the page will load company information from local storage....
    const readCompanyDetailFromStore = async () => {

        const details = await AsyncStorage.multiGet(companyDetailsFields)
        //simply convert [[key1,val1],[key2,val2]] to { key1 : val1, key2 : val2 } format....
        const formatedDetails = details.reduce((obj, keyPair) => {
            return keyPair[1] != null ? {//ignore object attribute concadenation if property is null....
                ...obj,
                [keyPair[0]]: keyPair[1]
            } : obj
        }, {})
        setCompanyDetails(formatedDetails)
    }
    const saveCompanyDetails = async () => {
        const allFields = companyDetailsFields
        //check if all fields are not undefined by chaining boolean conditions...
        if (!isAllCompanyDetailsProvided()) {
            setSnackbarMsg('Some of organization details missing')
            return
        }

        for (const fieldName of allFields) {
            await AsyncStorage.setItem(fieldName, companyDetails[fieldName])
        }
        setIsEditingCompanyDetails(false)
    }
    const changeCompanyDetails = (key, text) => {
        if(text.length == 0){
            delete companyDetails[key]
            setCompanyDetails({...companyDetails})
        }
        else    
            setCompanyDetails({ ...companyDetails, [key]: text })
    }
    const selectImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: true })
        if (result.didCancel) {
            return
        }
        //if user ever deprecate file access permission to the app....
        if (result.errorCode == 'permission') {
            setSnackbarMsg('Sorry permission is not granted to access files')
            return
        }
        setCompanyDetails({ ...companyDetails, 'companyLogo': 'data:image/png;base64,' + result.assets[0].base64 })
    }

    

    const getTotalDiscountedAmount = useMemo(() => 
             cartContext.cart.reduce((totalValue,cartItem) => totalValue + (cartItem.price * ((cartItem.discount || 0) / 100) )
            ,0),[cartContext.cart])

    const generatePrimaryInfoInput = useMemo(()=>fields.map((fieldParam, index) => {
        const field = typeof fieldParam == 'object' ? fieldParam.name : fieldParam
        
        return <TextInput
            key={index}
            editable={fieldParam.disabled}
            defaultValue={route.params?.clearText}
            keyboardType={fieldParam.expense ? "numeric" : "default"}
            innerRef={(input)=>refs[index].ref = input}
            onSubmitEditing={()=>{
              if(index < refs.length - 1)  
                refs[index + 1].ref.focus()
            }}
            //add value prop if a value is given
            {...fieldParam.value ? { 'value': fieldParam.value } : null}
            description={field}
            // don't give label to textBox of field is disabled
            {... !fieldParam.disabled ? { 'label': field } : null}
            multiline={fieldParam.multiline}
            returnKeyType={index == (fields.length - 1) ? "done" : 'next'}
            onChangeText={(text) => changeInputText(field, text)}
            error={get(field, 'error')}
            errorText={get(field, 'error') || ''}
        />
    }),[fieldValues])

    const navigateToCart = () => { navigation.jumpTo('cart') }
    const isAllCompanyDetailsProvided = () => Object.keys(companyDetails).length == (companyDetailsFields.length)
    //check if all atrributes are present...
    const generateCompanyDetails = useMemo(()=>isAllCompanyDetailsProvided() ? <>
        <View style={{ alignItems: 'flex-end' }}>
            {companyDetails['companyLogo'] && <Image source={{ uri: companyDetails['companyLogo'] }} height={150} width={150}
                style={styles.logoImageBill} />}
            <Text style={theme.darkFont}>{companyDetails.name}</Text>
            <Text style={theme.darkFont}>{companyDetails.address}</Text>
            <Text style={theme.darkFont}>{companyDetails.contact}</Text>
        </View>
        <CustomButton title="Edit" mode="outlined" onPress={() => { setIsEditingCompanyDetails(true) }} />
    </> : <>
        <Text style={{color : 'black' , textAlign:'center'}}>Some Company details are missing</Text>
        <CustomButton title="Edit" mode="outlined" onPress={() => { setIsEditingCompanyDetails(true) }} /></>,[companyDetails])
    const CompanyLogoInput = () => 
    companyDetails['companyLogo'] ? <Image source={{ uri: companyDetails['companyLogo'] }} height={150} width={150} style={styles.logoImageInput} /> :
        <View>
            <Image source={defaultLogo} height={150} width={150} style={styles.logoImageInput} />
            <Text style={{ color: 'red', alignSelf: 'stretch', textAlign: 'center' }}>Missing Image</Text>
        </View>
    
    const CompanyDetailsInputForm = useMemo(()=>
        //start from index 1 because companyDetailsFields[0] is not a textInput
        companyDetailsFields.slice(1).map(inputField => <TextInput
        key={inputField}
        label={inputField}
        defaultValue={companyDetails[inputField]}
        error={!companyDetails[inputField]}
        errorText={!companyDetails[inputField] ? `${inputField} is missing` : undefined}
        description={`Company ${inputField}`}
        onChangeText={(text) => { changeCompanyDetails(inputField, text) }} />)
    ,[companyDetails])

    //main render function.....    
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Bill Generate</Text>
        <ScrollView>
            {generatePrimaryInfoInput}
            <View style={styles.companyDetails}>
                <View style={{ flex: 1 }}>
                    <Text style={theme.foodTitle}>Total Amount</Text>
                    <View style={theme.underline} />
                    <Text style={theme.foodTitle}>{`Rs ${calculateTotalPrice}\nDiscount ${getTotalDiscountedAmount}`}</Text>
                    <CustomButton title="See cart" mode="contained" onPress={navigateToCart} />
                </View>
                <View style={{ flex: 1, marginHorizontal : 10, alignItems: 'stretch' }}>
                    {generateCompanyDetails}
                </View>
            </View>
            <CustomButton buttonStyle={{ marginTop: 7 }} title="Generate" onPress={generateBill} mode="contained" />


        </ScrollView>
        {/* the company modal prompt.... */}
        <Modal visible={isEditingCompanyDetails} transparent={true} >
            <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, marginBottom: -30 }} onPress={() => { setIsEditingCompanyDetails(false) }} />

            <View style={styles.companyDetailsModalContent}>
                <Text style={{ color: 'black', fontSize: 25, textAlign: 'center' }}>Company Details</Text>
                <CompanyLogoInput />
                {/* remove companyLogo  when rendering input fields in a copy array*/}
                {CompanyDetailsInputForm}
                <CustomButton title="Select Logo Image" onPress={selectImage} mode="outlined" />
                <CustomButton buttonStyle={{ marginTop: 10 }} disabled={!isAllCompanyDetailsProvided()} title="Save" onPress={saveCompanyDetails} mode="contained" />
            </View>
        </Modal>
        <CustomSnackBar message={snackBarMsg} setMessage={setSnackbarMsg} />
    </View>
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 15
    },
    logoImageInput: {
        height: 150,
        width: 150,
        borderRadius: 10,
        alignSelf: 'center'
    },
    logoImageBill : {
        height: 150,
        width: 150,
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
    companyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    companyDetailsModalContent: {
        flex: 0,
        justifyContent: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10
    }
})