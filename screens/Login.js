import { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native"
import { db } from "../firebaseConfig";
import {collection, doc, getDocs, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from '@expo/vector-icons'

export default function Login({navigation}){
    
    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    const [email, setEmail] = useState();
    const [repSenha, setRepSenha] = useState();
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [senhaVisible, setSenhaVisible] = useState(true);
    const [loadingVisible, setLoadingVisible] = useState(false);

    async function fetchUsers() {
            const usersCollection = collection(db, 'users')
            const querySnapshot = await getDocs(usersCollection)
    
            const userslist = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }))

            setListaUsuarios(userslist)
    }
    
    useEffect(() => {
        fetchUsers();
    }, [])

    function navegar(){
        navigation.navigate('UserArea');
    }

    function checkUser(usuarioCheck, senhaCheck){
        const usuarioTeste = listaUsuarios.find(item => item.user === usuarioCheck)
        if(usuarioTeste && usuarioTeste.senha === senhaCheck){
            return true
        }else{
            return false
        }
    }

    async function logIn(user, password){
        setLoadingVisible(true)
        if(!usuario){
            setLoadingVisible(false)
            alert('Digite o usuário!')
        }else{
            if(!senha){
                setLoadingVisible(false)
                alert('Digite a senha!')
            }else{
                const testUser = checkUser(user, password)

                if (testUser === true){
                    const usersRef = collection(db, 'users');
                    const snapshot = await getDocs(usersRef);
                    const snapshotMap = snapshot.docs.map((doc) => ({
                        ...doc.data()
                    }));
                    const userSelect = snapshotMap.find(item => item.user === user);
                    const userId = userSelect.id;
                    await AsyncStorage.setItem('usuario', userId.toString());
                    await AsyncStorage.setItem('senha', password);
                    setLoadingVisible(false)
                    navegar()
                }else{
                    setLoadingVisible(false)
                    setUsuario(null)
                    setSenha(null)
                    alert('Usuário ou senha inválidos!')
                }
            }
        }
    }

    function checkEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    async function createUser(user, password, email) {
        setLoadingVisible(true)
        if (!checkEmail(email)){
            setLoadingVisible(false)
            setEmail(null)
            alert('Digite um e-mail válido!')
        }else{
            const usuarioTeste = listaUsuarios.find(item => item.user == user);
            const emailTeste = listaUsuarios.find(item => item.email == email);
            const userRef = collection(db, 'users');
            const snapshot = await getDocs(userRef);
            let maiorId = -1;
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (typeof data.id === "number" && data.id > maiorId) {
                maiorId = data.id;
                }
            });

            const novoId = maiorId + 1;
            if (usuarioTeste){
                setUsuario(null)
                setLoadingVisible(false)
                alert('Usuário já existe!')
            }else{
                if(emailTeste){
                    setEmail(null)
                    setLoadingVisible(false)
                    alert('Endereço de email já utilizado!')
                }else{
                    if(!senha || !repSenha){
                        setSenha(null)
                        setRepSenha(null)
                        setLoadingVisible(false)
                        alert('Digite a senha!')
                    }else{
                        if(senha !== repSenha){
                            setSenha(null)
                            setRepSenha(null)
                            setLoadingVisible(false)
                            alert('As senhas não coincidem!')
                        }else{
                            await setDoc(doc(db, 'users', novoId.toString()), { user: user, senha: password, email: email, id: novoId });
                            setUsuario(null)
                            setEmail(null)
                            setSenha(null)
                            setRepSenha(null)
                            setLoadingVisible(false)
                            alert('Usuário criado com sucesso!')
                            await fetchUsers()
                        }                       
                    }
                }            
            }
        }
    }

    function mostrarSenha(){
        if(senhaVisible == true){
            setSenhaVisible(false)
        }else{
            setSenhaVisible(true)
        }
    }
    function voltar(){
        setUsuario(null);
        setSenha(null);
        setEmail(null);
        setRepSenha(null);
        setModalVisible(false);
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
                        value={usuario}
                        onChangeText={setUsuario}
                        placeholder="Digite o usuário"
                        placeholderTextColor='#666'
                        style={styles.inputLogin}
                    />
                    <TextInput
                        secureTextEntry={senhaVisible}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite a senha"
                        placeholderTextColor='#666'
                        style={styles.inputLogin}
                    />
                </View>
                <View style={styles.viewMostarSenha}>
                    <TouchableOpacity onPress={() => mostrarSenha()}>
                        <Text>
                            Mostrar senha
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewButtons}>
                    <TouchableOpacity onPress={() => logIn(usuario, senha)} style={styles.buttonLogin}>
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
                <Modal 
                    visible={modalVisible}
                    animationType="fade"
                >
                    <View style={styles.container}>
                        {loadingVisible && (
                            <View style={styles.viewLoading}>
                                <ActivityIndicator
                                    size='large'
                                />
                            </View>
                        )}
                        <View style={styles.viewModal}>
                            <View style={styles.viewForm}>                       
                                <View>
                                    <TextInput
                                        value={usuario}
                                        onChangeText={setUsuario}
                                        placeholder="Digite o usuário"
                                        placeholderTextColor='#666'
                                        style={styles.inputLogin}
                                    />
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Digite o e-mail"
                                        placeholderTextColor='#666'
                                        keyboardType="email-address"
                                        style={styles.inputLogin}                                    
                                    />
                                    <TextInput
                                        secureTextEntry={senhaVisible}
                                        value={senha}
                                        onChangeText={setSenha}
                                        placeholder="Digite a senha"
                                        placeholderTextColor='#666'
                                        style={styles.inputLogin}
                                    />
                                    <TextInput
                                        secureTextEntry={senhaVisible}
                                        value={repSenha}
                                        onChangeText={setRepSenha}
                                        placeholder="Digite a senha novamente"
                                        placeholderTextColor={'#666'}
                                        style={styles.inputLogin}
                                    />
                                    <TouchableOpacity onPress={() => mostrarSenha()} style={styles.viewMostarSenha}>
                                        <Text>
                                            Mostrar Senha
                                        </Text>
                                    </TouchableOpacity>
                                </View>                            
                                <View style={styles.viewButtons}>
                                    <TouchableOpacity onPress={() => createUser(usuario, senha, email)} style={styles.buttonLogin}>
                                        <Text>
                                            Cadastrar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => voltar()} style={styles.voltarButton}>
                                        <Ionicons name="chevron-back" size={17}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        backgroundColor: '#cec5ffff',
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
        backgroundColor: '#cec5ffff',
        borderRadius: 25,
    },
    viewMostarSenha: {
        alignItems: 'flex-end',
        marginTop: -5,
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