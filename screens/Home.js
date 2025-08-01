import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/HomeStyles";

export default function Home({navigation}){
    async function manterconectado(){
        const usuario = await AsyncStorage.getItem('usuario')
        const senha = await AsyncStorage.getItem('senha')

        if (usuario && senha){
            navigation.navigate('UserArea')
        }else{
            navigation.navigate('Login')
        }
    }

    return(
        <ImageBackground
            source={require('../source/ramondino.jpg')}
            style={styles.imageBg}
            imageStyle={{opacity: 0.3}}
        >
        <View style={styles.container}>
            <View style={styles.container1}>
                <Text style={styles.whitetext}>EU</Text>
                <Text style={styles.redtext}>TREINO</Text>
            </View>
            <TouchableOpacity onPress={() => manterconectado()} style={styles.button}>
                <Text style={styles.textbutton}>Entrar</Text>
            </TouchableOpacity>   
        </View>
        </ImageBackground>
    )

}
