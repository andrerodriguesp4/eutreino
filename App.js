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

const Stack = createNativeStackNavigator();

function SairButton(){
  const navigation = useNavigation();

  async function sair(){
    await AsyncStorage.setItem('usuario', "");
    await AsyncStorage.setItem('senha', "");

    navigation.navigate('Home');
  }

  return(
    <TouchableOpacity onPress={() => sair()}>
      <Text style={{color: 'white'}}>Sair</Text>
    </TouchableOpacity>
  )

}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='auto'/>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='DetalhesTreino' component={DetalhesTreino}/>
        <Stack.Screen name='Home' component={Home} options={styles.optionsnv}/>
        <Stack.Screen name='UserArea' component={UserArea} options={{
          ...styles.optionsnv,
          
          gestureEnabled:false,
          header: () => false,
          }}/>
        <Stack.Screen name='Login' component={Login} options={styles.optionsnv}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black',
  },
  optionsnv:{
    headerStyle: {backgroundColor: 'black', borderBottomColor: "black"},
    headerTintColor: 'white',
    
  }
});
