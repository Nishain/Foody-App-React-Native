import React, { useContext, useState, useCallback, useMemo } from "react";
import { Button, FlatList, ScrollView, StyleSheet, Text, View, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import CustomSearchBar from "./common/SearchBar";
import theme from "./common/theme";
import Icon from 'react-native-vector-icons/FontAwesome'
import KeyValueText from "./common/KeyValueText";
import CustomCard from "./common/CustomCard";
import { SafeAreaView } from "react-native-safe-area-context";
import CartContext from "./contexts/CartContext";
import TextInput from "./common/TextInput";
import CustomButton from "./common/CustomButton";
export default function CategoryScreen({ navigation }) {


    const cartContext = useContext(CartContext)
    const [searchCriteria, setSearchCriteria] = useState(undefined)
    const [showDiscountDropdown, setDiscountDropdownVisisbility] = useState(false)
    const [discountDropdownData, setDiscountDropdownData] = useState({ list: [], selectedItem: undefined })
    const qtyChangeHandler = (mode, item) => {
        if (mode == 'remove' && item.quantity == 1)
            return
        item.quantity += mode == 'add' ? 1 : -1 // item is originally belong to cart variable so changes happens reflectively....
        cartContext.setCart([...cartContext.cart])
    }
    const removeItem = (key) => {
        const removeIndex = cartContext.cart.findIndex(itm => itm.key == key)
        //if removing item has a error, dismiss it as it being removed....
        if (cartContext.cart[removeIndex].error)
            cartContext.setCartErrorCount(cartContext.cartErrorCount - 1)
        cartContext.cart.splice(removeIndex, 1)
        cartContext.setCart([...cartContext.cart])
    }
    const changeDiscountAmount = (event, item) => {
        const text = event.nativeEvent.text
        if (text == "")
            item.discount = undefined
        else {
            const isNotValid = isNaN(text)
            item.discount = parseFloat(text)

            if (isNotValid || item.discount > item['discount limit']) {
                if (!item.error)
                    cartContext.setCartErrorCount(cartContext.cartErrorCount + 1)
                item.error = isNotValid ? 2 : 1 // 1 - out of discount limit error, 2 - not a number error
            }
            else if (item.error) {
                item.error = undefined
                cartContext.setCartErrorCount(cartContext.cartErrorCount - 1)
            }
        }
        cartContext.setCart([...cartContext.cart])
    }
    const renderDiscountItem = (value) => {
        return <TouchableOpacity onPress={() => { selectDicountDropdownVal(value.item) }}>
            <Text style={styles.discountDropdownItem}>{value.item} %</Text>
        </TouchableOpacity>
    }
    const navigateToGenerateBill = () => { navigation.jumpTo('Generate Bill') }
    const autoCloseOnComplete = (event) => {
        //upon user entering text of length 2 - upto 99
        //the field will automatically lose focus...
        if (event.nativeEvent.text.length == 2)
            event.currentTarget.getNativeRef().blur()
    }
    const openDropdown = (item) => {
        const dropDownItems = []
        const discountLimit = item['discount limit']
        for (let index = 0; index < discountLimit; index += 5) {
            dropDownItems.push(index)
        }
        dropDownItems.push(discountLimit) // add the discount limit itself as last possible
        //discount value.this should be added seperately from for loop in case if discount limit
        //is not divisible of 5....
        setDiscountDropdownData({
            list: dropDownItems.reverse(), // start in accensing order (bottom-to-top)
            selectedItem: item
        })
        setDiscountDropdownVisisbility(!showDiscountDropdown)
    }
    const selectDicountDropdownVal = (value) => {
        discountDropdownData.selectedItem.discount = value
        cartContext.setCart([...cartContext.cart])
        setDiscountDropdownVisisbility(false)
    }
    const renderItem = (value) => {
        const item = value.item
        return <CustomCard>
            <View>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={theme.foodTitle}>{item.name}</Text>
                    <View style={theme.underline} />
                </View>
                <KeyValueText description="Description" value={item.description} isVerical />
                <KeyValueText description='Price' value={item.price} />
                <KeyValueText description='Discount limit' value={item['discount limit']} />
                <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start' }}>
                    <TextInput containerStyle={{ flex: 1 }} description="Discount (%)" placeholder="Discount %" keyboardType='number-pad' maxLength={2}
                        innerRef={(input) => input}
                        defaultValue={item.discount?.toString()}
                        errorText={item.error ?
                            (item.error == 1 ? 'discount should not be greater than discount limit' : 'please enter a valid number with 2 digits maximum')
                            : undefined}
                        error={item.error}
                        onChange={autoCloseOnComplete}
                        onEndEditing={(text) => { changeDiscountAmount(text, item) }} >
                        <TouchableOpacity style={styles.dropDownIcon} onPress={() => openDropdown(item)}>
                            <Icon name='caret-down' size={25} color={'white'} />
                        </TouchableOpacity>
                    </TextInput>

                </View>
                <KeyValueText qtyEditable={true} qtyChangeHandler={(mode) => { qtyChangeHandler(mode, item) }} description='Quantity' value={item.quantity} />
            </View>
            <View style={styles.iconPadding}>
                <Icon onPress={() => { removeItem(item.key) }} name='trash-o' size={25} color={'red'} />
            </View></CustomCard>

    }
    const getSearchFilteredData = useMemo(() => searchCriteria ? cartContext.cart.filter(item => item.name.toLowerCase().includes(searchCriteria.toLowerCase())) : cartContext.cart, [searchCriteria, cartContext.cart])
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Cart</Text>
        <CustomSearchBar placeholder='Search Items' onSearch={setSearchCriteria} />
        <SafeAreaView style={{ flex: 1 }}>
            {cartContext.cart.length == 0 ?
                <Text style={styles.cartEmptyLabel}>Your Cart is empty</Text>
                : <FlatList data={getSearchFilteredData} renderItem={renderItem} keyExtractor={(_, index) => index} />}
        </SafeAreaView>
        <CustomButton buttonStyle={{ margin: 10 }} title="Generate Bill" mode="outlined" onPress={navigateToGenerateBill} />
        {useMemo(() => // only re-render as anew when modal visibility changes....
            <Modal visible={showDiscountDropdown} transparent={true} animationType="slide" >
                <Pressable onPress={() => { setDiscountDropdownVisisbility(false) }} style={theme.backdrop} />
                <View style={theme.bottomModalContent}>
                    <Text style={styles.dropDownHeading}>Select a Discount Amount</Text>
                    <View style={{ maxHeight: 200 }}>
                        <FlatList persistentScrollbar={true} style={{ flex: 0 }} data={discountDropdownData.list} renderItem={renderDiscountItem} />
                    </View>
                </View>
            </Modal>, [showDiscountDropdown])}

    </View>
}
const styles = StyleSheet.create({
    iconPadding: {
        height: 50,
        borderRadius: 50,
        backgroundColor: '#F5B5A8',
        alignItems: 'center',
        padding: 10,
        aspectRatio: 1
    },
    cartEmptyLabel: {
        fontSize: 20,
        margin: 10,
        alignSelf: 'center'
    },
    underline: {
        flex: 0,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: 'black',
        height: 3,
        borderRadius: 100
    },
    foodTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    discountDropdownItem: {
        textAlign: 'center',
        paddingVertical: 5,
        margin: 2,
        borderBottomWidth: 1,
        borderColor: theme.colors.primary,
        color: 'black',
        fontSize: 20
    },
    dropDownHeading: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    dropDownIcon: {
        marginHorizontal: 5,
        marginVertical: 12,
        height: 40,
        borderRadius: 5,
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        borderColor: theme.colors.text,
        borderWidth: 1,
        padding: 5,
        aspectRatio: 1
    },
    container: {
        height: '100%'
    }
})