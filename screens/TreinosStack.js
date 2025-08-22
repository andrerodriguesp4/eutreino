import { createStackNavigator } from '@react-navigation/stack';
import Treinos from './Treinos';
import WorkoutScreen from './components/WorkoutScreen';

const Stack = createStackNavigator();

export default function TreinosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TreinosMain" component={Treinos} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}