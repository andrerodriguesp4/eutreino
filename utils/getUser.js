import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUser(setUserId, navigation) {
    try{
        const usuario = await AsyncStorage.getItem('usuario');
        if(!usuario){
            navigation.navigate('Home')
        }else{
            setUserId(usuario);
        }
    }catch (error) {
        console.log('Erro na função getUser: ', error)
    }
};