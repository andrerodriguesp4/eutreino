import { TextInput, Text, StyleSheet, View, TouchableOpacity } from "react-native";

export default function EditarPerfil({navigation}){
    const MenuItem = ({label}) => (
        <TextInput
            // value={label}
            placeholder={label}
            placeholderTextColor='#666'
            style={styles.inputProfile}
        />
    )
    return (
        <View style={styles.container}>
            <View>
                <MenuItem label={"name"}/>
                <MenuItem label={"nickname"}/>
                <MenuItem label={"password"}/>
                <MenuItem label={"newpassword"}/>
                <MenuItem label={"user@email.com"}/>
            </View>

            <View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'space-between'
    },
    inputProfile: {
        backgroundColor: '#fff',
        padding: 5,
        margin:10,
        borderWidth: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 8,
        backgroundColor: '#ddd',
        marginBottom: 65,
    },
    saveText: {
        color: '#FA801C',
        fontWeight: 'bold',
        fontSize: 22,
    },
})