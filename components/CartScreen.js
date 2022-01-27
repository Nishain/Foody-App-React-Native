import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CustomSearchBar from "./common/SearchBar";
import theme from "./common/theme";
import Icon from 'react-native-vector-icons/FontAwesome'
export default function CategoryScreen() {
    const [data, setData] = useState([{
        name: 'Food 1',
        description: 'Amazing food',
        price: 400
    },
    {
        name: 'Food 2',
        description: 'Amazing food 2',
        price: 300
    }
    ])
    const renderItem = (value) => {
        const item = value.item
        return <View style={styles.itemContainer}>
            <View style={styles.blueBox} />
            <View style={styles.itemInnerContent}>
                <View>
                    <View style={{ alignSelf: 'flex-start' }}>
                        <Text style={styles.foodTitle}>{item.name}</Text>
                        <View style={styles.underline} />
                    </View>
                    <Text>{item.description}</Text>
                    <Text>{item.price}</Text>
                </View>
                <View style={styles.iconPadding}>
                    <Icon name='trash-o' size={25} color={'red'} />
                </View>
                
            </View>
        </View>
    }
    return <View style={styles.container}>
        <Text style={theme.headerStyle}>Cart</Text>
        <CustomSearchBar placeholder='Search Items' />
        <FlatList data={data} renderItem={renderItem} keyExtractor={(value) => data.indexOf(value)} />
    </View>
}
const styles = StyleSheet.create({
    iconPadding : {
        height : 50,
        borderRadius : 50 ,
        backgroundColor : '#F5B5A8',
        alignItems : 'center',
        padding : 10,
        aspectRatio : 1
    },
    itemInnerContent: {
        marginRight : '5%',
        flex : 1,
        alignSelf : 'stretch',
        alignItems : 'center',
        flexDirection: "row",
        justifyContent : 'space-between'
    },
    underline: {
        flex : 0,
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
    blueBox: {
        backgroundColor: theme.colors.primary,
        height: '100%',
        width: '2%',
        marginRight: 10,
        borderRadius: 100
    },
    itemContainer: {
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        alignItems : 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingLeft: 0,
        borderRadius: 10,
        padding: 10,
        margin: 7
    },
    container: {
        height: '100%'
    }
})