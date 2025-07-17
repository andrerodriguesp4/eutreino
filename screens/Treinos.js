import { View, Text, StyleSheet, TouchableOpacity, VirtualizedList, TextInput, ActivityIndicator} from "react-native";
import { db } from "../firebaseConfig";
import {collection, getDocs, doc, setDoc, deleteDoc} from "firebase/firestore";
import {useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Treinos({navigation}){
    const [user, setUser] = useState();
    const [treinos, setTreinos] = useState([]);
    const [campoAdicionando, setCampoAdicionando] = useState(false);
    const [campoConfimacao, setCampoConfirmacao] = useState(false);
    const [textNewTreino, setTextNewTreino] = useState();
    const [treinoId, setTreinoId] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);
    
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => getUser()}>
                    <Text style={{color: 'black', margin: 5, padding: 5, marginTop: '50%'}}>
                        Atualizar
                    </Text>
                </TouchableOpacity>
            ),           
        });
    }, [navigation])

    function sleep(ms){
        return new Promise(result => setTimeout(result, ms))
    };

    async function getUser() {
            try{
                const usuario = await AsyncStorage.getItem('usuario');                
                if(!usuario){
                    navigation.navigate('Home')
                }else{
                    setUser(usuario);
                    fetchTreinos();
                }
            }catch{
                console.log('Erro na função getUser: ', error)
            }
    }
        
    const fetchTreinos = async () => {
        try{
            setLoadingVisible(true);
            if(user){
                const treinosCollection = collection(db, `users/${user}/treinos`);
                const querySnapshot = await getDocs(treinosCollection);

                const treinosList = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                }))

                setTreinos(treinosList);
            }
            await sleep(200)
            setLoadingVisible(false);
        }catch(error){
            console.log('Erro na função fetchTreinos: ',error)
        }
    };

    const fetchExerciciosSelect = async (treino) => {
        try{
            const treinosCollection = collection(db, `users/${user}/treinos/${treino}/exercicios`);
            const querySnapshot = await getDocs(treinosCollection);

            const exerciciosTreinoList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));      
            
            return exerciciosTreinoList;
        }catch(error){
            console.log('Erro na função fetchExerciciosSelect: ', error)
        }
    };
    
    async function setNewTreino(titulo) {
        try{
            setLoadingVisible(true);
            const treinoRef = collection(db, `users/${user}/treinos`);
            const snapshot = await getDocs(treinoRef);


            let maiorId = -1;
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (typeof data.id === "number" && data.id > maiorId) {
                maiorId = data.id;
                }
            });

            const novoId = maiorId + 1;
            await setDoc(doc(treinoRef, novoId.toString()),{
                titulo,
                id: novoId,
            });

            setTreinos((prev) => [
                ...prev,
                {
                    titulo,
                    id: novoId,
                }
            ])
            setCampoAdicionando(false);
            setLoadingVisible(false);
        }catch(error){
            console.log('Erro na função setNewTreino', error);
        }
        
    };

    async function deleteTreino(tituloId) {
        try{
            const treinoRef = doc(db, `users/${user}/treinos`, tituloId.toString());
            const exerciciosRef = collection(treinoRef, 'exercicios');
            const exerciciosSnapshot = await getDocs(exerciciosRef);

            const deletePromises = exerciciosSnapshot.docs.map((doc) => 
                deleteDoc(doc.ref)
            );

            
            await Promise.all(deletePromises);
            await deleteDoc(treinoRef);
            getUser();
        }catch(error){
            console.log('Erro na função deleteTreino', error);
        }
    }

    return(
        <View style={styles.container}>
            {loadingVisible && (
                <View style={styles.viewLoading}>
                    <ActivityIndicator
                    size={"large"}
                    />
                </View>
            )}
            <VirtualizedList
                data={treinos}
                getItemCount={(treinos) => treinos.length}
                getItem={(treinos, index) => treinos[index]}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={async() => {
                                    const detalhes = await fetchExerciciosSelect(item.id);
                                    const treinoRoute = item.id;
                                    navigation.navigate('DetalhesTreino', { treinoDetalhe: detalhes, treino: treinoRoute });
                            }}>
                        <View style={{...styles.listaTreinos, flexDirection: 'row'}} key={item.id}>
                                <Text style={{...styles.textTituloTreino, flex: 1}}>{item.titulo}</Text>
                                <TouchableOpacity onPress={() => (setTreinoId(item.id), setCampoConfirmacao(true))}>
                                    <FontAwesome5 name="trash-alt" size={20}/>
                                </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => (
                    <TouchableOpacity
                    style={{
                        ...styles.buttonAdicionarTreino,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                    onPress={() => setCampoAdicionando(true)}
                    >
                    <FontAwesome5 name="plus" color={"white"} size={20} />
                    <Text style={{ ...styles.textAdicionarTreino}}>
                        Adicionar Treino
                    </Text>
                    </TouchableOpacity>
                )}
            />
            {campoAdicionando && (
                <View
                    style={{
                        ...StyleSheet.absoluteFill,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                pointerEvents="auto"
                >
                    <View style={styles.slidePanel}>
                        <View style={{...styles.viewAdicionandoNome, width: "70%"}}>
                            <TextInput 
                                placeholder="Digite o nome do treino"
                                onChangeText={(titulo) => setTextNewTreino(titulo)}    
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.buttonSalvar} onPress={() => setNewTreino(textNewTreino)}>
                                <Text>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setCampoAdicionando(false)}>
                                <FontAwesome5 name="times" size={25}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            {campoConfimacao && (
                <View 
                    style={{
                            ...StyleSheet.absoluteFill,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                        }}
                    pointerEvents="auto"
                >
                    <View style={styles.slidePanel}>
                        <View>
                            <Text style={{fontSize: 20, bottom: 10}}>Tem certeza que deseja excluir?</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.buttonExcluir} onPress={() => (deleteTreino(treinoId), setCampoConfirmacao(false))}>
                                <Text>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{left: 20}} onPress={() => setCampoConfirmacao(false)}>
                                <FontAwesome5 name="times" size={25}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 1,
    },
    listaTreinos: {
        marginVertical: 1,
        marginHorizontal: 2,
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#fa801c63',
    },
    textTituloTreino: {
        color: '#000000ff',
        fontSize: 20,
        fontFamily: 'arial',
    },
    buttonAdicionarTreino:{
        backgroundColor: "#923a079a",
        padding: 10,
        marginBottom: 2,
        marginHorizontal: 2,
    },
    textAdicionarTreino:{
        fontSize: 20,
        padding: 5,
        color: "#ffffff",
    },
    slidePanel: {
        position: "absolute",
        height: "50%",
        left: 5,
        right: 5,
        top: 5,
        backgroundColor: "white",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: "center", // centraliza verticalmente
        alignItems: "center", // centraliza horizontalmente
    },
    viewAdicionandoNome:{
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonExcluir: {
        backgroundColor: '#ff7676',
        padding: 10,
        borderRadius: 5,
        right: 20,
    },
    buttonSalvar: {
        backgroundColor: '#76ff8d',
        padding: 10,
        borderRadius: 5,
        right: 20,
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
});

