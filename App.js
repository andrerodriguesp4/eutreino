import { NavigationContainer, StackRouter, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Home from './screens/Home';
import Treinos from './screens/Treinos'
import Login from './screens/Login';
import UserArea from './screens/UserArea';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{
          ...styles.optionsnv,
          headerLeft: () =>  false,
          gestureEnabled: false,
          }}/>
        <Stack.Screen name='Treinos' component={Treinos} options={{
          ...styles.optionsnv, 
           
          gestureEnabled:false,          
        }}/>
        <Stack.Screen name='Login' component={Login} options={styles.optionsnv}/>
        <Stack.Screen name='UserArea' component={UserArea} options={{
          ...styles.optionsnv,
          
          gestureEnabled:false,
          headerRight: () => <SairButton/>,
          headerLeft: () => false,
          }}/>
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
    headerStyle: {backgroundColor: 'black'},
    headerTintColor: 'white',
    
  }
});
