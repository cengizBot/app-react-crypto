import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView, FlatList, View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {useEffect, useState, useContext, useRef} from "react";

import {ContextAPI} from "./Context";

const PriceStorage = ({data}) => {

    useEffect(() => {
        console.log('++' , data)
    }, []);

    return (
        <View key={data.key}>
            <View >
                <Text>{data.price} $</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    colorPrice: {
        color: "green",
        fontSize: 22
    },
    colorToken: {
        color: "#B7BC04",
        fontWeight: 'bold'
    },
    colorInfo: {
        color: "black",
    },
    tokenContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        margin: 5,
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 3
    },
    addr : {
        textAlign: 'center'
    },
    tokenImage: {
        width: 100,
        height: 100,
        resizeMode: 'stretch',
    }
});

export default PriceStorage;
