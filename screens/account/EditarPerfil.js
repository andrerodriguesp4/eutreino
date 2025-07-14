import { TextInput, Text, View, TouchableOpacity, Alert, ActivityIndicator, Modal, Image } from "react-native";
import app from "../../firebaseConfig";
import { getFirestore, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../account/styles/styles'
import PasswordField from "./components/Passwordfield";
import PasswordConfirmationModal from "./components/PasswordConfirmationModal";

export default function EditarPerfil({navigation}){
    const [originalData, setOriginalData] = useState({});
    const [user, setUser] = useState('');
    // const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState('');

    const [ShowDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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
                    // setSenha(data.senha || '');
                    setEmail(data.email || '');
                    // setNickname(data.nickname || '');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }

        carregarDadosUsuario();
    }, [userId]);

    async function atualizarDados() {
        if(!userId){
            Alert.alert('Erro', 'Usuário não encontrado');
            return;
        }
        if (newPassword && !senha) {
            Alert.alert('Erro', 'Digite sua senha atual para alterar a senha.');
            return;
        }

        const dadosAtualizados = {};
        if (user !== originalData.user) dadosAtualizados.user = user;
        // if (nickname) dadosAtualizados.nickname = nickname;
        if (email !== originalData.email) dadosAtualizados.email = email;

        // Editar método de autenticação para não salvar senha diretamente
        if (newPassword) dadosAtualizados.senha = newPassword;

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

    async function excluirUser() {
        if(!userId){
            Alert.alert('Erro', 'Usuário não encontrado');
            return;
        }
        if (!confirmPassword){
            Alert.alert('Erro', 'Digite sua senha para continuar.');
            return;
        }

        try {
            setDeleting(true);
            setDeleteError('');

            const db = getFirestore(app);
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                setDeleteError('Usuário não encontrado.');
                return;
            }
            const userData = userSnap.data();
            const senhaBanco = userData.senha;

            if (confirmPassword !== senhaBanco) {
                setDeleteError('Senha incorreta.');
                return;
            }
            
            await deleteDoc(userRef);
            Alert.alert('Sucesso', 'Conta ecluída com sucesso!');
            
            setShowDeleteModal(false);
            setConfirmPassword('');
            await AsyncStorage.removeItem('usuario');
            navigation.reset({
                index: 0,
                routes: [{name: 'Login'}]
            });
        } catch (error){
            setDeleteError('Erro inesperado ao excluir a conta.'); 
        } finally {
            setDeleting(false);
        }
    }

    const campos = [
        { label: 'Nome', value: user, setter: setUser, placeholder: 'Digite seu nome' },
        { label: 'Email', value: email, setter: setEmail, placeholder: 'Digite seu email' },
    ];

    // const ProfilePicture = ({userImage}) => {
    //     const defaultImage = require('../../source/perfil.png');
    //     const profileImage = userImage ? {url: userImage} : {url: defaultImage};

    //     return(
    //         <View style={styles.imageContainer}>
    //             <Image source={defaultImage} style={styles.image} />
    //         </View>
    //     )
    // }

    return (
        <View style={{flex:1}}>
            <View style={styles.imageContainer}>
                <Image source={require('../../source/perfil.png')} style={styles.image} />
            </View>
            <View style={styles.container}>
                <View>
                    {campos.map((campo, index) => (
                        <View key={index}>
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
                    <PasswordField
                        label={"Senha Atual"}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder={"Senha Atual"}
                    />

                    <PasswordField
                        label={"Nova Senha"}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder={"Nova Senha"}
                    />        
                </View>

                <View style={styles.footContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={atualizarDados}
                        disabled={loading}
                    >
                        <Text style={styles.saveText}>Salvar Dados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <Text style={styles.deleteText}>Excluir Conta</Text>
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
                <PasswordConfirmationModal
                    visible={ShowDeleteModal}
                    password={confirmPassword}
                    onChangePassword={setConfirmPassword}
                    onCancel={()=>{
                        setShowDeleteModal(false);
                        setConfirmPassword('');
                        setDeleteError('');
                    }}
                    onConfirm={excluirUser}
                    loading={deleting}
                    errorMessage={deleteError}
                />
            </View>
        </View>
    );
}

// Refatorar com Formulário controlado (ex: com Formik).
// Adicionar validações com Yup.