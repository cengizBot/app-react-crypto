import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import React, {useState, useEffect} from 'react';

import {StatusBar} from 'expo-status-bar';

import {StyleSheet, Text, View, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import TaskScreen from './components/TaskScreen';
import HomeScreen from './components/HomeScreen';

import { Context } from "./components/Context";


const Stack = createStackNavigator();

export default function App() {

    return (
        <Context>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Task" component={TaskScreen}/>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Context>
    );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        backgroundColor: '#E8EAED'
    },
    tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    items: {
        marginTop: 30
    },
    input: {
        paddingHorizontal: 15,
        backgroundColor: '#FFFF',
        width: 250,
        paddingVertical: 15,
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeTodos: {
        backgroundColor: "#C20404",
        color: '#FFFF',
        paddingVertical: 5,
        paddingHorizontal: 5
    }
});
