import React, { useContext, useEffect } from "react"
import { useState } from "react"
import { Alert, FlatList, StyleSheet, Text, View } from "react-native"
import CustomButton from "./common/CustomButton"
import CustomCard from "./common/CustomCard"
import KeyValueText from "./common/KeyValueText"
import CustomSearchBar from "./common/SearchBar"
import theme from "./common/theme"
import database from '@react-native-firebase/database';
import CartContext from "./contexts/CartContext"
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomSnackBar from "./common/CustomSnackBar"
import UserRoleContext from "./contexts/UserRoleContext"
import { useMemo } from "react/cjs/react.development"

export default function FoodBrowseScreen({navigation}) {
    const reference = database().ref('/food/')
    const [searchCriteria,setSearchCriteria] = useState(undefined)
    const [data, setData] = useState([])
    const cartContext = useContext(CartContext)
    const isAdmin = useContext(UserRoleContext).isAdmin
    const [snackBarMsg,setSnackbarMsg] = useState(undefined)
    const addItem = (index,key) => {
  
        const cartItem = cartContext.cart.find(itm => key == itm.key)
        if(cartItem)
            cartItem.quantity = (cartItem.quantity || 0) + 1 //if for the first time then quantity incremented from 0 if 
            //quantity undefined
        else
            cartContext.cart.push({...data[index],cartQuantity : undefined,quantity : 1})
        cartContext.setCart([...cartContext.cart])    
    }   
   
    useEffect(()=>{
        
        reference.on('value',(snapshot)=>{
            const newData = []
            const dbData = snapshot.val()
            for(const keyID in dbData){
                newData.push({...dbData[keyID],key : keyID})
            }
            setData(newData)
        })
    },[])
    const requestDeleteConformation = (key,itemName) => {
        Alert.alert("Are you sure you want to delete ?",
        `Do you want to delete ${itemName} permanantly from store`,
        [
            {
                text : 'cancel',
                style : 'cancel'
            },
            {
                text : 'Yes Delete' , onPress : ()=>{
                    reference.child(key).remove(()=>setSnackbarMsg('successfully removed food item'))
                }, 
                style :'destructive'
            }
        ],{ cancelable : true })
    }
    const updateItem = (item) => {
        const selectedItem = item
        for(const key in selectedItem){
            if(typeof selectedItem[key] == 'number')
                selectedItem[key] = selectedItem[key].toString()
        }
        navigation.jumpTo('createFood',{ selectedItem : selectedItem, selectedCategories : item.categories })
    }
    const renderItem = (value) => {
        const item = value.item
        const cartItem = cartContext.cart.find(cartItem => cartItem.key == item.key)
        return <CustomCard>
            <View>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={theme.foodTitle}>{item.name}</Text>
                    <View style={theme.underline} />
                </View>
                <KeyValueText description="Description" value={item.description} isVerical />
                <KeyValueText description='Price' value={item.price} />
                <View style={styles.chipContainer}>
                    {item['categories'].map(category=><Text key={category} style={styles.chip}>{category}</Text>)}
                </View>
                <CustomButton onPress={()=>{addItem(value.index,item.key)}} title="add To Cart" mode="contained" buttonStyle={{alignSelf :'flex-start'}} >
                    {cartItem && <View style={styles.cartCountCaption}>
                        <Text style={{color : theme.colors.primary}}>{cartItem.quantity}</Text>
                    </View>}
                </CustomButton>
            </View>
            { isAdmin &&<View style={styles.itemIconContainer}>
                <Icon name="edit" size={25} color={theme.colors.primary} onPress={()=>{updateItem(item)}}/>
                <Icon style={styles.deleteButton} onPress={() => { requestDeleteConformation(item.key,item.name) }} name='trash-o' size={25} color={'red'} />
                
            </View>}
        </CustomCard>
    }
    //avoid re-rendering data if only snackBar message is updated...
    const getSearchFilteredData = () => useMemo(()=>searchCriteria ? data.filter(val=>val.name.toLowerCase().includes(searchCriteria.toLowerCase())) : data,[searchCriteria,data])

    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Browse Food</Text>
        <CustomSearchBar placeholder='Search item' onSearch={setSearchCriteria}/>
        <FlatList data={getSearchFilteredData()} renderItem={renderItem} />
        <CustomSnackBar message={snackBarMsg} setMessage={setSnackbarMsg}/>
    </View>
}
const styles = StyleSheet.create({

    container: {
        height: '100%',
    },
    cartCountCaption : {
        alignItems : 'center',
        marginLeft : 10,
        padding : 5,
        borderRadius : 100,
        backgroundColor : 'white'
    },
    itemIconContainer : {
        flexDirection : 'row',
        alignItems : 'center'
    },
    chip : {
        textAlign : 'center',
        color : 'white',
        width : 'auto',
        backgroundColor : theme.colors.placeholder,
        borderRadius : 10,
        paddingHorizontal : 15,
        padding : 5,
        margin : 5
    },
    chipContainer : {
        flexDirection : 'row',
        flexWrap : 'wrap'
    },
    deleteButton : {
        // height: 50,
        borderRadius: 50,
        backgroundColor: '#F5B5A8',
        marginLeft : 10,
        alignItems: 'center',
        padding: 10,
        // aspectRatio: 1
    }
})