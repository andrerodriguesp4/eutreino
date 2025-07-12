import { TextInput, Text, StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import app from "../../firebaseConfig";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditarPerfil({navigation}){
    const [originalData, setOriginalData] = useState({});
    const [user, setUser] = useState('');
    // const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        AsyncStorage.getItem('usuario').then(user =>{
            if (user) setUserId(user);
        });
    }, []);

    useEffect(() => {
        async function carregarDadosUsuario() {
            if (!userId) return;
            
            try {
                const db = getFirestore(app);
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setOriginalData(data);
                    setUser(data.user || '');
                    setEmail(data.email || '');
                    // setNickname(data.nickname || '');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }

        carregarDadosUsuario();
    }, [userId]);

    async function salvarDados() {
        if(!userId){
            Alert.alert('Erro', 'Usuário não encontrado');
            return;
        }

        const dadosAtualizados = {};
        if (user !== originalData.user) dadosAtualizados.user = user;
        // if (nickname) dadosAtualizados.nickname = nickname;
        if (email !== originalData.email) dadosAtualizados.email = email;

        // Editar método de autenticação para não salvar senha diretamente
        if (newPassword) dadosAtualizados.newPassword = newPassword;

        if (Object.keys(dadosAtualizados).length === 0){
            Alert.alert('Aviso', 'Nenhum dado foi alterado.');
            return;
        }

        try {
            setLoading(true);
            await updateDoc(doc(getFirestore(app), 'users', userId), dadosAtualizados);
            Alert.alert('Sucesso', 'Dados atualizados!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar os dados.')
        } finally {
            setLoading(false);
        }
    }

    const campos = [
        { label: 'Nome', value: user, setter: setUser, placeholder: 'Digite seu nome' },
        { label: 'Senha Atual', value: password, setter: setPassword, placeholder: 'Senha atual' },
        { label: 'Nova Senha', value: newPassword, setter: setNewPassword, placeholder: 'Nova senha' },
        { label: 'Email', value: email, setter: setEmail, placeholder: 'Digite seu email' },
    ];

    return (
        <View style={styles.container}>
            <View>
                {campos.map((campo, index) => (
                    <View key={index} style={{ marginBottom: 16 }}>
                        <Text style={styles.label}>{campo.label}</Text>
                        <TextInput
                            value={campo.value}
                            onChangeText={campo.setter}
                            placeholder={campo.placeholder}
                            placeholderTextColor="#666"
                            style={styles.inputProfile}
                        />
                    </View>
                ))}
            </View>

            <View>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={salvarDados}
                    disabled={loading}
                >
                    <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={loading}
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <ActivityIndicator size="large" color="#007BFF" />  
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
        fontWeight: '500',
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
})

// Refatorar com Formulário controlado (ex: com Formik).
// Adicionar validações com Yup.