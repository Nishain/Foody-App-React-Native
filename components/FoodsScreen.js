import React, { useContext, useEffect, useMemo, useRef } from "react"
import { useState } from "react"
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native"
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
import storage from '@react-native-firebase/storage';

export default function FoodBrowseScreen({ navigation }) {
    const reference = database().ref('/food/')
    const [searchCriteria, setSearchCriteria] = useState(undefined)
    const [data, setData] = useState([])
    //need to maintain persistant reference pointer to 'data' state variable so
    //that even old frozen function decalared in previous render can access fresh data in the
    //state variable in current render therefore dataGlobalReference is defined....
    const dataGlobalReference = useRef()
    //need to update dataGlobalReference in each render with fresh data elimate old data in previous render...
    dataGlobalReference.current = data
    const cartContext = useContext(CartContext)
    const isAdmin = useContext(UserRoleContext).isAdmin
    const [snackBarMsg, setSnackbarMsg] = useState(undefined)
    const storageRefernce = storage()
    const addItem = (item, key) => {

        const cartItem = cartContext.cart.find(itm => key == itm.key)
        if (cartItem)
            cartItem.quantity = (cartItem.quantity || 0) + 1 //if for the first time then quantity incremented from 0 if 
        //quantity undefined
        else
            cartContext.cart.push({ ...item, cartQuantity: undefined, quantity: 1 })
        cartContext.setCart([...cartContext.cart])
    }

    useEffect(() => {

        reference.on('value', async (snapshot) => {
            const newData = []
            const dbData = snapshot.val()
            for (const keyID in dbData) {
                newData.push({ ...dbData[keyID], key: keyID })
            }

            setData(newData)
        })
    }, [])
    const requestDeleteConformation = (key, itemName) => {
        Alert.alert("Are you sure you want to delete ?",
            `Do you want to delete ${itemName} permanantly from store`,
            [
                {
                    text: 'cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes Delete', onPress: async () => {
                        await storageRefernce.ref('foodImages/' + key).delete()
                        reference.child(key).remove(() => setSnackbarMsg('successfully removed food item'))

                    },
                    style: 'destructive'
                }
            ], { cancelable: true })
    }
    const updateItem = (item) => {
        //extract the details of the updating item....
        const selectedItem = { ...item }
        for (const key in selectedItem) {
            //if the field is number convert to string
            if (typeof selectedItem[key] == 'number')
                selectedItem[key] = selectedItem[key].toString()
        }
        navigation.jumpTo('createFood', { selectedItem: selectedItem, selectedCategories: item.categories })
    }
    //onItemsVisibile function is requried not to remain constant and not re-declared in each re-render
    //because onViewableItemsChanged prop in Flatlist specified the function argument should not be 
    //changed on the fly...
    const onItemsVisibile = useRef(async ({ viewableItems }) => {
        for (const viewwableItem of viewableItems) {
            if (typeof viewwableItem.item.image == 'string')
                continue
            viewwableItem.item.image = ''
            storageRefernce.ref('foodImages/' + viewwableItem.item.key).getDownloadURL().then(url => {
                viewwableItem.item.image = url
                setData([...dataGlobalReference.current])
            }, errorReason => {
                // console.log(errorReason)
            })
        }
    })

    const renderItem = (value) => {
        const item = value.item
        const cartItem = cartContext.cart.find(cartItem => cartItem.key == item.key)
        return <CustomCard>

            <View style={{ flex: 1 }}>
                {/* render image only if image url string is not empty */}
                {((item.image || '') != '') && <Image source={{ uri: item.image }} style={styles.foodImage} />}
                <View style={{flexDirection : 'row',justifyContent : 'space-between'}}>
                    <View>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <Text style={theme.foodTitle}>{item.name}</Text>
                            <View style={theme.underline} />
                        </View>

                        <KeyValueText description="Description" value={item.description} isVerical />
                        <KeyValueText description='Price' value={item.price} />
                        {/* <KeyValueText description="Categories" value={item['categories'].join(',')} /> */}
                        <View style={styles.chipContainer}>
                            {item['categories'].map(category => <Text key={category} style={styles.chip}>{category}</Text>)}
                        </View>
                        <CustomButton onPress={() => { addItem(item, item.key) }} title="add To Cart" mode="contained" buttonStyle={{ alignSelf: 'flex-start' }} >
                            {cartItem && <View style={styles.cartCountCaption}>
                                <Text style={{ color: theme.colors.primary }}>{cartItem.quantity}</Text>
                            </View>}
                        </CustomButton>
                    </View>
                    {isAdmin && <View style={styles.itemIconContainer}>
                        <Icon name="edit" size={25} color={theme.colors.primary} onPress={() => { updateItem(item) }} />
                        <Icon style={styles.deleteButton} onPress={() => { requestDeleteConformation(item.key, item.name) }} name='trash-o' size={25} color={'red'} />

                    </View>}
                </View>
            </View>

        </CustomCard>
    }
    //avoid re-rendering data if only snackBar message is updated...
    const getSearchFilteredData = () => useMemo(() => searchCriteria ? data.filter(val => val.name.toLowerCase().includes(searchCriteria.toLowerCase())) : data, [searchCriteria, data])
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Browse Food</Text>
        <CustomSearchBar placeholder='Search item' onSearch={setSearchCriteria} />
        <FlatList data={getSearchFilteredData()} renderItem={renderItem}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50
            }}
            onViewableItemsChanged={onItemsVisibile.current} />
        <CustomSnackBar message={snackBarMsg} setMessage={setSnackbarMsg} />
    </View>
}
const styles = StyleSheet.create({

    container: {
        height: '100%',
    },
    cartCountCaption: {
        alignItems: 'center',
        marginLeft: 10,
        padding: 5,
        borderRadius: 100,
        backgroundColor: 'white'
    },
    itemIconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    chip: {
        textAlign: 'center',
        color: 'white',
        width: 'auto',
        backgroundColor: theme.colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 15,
        padding: 5,
        margin: 5
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    foodImage: {
        width : '100%',
        height: 200,
        marginRight: 10,
        borderRadius: 5
    },
    deleteButton: {
        // height: 50,
        borderRadius: 50,
        backgroundColor: '#F5B5A8',
        marginLeft: 10,
        alignItems: 'center',
        padding: 10,
        // aspectRatio: 1
    }
})