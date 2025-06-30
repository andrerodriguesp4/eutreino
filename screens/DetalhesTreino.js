import { View, Text, VirtualizedList, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import app from "../firebaseConfig";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where} from "firebase/firestore";
import {use, useEffect, useState } from "react";
import * as Config from './Treinos';
import {Ionicons} from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

export default function DetalhesTreino(){
    const route = useRoute();
    const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [campoEditando, setCampoEditando] = useState(null);
    const [newExercicioSelect, setNewExercicioSelect] = useState();
    const [exercicios, setExercicios] = useState([]);
    const [textState, setTextState] = useState();

    useEffect(() => {
        fetchExercicios();
    }, []);
    const fetchExerciciosSelectDetalhes = async (exercicio) => {
        try {
            const treinoDetalhe = route.params.treinoDetalhe;
            const filterList = treinoDetalhe.filter((item) => item.id === exercicio);

            setExercicioSelectDetalhe(filterList);
        } catch {
            console.log(error)(
                "Erro na função fetchExerciciosSelectDetalhes: ",
                error
            );
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
            <Modal visible={modalVisible}>
                <View style={styles.containerModal}>
                    <View style={styles.modalContent}>
                        <Text>
                            Clique no ítem para editar
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{padding: 20}}>
                            <Ionicons name="close" size={50} color="black" />
                        </TouchableOpacity>
                        {exercicioSelectDetalhe.map((item, index) => (
                            <View key={index}>
                                <TouchableOpacity onPress={() => setCampoEditando('titulo')}>
                                    <Text style={styles.modalText}>
                                        Exercício: {item.titulo}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setCampoEditando('carga')}>
                                    <Text style={styles.modalText}>
                                        Carga: {item.carga} kg
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setCampoEditando('repeticoes')}>
                                    <Text style={styles.modalText}>
                                        Repetições: {item.repeticoes.minimo} - {item.repeticoes.maximo}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setCampoEditando('series')}>
                                    <Text style={styles.modalText}>
                                        Séries: {item.series}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setCampoEditando('descanso')}>
                                    <Text style={styles.modalText}>
                                        Descanso: {item.descanso} segundos
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            {campoEditando && (
                <View style={styles.slidePanel}>
                    <Text style={styles.modalText}>Editando: {campoEditando}</Text>
                    {campoEditando === 'titulo' && (
                        <View>
                            <Text style={styles.modalText}>Selecione o exercício:</Text>
                            <Picker
                                selectedValue={newExercicioSelect}
                                onValueChange={(itemValue) => {
                                    setNewExercicioSelect(itemValue)
                                    setTextState('Salvar')
                                }}
                                style={{height: 50, width: 300, paddingBottom: 150}}
                                itemStyle={{color: 'black'}}
                            >
                                {exercicios.map((item) => (
                                    <Picker.Item key={item.id} label={item.titulo} value={item.titulo}/>
                                ))}
                            </Picker>
                        </View>
                    )}
                    <TouchableOpacity onPress={() => setCampoEditando(null)} style={{padding: 20}}>
                    <Ionicons name="close" size={50} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            </Modal>
            <VirtualizedList
                data={route.params.treinoDetalhe}
                getItemCount={(treinoDetalhe) => treinoDetalhe.length}
                getItem={(treinoDetalhe, index) => treinoDetalhe[index]}
                renderItem={({item, index}) => (
                    <View key={index}>
                        <TouchableOpacity style={styles.buttonListExercicio} onPress={() => (
                                fetchExerciciosSelectDetalhes(item.id),
                                setModalVisible(true)
                                )}>
                            <Text style={styles.textListExercicio}>
                                {item.titulo}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    containerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    modalContent: {
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        marginVertical: 10,
    },
    textListExercicio: {
        fontSize: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ffffff8a',
        
    },
    buttonListExercicio: {
        backgroundColor: '#ff9f9f',
        padding: 10,
        marginBottom: 2,
        marginHorizontal: 5,
    },
    slidePanel: {
        position: 'absolute',
        height: '50%',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    }
});
