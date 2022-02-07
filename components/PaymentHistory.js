import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, TextInput } from "react-native";
import theme from "./common/theme";
import database from '@react-native-firebase/database'
import ExpandableContent from "./common/ExpandableContent";
import KeyValueText from "./common/KeyValueText";
import CustomCard from "./common/CustomCard";
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
export default function PaymentHistory(){
    const reference = database().ref('history')
    const [data,setData] = useState([])
    const [filterDate,setFilterDate] = useState({start : undefined , end : undefined})
    const [dateModalVisibility,setDateModalVisibility] = useState({start : false , end : false})
    
    const setStartDate = (date)=>{
        openAndCloseStartDateModal(false)
        setFilterDate({start : date, end : filterDate.end})
        
    }

    const setEndDate = (date)=>{
        openAndCloseEndDateModal(false )
        setFilterDate({end : date, start : filterDate.start})
        
    }
    const openAndCloseStartDateModal = (mode) => { setDateModalVisibility({start : mode , end : dateModalVisibility.end}) }
    const openAndCloseEndDateModal = (mode)=> { setDateModalVisibility({end : mode , start : dateModalVisibility.start}) }
    const getDateFilteredData = () => data.filter(billItem => compareDate(billItem['orderDate']))
    const compareDate = (dateString) => {
        const paramDate = new Date(dateString).getTime()
        const beforeCondition = filterDate.start ? paramDate >= filterDate.start.getTime() : true
        const afterCondition = filterDate.end ? paramDate <= filterDate.end.getTime() : true
        console.log(`beforeCondition : ${beforeCondition} afterCondition : ${afterCondition}`)
        return beforeCondition && afterCondition
    }
    useEffect(()=>{
        reference.on('value',(snapshot)=>{
            const dbHistory = snapshot.val()
            console.log('refreshed')
            if(dbHistory)
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
    const renderDateInputStyle = (value) => value ? {...styles.dateInput,...{ backgroundColor : theme.colors.primary,color : 'white' }} : styles.dateInput
    const clearFilter = () => {setFilterDate({start : undefined , end : undefined})}
    return <View>
        <Text style={theme.headerStyle}>Payment History</Text>
        <Text style={styles.label}>Date Filter </Text>
        <View style={styles.dateInputRow} >
            
            <Text style={renderDateInputStyle(filterDate.start)}  onPress={()=>{openAndCloseStartDateModal(true)}} >{filterDate.start ? filterDate.start.toDateString() : 'Select Start Date'}</Text>
            <Text style={renderDateInputStyle(filterDate.end)}  onPress={()=>{openAndCloseEndDateModal(true)}} >{filterDate.end ? filterDate.end.toDateString() : 'Select End Date'}</Text>
            <Icon name="remove" style={styles.clearFilterButton} size={20} color={'white'} onPress={clearFilter}/>
            <DatePicker modal cancelText="Delete Yo" open={dateModalVisibility.start} date={filterDate.start || new Date()}  mode="date"  title="Select start date" onConfirm={setStartDate} onCancel={()=>{openAndCloseStartDateModal(false)}} />
            <DatePicker modal open={dateModalVisibility.end} date={filterDate.end || new Date()}  mode="date" title="Select end date" onConfirm={setEndDate} onCancel={()=>{openAndCloseEndDateModal(false)}} />
        </View>
        <FlatList data={getDateFilteredData()} renderItem={renderItem} keyExtractor={(_,index)=>index}/>
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
    },
    dateInput : {
        borderColor : 'black',
        borderWidth : 2,
        textAlign : 'center',
        padding : 10,
        margin : 5,
        borderRadius : 5
    },
    clearFilterButton : {
        padding : 5,
        borderRadius : 5,
        backgroundColor : theme.colors.primary
    },
    label : {
        marginStart : 5,
        color : 'black',
        fontWeight : 'bold',
        fontSize : 20
    },
    dateInputRow : {
        margin : 5,
        alignItems : 'center',
        flexDirection : 'row'
    }
})