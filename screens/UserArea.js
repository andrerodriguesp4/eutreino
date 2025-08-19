import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Perfil from "./Perfil";
import Timer from "./Timer";
import WorkoutScreen from "./WorkoutScreen";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from "./styles/default";
import TreinosStack from "./TreinosStack";
import CustomTabButton from "../utils/CustomTabButton";

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
                backgroundColor: "#000",
            },
            tabBarActiveTintColor: "white",
            tabBarActiveBackgroundColor: COLORS.buttons,
            tabBarLabelStyle: {
                fontSize: 15,
            },
            tabBarButton: (props) => <CustomTabButton {...props} />,
        }}>
            <Tab.Screen name="Treinos" component={TreinosStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome5 name="dumbbell" size={20} color={focused ? 'white' : '#999999ff'}/>
                    ),
                }}
                // listeners={({ navigation, route}) => ({
                //     tabPress: e => {
                //         e.preventDefault();
                //         navigation.navigate('Treinos', {
                //             screen: 'TreinosMain',
                //         });
                //     },
                // })}
            />
            <Tab.Screen name="Timer" component={Timer} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="hourglass-end" size={20} color={focused ? 'white' : '#999999ff'}/>
                )
            }}/>
            <Tab.Screen name="Hoje" component={WorkoutScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="calendar" size={20} color={focused ? 'white' : '#999999ff'}/>
                )
            }}/>
            <Tab.Screen name="Perfil" component={Perfil} options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome5 name="user-circle" size={20} color={focused ? 'white' : '#999999ff'}/>
                )
            }}/>
        </Tab.Navigator>
    )
}