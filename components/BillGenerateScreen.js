import React, { useState } from "react";
import { StyleSheet,View,Text, Button, Image, ScrollView } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import CustomSnackBar from "./common/CustomSnackBar";
import TextInput from "./common/TextInput";
import theme from "./common/theme";

export default function BillGenerateScreen (){
    const fields = ['Tax Price','Transport Price','Restrurant Name','Contact Details',{name : 'Address' , multiline : true}]
    const [fieldValues,setFieldValues] = useState({})
    const [snackBarMsg,setSnackbarMsg] = useState(undefined)
    const changeInputText = (key,value) => {
        setFieldValues({...fieldValues,[key] : {'value' : value}})
    }
    const selectImage = async () => {
        const result = await launchImageLibrary({mediaType : 'photo'})
        if(result.didCancel){
            console.log('user has cancelled it')
            return
        }
        if(result.errorCode == 'permission'){
            setSnackbarMsg('Sorry permission is not granted to access files')
            return
        }    
        console.log('image selected '+result.assets[0].uri)
        setFieldValues({...fieldValues,'imagelogo' : {'value' : result.assets[0]}})    
    }
    const get = (key,fieldType = 'value') => { 
        const formatedKey = key.toLowerCase().replace(' ','')
        if(key.includes('logo')){
            console.log(formatedKey)
            if(!fieldValues[formatedKey])
                return undefined
            console.log(fieldValues[formatedKey]['value'])
        }
        return fieldValues[formatedKey] ? fieldValues[formatedKey][fieldType] : undefined
     }
    return <View style={styles.container}>
        <ScrollView>
        <Text style={theme.headerStyle}>Bill Generate</Text>
        {fields.map((fieldParam,index)=>{
        const field = typeof fieldParam == 'object' ? fieldParam.name : fieldParam
        return <TextInput 
        key={index}
         description={field}
         label={field}
         multiline={fieldParam.multiline}
         returnKeyType={index == (fields.length -1) ? "next" : 'done'}
         onChangeText={(text) => changeInputText(field.toLowerCase().replace(' ',''), text)}
         error={get(field,'error')}
         errorText={get(field,'error') || ''}
         /> }
         )}
         <Image source={get('image logo')} />
         <Button title="Select Image" onPress={selectImage}/>
         <Button title="Generate" />
         <CustomSnackBar message={snackBarMsg} setMessage={setSnackbarMsg} />
         </ScrollView>
    </View>
}
const styles = StyleSheet.create({
    container : {
        height : '100%',
        padding : 15
    }
})