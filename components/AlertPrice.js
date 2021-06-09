import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ActivityIndicator,
    SafeAreaView,
    FlatList,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    TouchableHighlight,
    TextInput,
    ScrollView,
    CheckBox
} from 'react-native';

import {useEffect, useState, useContext, useRef} from "react";
import Constants from 'expo-constants';
import { ContextAPI } from "./Context";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlertPrice = ({data}) => {
    const context = useContext(ContextAPI);
    const [isSelected, setSelection] = useState(false);
    const [key,setKey] = useState('');
    const [price,setPrice] = useState('');

    useEffect(() => {
        if(typeof data === 'object') {
            if(typeof JSON.parse(data.price) === 'object') {
                const parse = JSON.parse(data.price);
                setSelection(parse.activate);
                setKey(parse.key);
                setPrice(parse.price);
            }else{
                setSelection(data.activate);
                setKey(data.key);
                setPrice(data.price);
            }
        }

    },[]);

    const onChangeActivate = async () => {

        const alertUpdate = await updateAlert();
    }

    const updateAlert = async () => {
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    const alert = await AsyncStorage.getItem(key);

                    console.log(alert);
                    setSelection(!isSelected);
                } catch (e) {
                    // error reading value
                }
            }, 1000);
        });
    }

    return (
        <View style={styles.contentAlert}>
            <Text style={styles.colorPrice}>{price} $</Text>
            <CheckBox
                value={isSelected}
                onValueChange={onChangeActivate}
                style={styles.checkbox}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contentAlert : {
        backgroundColor: 'white',
        padding: 2,
        margin: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    colorPrice: {
        color: "green",
        fontSize: 17
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    }
});

export default AlertPrice;
