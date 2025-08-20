import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList} from "react-native";
import { db } from "../firebaseConfig";
import {collection, getDocs, doc, setDoc, deleteDoc} from "firebase/firestore";
import {useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getExerciciosDoTreino, getWorkouts } from "../services/workoutService";
import { getUser } from '../services/getUser';
import { COLORS } from "./styles/default";
import ModernButton from "../utils/ModernButton";
import IconButton from "../utils/IconButton";
import ModernInput from "../utils/ModernInput";

export default function Treinos({navigation}){
    const [user, setUser] = useState();
    const [treinos, setTreinos] = useState([]);
    const [campoAdicionando, setCampoAdicionando] = useState(false);
    const [campoConfimacao, setCampoConfirmacao] = useState(false);
    const [textNewTreino, setTextNewTreino] = useState();
    const [treinoId, setTreinoId] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);
    
    useEffect(() => {
        getUser(setUser, navigation);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTreinos();
        }, [user])
    );

    // useEffect(() => {
    //     if (user) {
    //         navigation.setOptions({
    //             headerRight: () => (
    //                 <TouchableOpacity onPress={loadTreinos}>
    //                 <Text style={{Color: 'black', padding: 5, marginTop: 35}}>
    //                     Atualizar
    //                 </Text>
    //             </TouchableOpacity>
    //         ),           
    //     });
    // }
    // }, [navigation, user]);

    const loadTreinos = async () => {
        try{
            setLoadingVisible(true);
            const treinosList = await getWorkouts(user);
            setTreinos(treinosList);

            setLoadingVisible(false);
        }catch(error){
            console.log('Erro na função loadTreinos: ',error)
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
            await loadTreinos(user);
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
                        color={"black"}
                    />
                </View>
            )}
            <FlatList
                data={treinos}
                renderItem={({item}) => {
                    if(!item.workoutDone){
                        return (
                            <TouchableOpacity onPress={async() => {
                                const detalhes = await getExerciciosDoTreino(user, item.id);
                                navigation.navigate('DetalhesTreino', {
                                    treinoDetalhe: detalhes, treino: item.id, });
                            }}>
                                <View style={{...styles.listaTreinos, flexDirection: 'row'}} key={item.id}>
                                    <Text style={{...styles.textTituloTreino, flex: 1}}>{item.titulo}</Text>
                                    <IconButton
                                        onPress={() => (setTreinoId(item.id), setCampoConfirmacao(true))}
                                        icon={"trash-alt"}
                                        backgroundColor = {'#ff2600c0'}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }}
                keyExtractor={(item) => item.id}
            />
            <View style={{width: '60%', alignSelf: 'center'}}>
                <ModernButton
                    text="Adicionar Treino"
                    onPress={() => setCampoAdicionando(true)}
                    icon="plus"
                />
            </View>
            {campoAdicionando && (
                <View
                    style={{
                        ...StyleSheet.absoluteFill,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={{flexDirection:'row', width: '98%', justifyContent:'flex-end'}}>
                                <IconButton
                                    onPress={() => setCampoAdicionando(false)}
                                    icon={"times"}
                                    color="black"
                                    backgroundColor="#fafafaff"
                                />
                            </View>
                            <View style={{margin: 5}}>
                                <ModernInput
                                    placeholder={"Digite o nome do treino"}
                                    onChangeText={(titulo) => setTextNewTreino(titulo)}
                                />
                            </View>
                            <View style={{margin: 5}}>
                                <ModernButton
                                    text={"Salvar"}
                                    onPress={() => setNewTreino(textNewTreino)}
                                    icon={"save"}
                                />
                            </View>
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
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={{flexDirection:'row',width: '98%', justifyContent:'flex-end'}}>
                                <IconButton
                                    onPress={() => setCampoConfirmacao(false)}
                                    icon={"times"}
                                    color="black"
                                    backgroundColor="#fafafaff"
                                />
                            </View>
                            <Text style={{fontSize: 20, fontWeight: 500, marginVertical: 10}}>Tem certeza que deseja excluir?</Text>
                            <ModernButton
                                text="Excluir"
                                onPress={() => (deleteTreino(treinoId), setCampoConfirmacao(false))}
                                icon="trash-alt"
                                colors={["#D30000","#FF2800"]}
                            />
                            <Text style={{fontSize: 10, color:'#e9210fff', padding: 5}}>Essa ação não pode ser desfeita</Text>
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
        backgroundColor: COLORS.list_2,
    },
    textTituloTreino: {
        color: '#000000ff',
        fontSize: 20,
        fontFamily: 'arial',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
