import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import logIn from "../services/LogIn";
import RegisterModal from "./components/RegisterModal";
import PasswordField from "./account/components/Passwordfield";
import styles from "./styles/loginStyles";

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
