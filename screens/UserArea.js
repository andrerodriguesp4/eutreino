import { View, Text, TouchableOpacity } from "react-native";

export default function UserArea({navigation}){
    return(
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Treinos')}>
                <Text>
                    Treinos
                </Text>
            </TouchableOpacity>
        </View>
    )
}