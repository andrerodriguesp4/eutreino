import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container1: {
        paddingVertical: 10,
        paddingHorizontal:30,
        // borderWidth: 2,
        // borderColor: '#ffffff27',
        borderRadius: 25,
        backgroundColor: '#ffffff1f',

    },
    whitetext:{
        fontFamily: 'impact',
        fontSize: 40,
        color: 'white',
        marginBottom: -20,
    },
    redtext:{
        fontFamily: 'impact',
        fontSize: 80,
        color: '#fa801c',
    },
    button: {
        backgroundColor: '#008000b0',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 50,
    },
    textbutton: {
        fontFamily: 'cursive',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    imageBg:{
        height: "100%",
        width: "100%",
        flex:1,
        backgroundColor: 'black',
    }

});