import React from "react"
import { useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import CustomCard from "./common/CustomCard"
import KeyValueText from "./common/KeyValueText"
import CustomSearchBar from "./common/SearchBar"
import theme from "./common/theme"

export default function FoodBrowseScreen() {
    const [data, setData] = useState([
        { name: 'Food 1', description: 'awesome good food', price: 125.5 }
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
            </View>
        </CustomCard>
    }
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Browse Food</Text>
        <CustomSearchBar placeholder='Search item'/>
        <FlatList data={data} renderItem={renderItem} />
    </View>
}
const styles = StyleSheet.create({

    container: {
        height: '100%'
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
    }
})