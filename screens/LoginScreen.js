import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import logIn from "../services/LogIn";
import RegisterModal from "./components/RegisterModal";
import PasswordField from "./account/components/Passwordfield";
import styles from "./styles/loginStyles";
import ModernButton from "../utils/ModernButton";
import ModernInput from "../utils/ModernInput";

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
            <View style={styles.viewForm}>                
                <View style={{alignItems: 'center'}}>
                    <ModernInput
                        value={user}
                        onChangeText={setUser}
                        placeholder="Digite o usuário"
                    />
                    <PasswordField
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite a senha"
                        style={[styles.inputLoginPassword]}
                    />
                </View>
                <View style={styles.viewButtons}>
                      <ModernButton
                        text="Login"
                        onPress={handleLogin}
                        icon="sign-in-alt"
                      />
                      <ModernButton
                        text="Criar Conta"
                        onPress={() => setModalVisible(true)}
                        icon="user-plus"
                      />
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
