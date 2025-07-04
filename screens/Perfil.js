import { View, Text, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";

export default function Perfil({navigation}){
    async function sair(){
        await AsyncStorage.removeItem('usuario');
        await AsyncStorage.removeItem('senha');
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}]
        })
    }
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
            <TouchableOpacity onPress={() => sair()}>
                <Text style={{ color: "white", margin: 5, padding: 5 }}>Sair</Text>
            </TouchableOpacity>
            ),
        });
    }, [navigation]);
}