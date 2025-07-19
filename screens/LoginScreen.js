import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import logIn from "../services/LogIn";
import RegisterModal from "./components/RegisterModal";
import PasswordField from "./account/components/Passwordfield";

export default function Login({navigation}){

    const [senha, setSenha] = useState('')
    const [user, setUser] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [loadingVisible, setLoadingVisible] = useState(false)    

    function navegar(){
        navigation.navigate('UserArea');
    }

    async function handleLogin() {
        if(!user || !senha){
            alert('Preencha todos os campos');
            return;
        }

        try {
            setLoadingVisible(true);
            const resultado = await logIn(user, senha);
            setLoadingVisible(false);

            if (resultado) {
                navegar();
            } else {
                alert('Usuário ou senha inválidos');
            }
        } catch (error) {
            setLoadingVisible(false);
            console.error(error.message);
            alert('Erro ao fazer login');
        }
    }

    return(
        <View style={styles.container}>
            {loadingVisible && (
                <View style={styles.viewLoading}>
                    <ActivityIndicator
                        size='large'
                    />
                </View>
            )}
            <View style={styles.viewForm1}>                
                <View style={styles.viewInputs}>
                    <TextInput
                        value={user}
                        onChangeText={setUser}
                        placeholder="Digite o usuário"
                        placeholderTextColor='#666'
                        style={styles.inputLogin}
                    />
                    <PasswordField
                        // label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite a senha"
                        style={[styles.inputLogin]}
                    />
                </View>
                <View style={styles.viewButtons}>
                    <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonLogin}>
                        <Text>
                            Criar Conta
                        </Text>
                    </TouchableOpacity>
                </View>                    
            </View>
            <View>
                <RegisterModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSuccess={navegar}
                    styles={styles}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000ff'
    },
    inputLogin: {
        backgroundColor:'white',
        padding: 10,
        borderWidth: 1,
        marginVertical: 5,
        width: 250,
    },
    viewInputs:{
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    buttonLogin: {
        borderWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignItems: 'center',
        margin: 5,
        
    },
    viewButtons: {
        flexDirection: 'row',
        marginTop: 15,
    },
    viewModal: {
        flex: 1,
        margin: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewForm:{
        alignItems: 'center',
        backgroundColor: '#FA801C',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    voltarButton: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        margin: 5,
    },
    viewForm1: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#FA801C',
        borderRadius: 25,
    },
    viewLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: '#0000008a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    
})