import { Pressable, View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useEffect } from "react";

export default function Perfil({navigation}){
  useEffect(() => {
    navigation.setOptions({
    })
  }, []);
  async function sair(){
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('senha');
      navigation.reset({
          index: 0,
          routes: [{name: 'Home'}]
      })
  }

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
      <View style={styles.container}>
          <View>
              <MenuItem label="Conta" icon="user" screen="EditarPerfil" />
              <MenuItem label="Academia" icon="dumbbell" screen="MostrarAcademia" />
              <MenuItem label="Informações" icon="info-circle" screen="MostrarInformacoes" />
              <MenuItem label="Histórico de Treinos" icon="history" screen="TrainingHistory" />
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => sair()}>
              <FontAwesome5 name="sign-out-alt" size={22} color="#FA801C" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'space-between'
  },
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
  logoutButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#FA801C',
    fontWeight: 'bold',
    fontSize: 22,
  },
});