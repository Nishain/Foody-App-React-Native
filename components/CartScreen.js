import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import CustomSearchBar from "./common/SearchBar";
import theme from "./common/theme";
import Icon from 'react-native-vector-icons/FontAwesome'
import KeyValueText from "./common/KeyValueText";
import CustomCard from "./common/CustomCard";
export default function CategoryScreen() {
    const [data, setData] = useState([{
        name: 'Food 1',
        description: 'Amazing food',
        price: 400,
        quantity: 4
    },
    {
        name: 'Food 2',
        description: 'Amazing food 2',
        price: 300,
        quantity: 3
    }
    ])
    const renderItem = (value) => {
        const item = value.item
        return <CustomCard> 
            <View>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={styles.foodTitle}>{item.name}</Text>
                    <View style={styles.underline} />
                </View>
                <KeyValueText description="Description" value={item.description} isVerical />
                <KeyValueText description='Price' value={item.price} />
                <KeyValueText description='Quantity' value={item.quantity} />
            </View>
            <View style={styles.iconPadding}>
                <Icon name='trash-o' size={25} color={'red'} />
            </View></CustomCard>

    }
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Cart</Text>
        <CustomSearchBar placeholder='Search Items' />
        <FlatList data={data} renderItem={renderItem} keyExtractor={(value) => data.indexOf(value)} />
        <Button title="Generate Bill"/>
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


    container: {
        height: '100%'
    }
})