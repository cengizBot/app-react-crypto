import React from 'react';
import {useEffect, useState, useContext, useRef} from "react";
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
    ScrollView
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ContextAPI} from "./Context";

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Token from './Token';
import PriceStorage from "./priceStorage";
import AlertPrice from "./AlertPrice";


const HomeScreen = ({navigation}) => {
    const context = useContext(ContextAPI);
    const [modalVisible, setModalVisible] = useState(false);
    const [price, onChangePrice] = React.useState('');

    useEffect(() => {
    }, [context.loadAPI, context.tokensByFDR]);

    const onTextChanged = (number) => {
        // code to remove non-numeric characters from text
        let checkNumber = parseFloat(number);
        onChangePrice(number.toString());
        if (isNaN(number)) {
            //if input is not a number then here
            context.setErrorPrice(true);
            alert('Entrez un nombre correct');
        } else {
            //if input is number then here
            context.setErrorPrice(false);
        }
    }

    const storeData = async (value) => {
        if(context.errorPrice) {
            return false;
        }

        const existPrice = await context.storagePrices.some( storage => {
            console.log(storage)
            if(!storage.hasOwnProperty('activate')){
                const parseStorage = JSON.parse(storage.price);
                if(value.toString() === parseStorage.price.toString()) {
                    return true;
                }
            }else{
                if(value.toString() === storage.price.toString()) {
                    return true;
                }
            }
        } );

        if(existPrice) {
            alert('Ce pris est déjà présent dans vos alertes de prix');
            return false;
        }
        const key = await context.existStoreData();
        if (key) {
            try {
                let newPrice = {'key': key, price: value , activate : true};
                await AsyncStorage.setItem(key, JSON.stringify(newPrice));
                let storage_price = [...context.storagePrices];
                storage_price.push(newPrice);
                context.setStoragePrices(storage_price);
                setModalVisible(false);
                onChangePrice('');
                alert('Alerte ajoutée');
            } catch (e) {
                // save error
            }
        } else {
            console.log('erreur storage item');
        }
    }
    const renderItem = ({item}) => {
        return <Token data={item}/>
    };

    const renderAlertPrice = ({item}) => {
        return <AlertPrice data={item}/>
    };

    return (
        <View style={styles.body}>
            <View style={styles.contentHeader}>
                <View style={styles.contentHeaderTitle}>
                    <Text style={styles.title}>Les tokens by FDR</Text>
                </View>
            </View>

            <View style={styles.contentHeader}>
                <View style={styles.contentData}>
                    {context.loadAPI && context.tokensByFDR ?
                        <SafeAreaView style={styles.container}>
                            <FlatList
                                key={item => item.key.toString()}
                                data={context.tokensByFDR}
                                renderItem={renderItem}
                                keyExtractor={item => item.name}/>
                        </SafeAreaView>
                        : <Text style={styles.loading}>Chargement ...</Text>
                    }
                </View>
            </View>

            <View style={styles.contentPrice}>
                <View style={styles.contentDataTracker}>
                    <Text style={styles.title}>
                        Alerte Prix
                    </Text>
                    <View>
                        <SafeAreaView style={styles.containerPrices}>
                            {
                                !context.storagePrices.length && context.loadStorage ?
                                    <Text style={styles.title}>
                                        Aucune alerte définies
                                    </Text> :
                                    <ScrollView style={styles.scrollView}>
                                        {context.storagePrices && context.loadStorage ?
                                            <SafeAreaView style={styles.container}>
                                                <FlatList data={context.storagePrices}
                                                          renderItem={renderAlertPrice}
                                                          keyExtractor={item => item.name}/>
                                            </SafeAreaView>
                                            :   <Text style={styles.loadTitle}>
                                                Chargement ...
                                            </Text>
                                        }
                                    </ScrollView>
                            }
                        </SafeAreaView>

                    </View>
                </View>
            </View>


            {context.loadStorage ?
                <View style={styles.addPrice}>
                    <TouchableHighlight
                        style={styles.openButton}
                        onPress={() => {
                            setModalVisible(true);
                        }}>
                        <View>
                            <Text style={styles.addPriceTxt}>Ajouter une alerte prix</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            : null}


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // request close
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Choisir un prix d'alerte</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                width: 250,
                                padding: 2,
                                borderRadius: 2,
                                borderBottomColor: '#E7E7E7',
                                borderTopColor: '#E7E7E7',
                                borderLeftColor: '#E7E7E7',
                                borderRightColor: '#E7E7E7'
                            }}
                            step="0.1"
                            value={price}
                            placeholder="Entrez un prix ( ex : 5 ou 5.3 ... )"
                            onChangeText={value => onTextChanged(value)}
                        />
                        <View style={styles.modals}>
                            <TouchableHighlight
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: '#2196F3',
                                    marginTop: 10,
                                    height: 50,
                                    width: '50%'
                                }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <View>
                                    <Text style={styles.closeModal}>Fermer
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: '#2196F3',
                                    marginTop: 10,
                                    height: 50,
                                    width: '50%',
                                    marginLeft: 5
                                }}
                                onPress={() => {
                                    storeData(price);
                                }}>
                                <View>
                                    <Text style={styles.closeModal}>Enregistrer
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    containerPrices: {
        marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        backgroundColor : "#EEEEEE",
        marginHorizontal: 20,
        height : 200
    },
    body: {
        height: '100%',
        backgroundColor: '#F1F1F1'
    },
    contentHeader: {
        alignItems: 'center',
        zIndex: 0
    },
    contentPrice : {
        alignItems: 'center',
        zIndex: 0,
        height: 270
    },
    contentChildTracker: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 15
    },
    erreur: {
        color: 'red'
    },
    addPrice: {
        width: '100%',
        position: 'absolute',
        bottom: 35
    },
    addTracker: {
        alignItems: 'flex-end',
        backgroundColor: '#2A32FB',
        padding: 2,
        color: 'white',
        height: 25,
        width: 25,
        borderRadius: 5,
        textAlign: 'center'
    },
    contentHeaderTitle: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        width: 300,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 10,
        elevation: 5
    },
    contentTracker: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: '90%',
        elevation: 5,
        marginTop: 20,
    },
    contentTrackerHeader: {},
    loading: {
        paddingHorizontal: 10,
        paddingVertical: 10
    }
    ,
    title: {
        fontSize: 20,
        textAlign: 'center'
    },
    loadTitle: {
        fontSize: 17,
        textAlign: 'center',
        marginTop:10
    },
    contentData: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        elevation: 5,
        width: '90%',
        paddingVertical: 10
    },
    contentDataTracker: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        elevation: 5,
        width: '90%',
        paddingVertical: 10,
        textAlign: 'center'
    },
    container: {},
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    centeredView: {

        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        height: 280
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#2A32FB',
        padding: 10,
        elevation: 2,
    },
    addPriceTxt: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 800
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    priceInput: {
        width: '90%',
        height: 20
    },
    closeModal: {
        color: 'white',
        textAlign: 'center',
        height: 50,
        width: '100%'
    },
    modals: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '99%'
    }
});

export default HomeScreen;
