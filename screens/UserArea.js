import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Treinos from "./Treinos";
import Perfil from "./Perfil";
import Timer from "./Timer";
import WorkoutScreen from "./WorkoutScreen";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from "./styles/default";

const Tab = createBottomTabNavigator();


export default function UserArea({navigation}){
    return(
        <Tab.Navigator screenOptions={{
            headerTitle: "EuTreino",
            headerStyle: {
                height: 100,
                backgroundColor: COLORS.primary,
            },
            headerTintColor: "black",
            headerTitleStyle:{
                fontSize: 30,
                paddingTop: 40,
                fontWeight: "bold",
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            },
            tabBarStyle: {
                border: 0,
                height: 100,
                paddingBottom: 40,
                backgroundColor: "white",
            },
            tabBarActiveTintColor: "black",
            tabBarActiveBackgroundColor: COLORS.primary,
            tabBarLabelStyle: {
                fontSize: 15,
            },
        }}>
            <Tab.Screen name="Treinos" component={Treinos} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="dumbbell" size={20} color={focused ? 'black' : '#999999ff'}/>
                )
            }}/>
            <Tab.Screen name="Timer" component={Timer} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="hourglass-end" size={20} color={focused ? 'black' : '#999999ff'}/>
                )
            }}/>
            <Tab.Screen name="Hoje" component={WorkoutScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="calendar" size={20} color={focused ? 'black' : '#999999ff'}/>
                )
            }}/>
            <Tab.Screen name="Perfil" component={Perfil} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="user-circle" size={20} color={focused ? 'black' : '#999999ff'}/>
                )
            }}/>
        </Tab.Navigator>
    )
}