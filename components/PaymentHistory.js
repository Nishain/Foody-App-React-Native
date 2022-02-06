import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import theme from "./common/theme";
import database from '@react-native-firebase/database'
import ExpandableContent from "./common/ExpandableContent";
import KeyValueText from "./common/KeyValueText";
import CustomCard from "./common/CustomCard";
export default function PaymentHistory(){
    const reference = database().ref('history')
    const [data,setData] = useState([])
    useEffect(()=>{
        reference.on('value',(snapshot)=>{
            const dbHistory = snapshot.val()
            setData(Object.values(dbHistory))
        })
    },[])
    const renderItem = (value) => {
        const item = value.item
        return <CustomCard>
        <ExpandableContent mainContent= {
            <View style={{alignSelf : 'stretch',alignItems : 'stretch'}}>
                
                <KeyValueText description='Code' value={item.billCode}/>
                <KeyValueText description='Customer Name' value={item.customerName}/>
                <KeyValueText description='Order Date' value={item.orderDate}/>
                <KeyValueText description="Total price" value={item.totalPrice} />
            </View>
        }
        subContent={
            <View style={styles.subContentContainer}>
                {item.cart.map((cartItem,index) => <View key={index} style={styles.subContentItem}>
                    <KeyValueText description="Name" value={cartItem.name}/>
                    <KeyValueText description="Price" value={cartItem.price}/>
                    <KeyValueText description="Quantity" value={cartItem.quantity}/>
                    {/* show only if discount greater than 0% */}
                    {(cartItem.discount || 0) > 0 &&  <KeyValueText description="Discount" value={cartItem.discount + ' %'}/>}
                </View>)}
            </View>
        }
        />
        </CustomCard>
    }
    return <View>
        <Text style={theme.headerStyle}>Payment History</Text>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(_,index)=>index}/>
    </View>
}
const styles = StyleSheet.create({
    subContentContainer : {
        margin : 10,
        backgroundColor : theme.colors.surface
    },
    subContentItem : {
        marginVertical : 5,
        backgroundColor : 'white',
        padding : 5
    }
})