import { StyleSheet, Text, TextInput, View } from "react-native";

export default function CampoBox({
    label,
    value,
    placeholder,
    setter,
    editable,
    setDisabledSalvar,
}){
    
    return(
        <View style={styles.campoBox}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                placeholder={placeholder}
                editable={editable}
                pointerEvents="none"
                placeholderTextColor="#666"
                style={styles.inputProfile}
                onChange={() => setDisabledSalvar(false)}
                onChangeText={setter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    campoBox: {
        flexDirection:'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    label: {
        fontSize: 20,
        color: '#444',
        marginHorizontal: 5,
        marginVertical: 0,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    inputProfile: {
        backgroundColor: '#f5f4f4ff',
        padding: 5,
        height: 40,
        width: '60%',
        marginHorizontal:5,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
})