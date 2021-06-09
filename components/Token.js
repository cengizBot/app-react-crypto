import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView, FlatList, View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {useEffect, useState, useContext, useRef} from "react";

import {ContextAPI} from "./Context";

import WETRADE from '../assets/WETRADE.jpg';
import NOSTA from '../assets/NOSTA.jpg';
import IMPULSE from '../assets/IMPULSE.png';

const Token = ({data}) => {

    useEffect(() => {

    }, []);

    const getImageToken = (name) => {

        name = name.toUpperCase();
        if (name === "NOSTA") {
            return NOSTA;
        }

        if (name === "IMPULSE") {
            return IMPULSE;
        }

        if (name === "WETRADE") {
            return WETRADE;
        }
    }

    return (
        <View>
            <View style={styles.tokenContent}>
                <View style={styles.tokenInfo}>
                    <Image style={styles.tokenImage} source={getImageToken(data.name)}/>
                </View>
                <View>
                    <Text style={styles.colorToken}>{data.name}</Text>
                    <Text style={styles.colorInfo}>Pair : {data.pair}</Text>
                    <Text style={styles.colorInfo}>Network : {data.network}</Text>
                    <Text style={styles.colorPrice}>Price : {data.price} $</Text>
                </View>
            </View>
            <Text style={styles.addr}>{data.addr}</Text>
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

export default Token;
