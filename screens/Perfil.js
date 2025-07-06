import { Pressable, View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
                <Text style={{color: "white", margin: 5, padding: 5, marginTop: "50%"}}>Sair</Text>
            </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const MenuItem = ({ label, icon, screen }) => (
        <Pressable
        onPress={() => navigation.navigate(screen)}
        style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed
        ]}
        >
            <FontAwesome5 name={icon} size={22} style={{marginRight:10, width:30}}/>
            <Text style={styles.menuText}>{label}</Text>
        </Pressable>
    );

    return (
        <View>
            <View>
                <MenuItem label="Conta" icon="user" screen="EditarPerfil" />
                <MenuItem label="Academia" icon="dumbbell" screen="EditarAcademia" />
                <MenuItem label="Informações" icon="info-circle" screen="EditarInformacoes" />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  menuItemPressed: {
    backgroundColor: '#eee',
  },
  menuText: {
    fontSize: 22,
  },
});