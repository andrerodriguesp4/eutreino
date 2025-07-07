import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Home from './screens/Home';
import Treinos from './screens/Treinos'
import Login from './screens/Login';
import DetalhesTreino from './screens/DetalhesTreino';
import UserArea from './screens/UserArea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EditarPerfil from './screens/account/EditarPerfil';
import MostrarAcademia from './screens/account/MostrarAcademia';
import MostrarInformacoes from './screens/account/MostrarInformacoes';

const Stack = createNativeStackNavigator();

// function SairButton(){
//   const navigation = useNavigation();

//   async function sair(){
//     await AsyncStorage.setItem('usuario', "");
//     await AsyncStorage.setItem('senha', "");

//     navigation.navigate('Home');
//   }

//   return(
//     <TouchableOpacity onPress={() => sair()}>
//       <Text style={{color: 'white'}}>Sair</Text>
//     </TouchableOpacity>
//   )

// }

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style='auto'/>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='DetalhesTreino' component={DetalhesTreino} options={{
            headerStyle: {backgroundColor: '#FA801C'},
          }}/>
          <Stack.Screen name='Home' component={Home} options={{
            ...styles.optionsnv,
            
            header: () => false,
            }}/>
          <Stack.Screen name='UserArea' component={UserArea} options={{
            ...styles.optionsnv,
            
            gestureEnabled:false,
            header: () => false,
            }}/>
          <Stack.Screen name='Login' component={Login} options={styles.optionsnv}/>
          <Stack.Screen name='EditarPerfil' component={EditarPerfil} options={{ title: 'Dados Pessoais' }} />
          <Stack.Screen name='MostrarAcademia' component={MostrarAcademia} options={{ title: 'Academia' }} />
          <Stack.Screen name='MostrarInformacoes' component={MostrarInformacoes} options={{ title: 'Informações' }} />
        </Stack.Navigator>
        
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000000',
  },
  optionsnv:{
    headerStyle: {backgroundColor: '#000000', borderBottomColor: "#000000"},
    headerTintColor: 'white',
    
  }
});
