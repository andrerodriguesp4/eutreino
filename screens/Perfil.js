import { View, Text, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil({navigation}){
    function sair(){
        AsyncStorage.setItem('usuario', "");
        AsyncStorage.setItem('senha', "");
        navigation.navigate('Home');
    }

    return(
        <View>
            <TouchableOpacity onPress={()=> sair()}>
                <Text>
                    Sair
                </Text>
            </TouchableOpacity>
        </View>
    )
}