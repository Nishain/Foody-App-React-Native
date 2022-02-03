import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, ScrollView, FlatList, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CartContext from "./CartContext";
import CustomButton from "./common/CustomButton";
import CustomCard from "./common/CustomCard";
import CustomSnackBar from "./common/CustomSnackBar";
import KeyValueText from "./common/KeyValueText";
import TextInput from "./common/TextInput";
import theme from "./common/theme";
import helper from './common/helper'
import bcrypt from 'bcryptjs'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function BillGenerateScreen() {
    const orderUniqueCode = helper.generateCode(10)
    const fields = [
        { name: 'Bill Code', disabled: true, value: orderUniqueCode },
        { name: 'Order Date', disabled: true, value: new Date().toDateString() },
        'Customer Name', { name: 'Tax Price', validation: /^[0-9]+$/ }, { name: 'Transport Price', validation: /^[0-9]+$/ },
        'Restrurant Name', { name: 'Note', multiline: true, nonMandatory: true },
        'Contact Details', { name: 'Address', multiline: true }]
    //manadatory to keep companyLogo as the first element in companyDetailsFields array
    const companyDetailsFields = ['companyLogo','name', 'address', 'contact','signature']
    const [fieldValues, setFieldValues] = useState({})
    const [snackBarMsg, setSnackbarMsg] = useState(undefined)
    const [billSignature,setBillSignature] = useState(undefined)
    const [companyDetails, setCompanyDetails] = useState({})
    const [isEditingCompanyDetails, setIsEditingCompanyDetails] = useState(false)
    const changeInputText = (key, value, isCompanyFields = false) => {
        if (!isCompanyFields)
            setFieldValues({ ...fieldValues, [key]: { 'value': value } })
        else
            setCompanyDetails({ ...companyDetails, [key]: { 'value': value } })
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

            } else if (fieldProperties.validation && !fieldValues[fieldName].value.match(fieldProperties.validation)) {
                validationError = true
                errorFields[fieldName] = { error: `Enter a valid value for ${fieldName}` }
            }
        }
        if (validationError) {
            setFieldValues({ ...fieldValues, ...errorFields })
        }
        return validationError
    }
    const generateBill = () => {
        if (validateFields())
            return
        setSnackbarMsg('Bill Created')
    }
    const cartRenderer = (value) => {
        const item = value.item
        return <CustomCard>
            <View>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={theme.foodTitle}>{item.name}</Text>
                    <View style={theme.underline} />
                </View>
                <KeyValueText description="Description" value={item.description} isVerical />
                <KeyValueText description='Price' value={item.price} />
                <TextInput placeholder="Tax amount" />
            </View>
        </CustomCard>
    }
    const readCompanyDetailFromStore = async () => {

        const details = await AsyncStorage.multiGet(companyDetailsFields)
        //simply convert [[key1,val1],[key2,val2]] to { key1 : val1, key2 : val2 } format....
        const formatedDetails = details.reduce((obj, keyPair) => {
            return keyPair[1] != null ? {
                ...obj,
                [keyPair[0]]: keyPair[1]//because null is not like false
            } : obj
        }, {})
        setCompanyDetails(formatedDetails)
    }
    const cartContext = useContext(CartContext)
    const saveCompanyDetails = async () => {
        const allFields = companyDetailsFields
        //check if all fields are not undefined by chaining boolean conditions...
        const isAllFieldsNonEmpty = allFields.reduce((previousVal,currentVal) => { return previousVal && currentVal },true)
        if(!isAllFieldsNonEmpty){
            console.log('some fields missing')
            setSnackbarMsg('Some of organization details missing')
            return
        }

        for (const fieldName of allFields) {
            await AsyncStorage.setItem(fieldName, companyDetails[fieldName])
        }
        setIsEditingCompanyDetails(false)
    }
    const changeCompanyDetails = (key, text) => {
        setCompanyDetails({ ...companyDetails, [key]: text })
    }
    const selectImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: true })
        if (result.didCancel) {
            console.log('user has cancelled it')
            return
        }
        if (result.errorCode == 'permission') {
            setSnackbarMsg('Sorry permission is not granted to access files')
            return
        }
        setCompanyDetails({ ...companyDetails, 'companyLogo': 'data:image/png;base64,' + result.assets[0].base64 })
    }
    const generateDigitalSignature = async (companySign)=>{
        const generatedSignature = await bcrypt.hash(orderUniqueCode,companySign)
        setBillSignature(generatedSignature)
    }
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Bill Generate</Text>
        {/* <FlatList data={cartContext.cart} renderItem={cartRenderer} /> */}
        <ScrollView>


            {fields.map((fieldParam, index) => {
                const field = typeof fieldParam == 'object' ? fieldParam.name : fieldParam
                return <TextInput
                    key={index}
                    disabled={fieldParam.disabled}
                    //add value prop if a value is given
                    {...fieldParam.value ? { 'value': fieldParam.value } : null}
                    description={field}
                    // don't give label to textBox of field is disabled
                    {... !fieldParam.disabled ? { 'label': field } : null}
                    multiline={fieldParam.multiline}
                    returnKeyType={index == (fields.length - 1) ? "next" : 'done'}
                    onChangeText={(text) => changeInputText(field, text)}
                    error={get(field, 'error')}
                    errorText={get(field, 'error') || ''}
                />
            }
            )}
            <View style={styles.companyDetails}>
                <View style={{flex : 1}}>
                    <Text style={theme.foodTitle}>Total Amount</Text>
                    <View style={theme.underline} />
                    <Text style={theme.foodTitle}>{'Rs ' + cartContext.cart.reduce((total, item) => total + item.price, 0)}</Text>
                </View>
                <View style={{flex : 1,marginLeft : 5,alignItems : 'stretch'}}>
                    {Object.keys(companyDetails).length == (companyDetailsFields.length) ? //check if all atrributes are present...
                        <>
                            <View style={{alignItems : 'flex-end'}}>
                            {companyDetails['companyLogo'] && <Image source={{ uri: companyDetails['companyLogo'] }} height={150} width={150}
                                style={styles.logoImage} />}
                            <Text>{companyDetails.name}</Text>
                            <Text>{companyDetails.address}</Text>
                            <Text>{companyDetails.contact}</Text>
                            </View>
                            <CustomButton title="Edit" mode="contained" onPress={() => { setIsEditingCompanyDetails(true) }} />
                        </> : <>
                            <Text>Some Company details are missing</Text>
                            <CustomButton  title="Edit" mode="contained" onPress={() => { setIsEditingCompanyDetails(true) }} /></>
                    }
                </View>
            </View>

            {companyDetails.signature && <KeyValueText key="Signature" value={billSignature}/>}
            <CustomButton buttonStyle={{marginTop : 7}} title="Generate" onPress={generateBill} mode="contained" />

            

        </ScrollView>
        <Modal visible={isEditingCompanyDetails} transparent={true} >
            <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, marginBottom: -30 }} onPress={() => { setIsEditingCompanyDetails(false) }} />

            <View style={styles.companyDetailsModalContent}>
                <Text style={{ color: 'black', fontSize: 25, textAlign: 'center' }}>Company Details</Text>
                {companyDetails['companyLogo'] ? <Image source={{ uri: companyDetails['companyLogo'] }} height={150} width={150} style={styles.logoImage} /> 
                    : <Text style={{color : 'red',alignSelf : 'stretch', textAlign : 'center'}}>Missing Image</Text>
                }
                {/* remove companyLogo  when rendering input fields in a copy array*/}
                {companyDetailsFields.slice(1).map(inputField => <TextInput
                    label={inputField}
                    error={!companyDetails[inputField]}
                    errorText={!companyDetails[inputField] ? `${inputField} is missing` : undefined}
                    description={`Company ${inputField}`}
                    onChangeText={(text) => { changeCompanyDetails(inputField, text) }} />)}
                <CustomButton title="Select Logo Image" onPress={selectImage} mode="outlined" />
                <CustomButton buttonStyle={{ marginTop: 10 }} title="Save" onPress={saveCompanyDetails} mode="contained" />
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
    logoImage : { 
        height: 150,
        width: 150,
        borderRadius: 10,
        alignSelf: 'center' 
    },
    companyDetails: {
        flexDirection : 'row',
        justifyContent : 'space-between'
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