import { View, Text, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Treinos from "./Treinos";
import Perfil from "./Perfil";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();


export default function UserArea({navigation}){
    return(
        <Tab.Navigator screenOptions={{
            headerStyle: {
                height: 100,
                backgroundColor: "black",
                borderBottomColor: "black",
            },
            headerTintColor: "white",
            headerTitleStyle:{
                fontSize: 24,
                // paddingTop: 40
            }
        }}>
            <Tab.Screen name="Treinos" component={Treinos} options={{
                tabBarIcon: () => (
                    <FontAwesome5 name="dumbbell" size={20}/>
                )
            }}/>
            <Tab.Screen name="Perfil" component={Perfil} options={{
                tabBarIcon: () => (
                    <FontAwesome5 name="user-circle" size={20}/>
                )
            }}/>
        </Tab.Navigator>
    )
}