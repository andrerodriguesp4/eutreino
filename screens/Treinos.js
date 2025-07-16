import { View, Text, StyleSheet, TouchableOpacity, VirtualizedList, Modal, TextInput} from "react-native";
import app from "../firebaseConfig";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where} from "firebase/firestore";
import {useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Treinos({navigation}){
    const [user, setUser] = useState();
    const [treinos, setTreinos] = useState([]);
    const [exercicios, setExercicios] = useState([]);
    const [treinoId, setTreinoId] = useState(0);
    const [treinoSelect, setTreinoSelect] = useState();
    const [treinoDetalhe, setTreinoDetalhe] = useState([]);
    const [treinoSelectDetalhe, setTreinoSelectDetalhe] = useState([]);
    
    useEffect(() => {
        getUser();
        fetchExercicios();
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

    async function getUser() {
            try{
                const usuario = await AsyncStorage.getItem('usuario');                
                if(!usuario){
                    navigation.navigate('Home')
                }else{
                    setUser(usuario);
                    fetchTreinos(usuario);
                }
            }catch{
                console.log('Erro na função getUser: ', error)
            }
    }
        
    const fetchTreinos = async (usuario) => {
        try{
            if(usuario){            
                const db = getFirestore(app);
                const treinosCollection = collection(db, `users/${usuario}/treinos`);
                const querySnapshot = await getDocs(treinosCollection);

                const treinosList = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                }))

                setTreinos(treinosList);
            }
        }catch(error){
            console.log('Erro na função fetchTreinos: ',error)
        }
    };

    const fetchExerciciosSelect = async (usuario, treino) => {
        try{
            const db = getFirestore(app);
            const treinosCollection = collection(db, `users/${usuario}/treinos/${treino}/exercicios`);
            const querySnapshot = await getDocs(treinosCollection);

            const exerciciosTreinoList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));      
            setTreinoDetalhe(exerciciosTreinoList);
            return exerciciosTreinoList;
        }catch(error){
            console.log('Erro na função fetchExerciciosSelect: ', error)
        }
    };

    const fetchExercicios = async () => {
        try{
            const db = getFirestore(app);
            const exerciciosCollection = collection(db, 'exercicios');
            const querySnapshot = await getDocs(exerciciosCollection);

            const exerciciosList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }))

            setExercicios(exerciciosList)
        }catch(error){
            console.log('Erro na função fetchExercicios: ', error)
        }
    };

    return(
        <View style={styles.container}>
            <VirtualizedList
                data={treinos}
                getItemCount={(treinos) => treinos.length}
                getItem={(treinos, index) => treinos[index]}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={async() => {
                                    setTreinoId(item.id);
                                    setTreinoSelect(item.titulo);
                                    const detalhes = await fetchExerciciosSelect(user, item.id);
                                    const treinoRoute = item.id;
                                    navigation.navigate('DetalhesTreino', { treinoDetalhe: detalhes, treino: treinoRoute });
                            }}>
                        <View style={styles.listaTreinos} key={item.id}>
                                <Text style={styles.textTituloTreino}>{item.titulo}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
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
});

