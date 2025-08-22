import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Home from './screens/Home';
import UserArea from './screens/UserArea';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EditarPerfil from './screens/account/EditarPerfil';
import MostrarAcademia from './screens/account/MostrarAcademia';
import MostrarInformacoes from './screens/account/MostrarInformacoes';
import TrainingHistory from './screens/account/TrainingHistory';
import Login from './screens/LoginScreen';
import PasswordUpdateScreen from './screens/account/components/PasswordUpdateScreen';
import WorkoutScreen from './screens/components/WorkoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style='auto'/>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='WorkoutScreen' component={WorkoutScreen} options={{
            title: "Treino"
            // headerStyle: {backgroundColor: '#1a7431'},
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
          <Stack.Screen name='PasswordUpdate' component={PasswordUpdateScreen} options={{title: 'Senha'}}/>
          <Stack.Screen name='MostrarAcademia' component={MostrarAcademia} options={{ title: 'Academia' }} />
          <Stack.Screen name='MostrarInformacoes' component={MostrarInformacoes} options={{ title: 'Informações' }} />
          <Stack.Screen name='TrainingHistory' component={TrainingHistory} options={{ title: 'Histórico de Treinos' }} />
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
