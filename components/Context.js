import * as React from "react";
import {useEffect, useState, createContext} from "react";

import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContextAPI = createContext();

const Context = ({children}) => {

    //API
    const [tokensByFDR, setTokensByFDR] = useState([]);
    const [loadAPI, setLoadAPI] = useState(false);
    const API_TOKENS_START = 'https://api.dex.guru/v1/tokens/'
    const API_TOKENS_END = '-bsc/swaps?from_num=0&size=30&sort_by=timestamp&sort_by2=id&asc=false'
    // dextools
    const FDR_TOKENS_ID = [
        '0x79236db52e1b6fca35f2d44249cfa78277f57cea', // nosta
        // '0xd2fb841ad6f0655f8993461ff7e7669a5f61545f', // impulse
        // '0x027bab29c8ac39ccc6ce09ad6a62e9255e955f53' // wetrade
    ];
    const [alertPrice, setAlertPrices] = useState();
    const [storagePrices, setStoragePrices] = useState([]);
    const [errorPrice, setErrorPrice] = React.useState(false);
    const [loadStorage, setLoadStorage] = useState(false);
    const [countStorage,setCountStorage] = useState(0);

    useEffect(() => {
        // console.log('cengiz' , storagePrices);
    },[storagePrices])
    const existStoreData = () => {
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    let r = Math.random().toString(36).substring(10);
                    let key = '@' + r;
                    const value = await AsyncStorage.getItem(key);
                    if (value === null) {
                        resolve(key);
                    } else {
                        resolve(false);
                    }
                } catch (e) {
                    resolve(false);
                }
            }, 1000);
        });
    }

    useEffect(() => {
        async function checkDataStorage() {
            try {
                const storage = await getAllKeys();
                setCountStorage(storage);
                const init_storage = await initStorage(storage);
                setStoragePrices(init_storage);
                setLoadStorage(true);
            } catch (e) {
                // console.error(e);
            }
        };
        checkDataStorage();
    }, []);


    const initStorage = async (storage) => {
        return new Promise(resolve => {
            try {
                let pricesStorageInit = [];
                setTimeout(async () => {
                    for(let i = 0; i < storage.length; i ++) {
                        const storageCurrent = await getStoreDataByKey(storage[i]);

                        console.log('88dd88' , typeof storageCurrent);
                        let price_init =  {'key': storage[i], 'price': storageCurrent}
                        pricesStorageInit.push(price_init);
                    }
                    resolve(pricesStorageInit);
                },1500);
            } catch (e) {
                // save error
                console.log(e)
            }
        });
    }

    const getAllKeys = async () => {
        return new Promise(resolve => {
            setTimeout(async () => {
                let keys = []
                try {
                    keys = await AsyncStorage.getAllKeys();
                    resolve(keys);
                } catch (e) {
                    resolve(false);
                }
            }, 1000);
        });
    }

    const getStoreDataByKey = async (key) => {
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    const value = await AsyncStorage.getItem(key);
                    if (value !== null) {
                        resolve(value);
                    }
                } catch (e) {
                    // error reading value
                }
            }, 1000);
        });
    }

    const loadDataAPI = () => {

        // setInterval(() => {
        console.log('refresh')
        const tokens_by_fdr = [];
        for (const token of FDR_TOKENS_ID) {
            const FULL_URL_API = API_TOKENS_START + token + API_TOKENS_END;
            // const response = await fetch(FULL_URL_API);
            fetch(FULL_URL_API)
                .then(response => Promise.all([response, response.json()]))
                .then(([response, result]) => {
                    const token = {
                        'name': result.data[0].token0Symbol,
                        'pair': result.data[0].token0Symbol + '/' + result.data[0].token1Symbol,
                        'network': result.data[0].network,
                        'addr': result.data[0].token0Address,
                        'amm': result.data[0].AMM,
                        'price': parseFloat(result.data[0].token0PriceUSD).toFixed(2)
                    };
                    tokens_by_fdr.push(token);
                    return [response, result];
                })
                .catch(err => {
                    console.log("error catch search:", err.message);
                    // Choose one, depends what you need.
                    // return false; // If you want to ignore the error and do something in a chained .then()
                    // return Promise.reject(err); // If you want to handle the error in a chained .catch()
                }).finally(result => {
                setTokensByFDR(tokens_by_fdr);
                setLoadAPI(true);
            })
        }
        // } , 5000);
    }

    useEffect(() => {
        loadDataAPI();
    }, []);

    const value = {tokensByFDR,
        setTokensByFDR, loadAPI,
        setLoadAPI, loadDataAPI,
        setStoragePrices, getAllKeys ,
        storagePrices, errorPrice,
        setErrorPrice, existStoreData,
        loadStorage, setLoadStorage
    }

    return (
        <ContextAPI.Provider value={value}>{children}</ContextAPI.Provider>
    );
};

export {Context, ContextAPI};
