import { View, Text, VirtualizedList, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import app from "../firebaseConfig";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where} from "firebase/firestore";
import {use, useEffect, useState } from "react";
import * as Config from './Treinos';
import {Ionicons} from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetalhesTreino(){
    const route = useRoute();
    const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [campoEditando, setCampoEditando] = useState(null);
    const [newExercicioSelect, setNewExercicioSelect] = useState();
    const [exercicios, setExercicios] = useState([]);
    const [user, setUser] = useState();
    const treino = route.params.treino;
    const [listExercicio, setListExercicio] = useState(route.params.treinoDetalhe);
    const [disabledSalvar, setDisabledSalvar] = useState(true);
    const [newRepeticoesMinimo, setNewRepeticoesMinimo] = useState();
    const [newRepeticoesMaximo, setNewRepeticoesMaximo] = useState();
    const [checkButton, setCheckButton] = useState('stop-outline');

    useEffect(() => {
        fetchExercicios();
        getUser();
    }, []);
    async function getUser() {
            try{
                const usuario = await AsyncStorage.getItem('usuario');                
                if(!usuario){
                    navigation.navigate('Home')
                }else{
                    setUser(usuario);
                    fetchTreinos(usuario);
                }
            }catch (error){
                console.log('Erro na função getUser: ', error)
            }
    };
    const fetchExerciciosSelectDetalhes = async (exercicio) => {
        try {
            const filterList = listExercicio.filter((item) => item.id === exercicio);

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

    async function setNewParametros(user, treino, exercicio, parametro, newParametros) {
        try{
            const db = getFirestore(app);
            const treinosCollection = collection(db, `users/${user}/treinos/${treino}/exercicios`);
            const docSelect = query(treinosCollection, where('id', '==', exercicio));
            const querySnapshot = await getDocs(docSelect);
            for (const document of querySnapshot.docs) {
                    await updateDoc(doc(db, document.ref.path), {
                    [parametro]: newParametros,
                });
            }

            const atualizarItem = (item) => {
                if (item.id !== exercicio) return item;


                if (parametro === 'repeticoes.minimo') {
                    return {
                        ...item,
                        repeticoes: {
                            ...item.repeticoes,
                            minimo: newParametros,
                        },
                    };
                }
                
                if (parametro === 'repeticoes.maximo') {
                    return {
                        ...item,
                        repeticoes: {
                            ...item.repeticoes,
                            maximo: newParametros,
                        },
                    };
                }
                return {
                    ...item,
                    [parametro]: newParametros,
                };
            }

            setListExercicio((prev) => prev.map(atualizarItem));

            setExercicioSelectDetalhe((prev) => prev.map(atualizarItem));

            setCampoEditando(null);
            setNewRepeticoesMaximo(null);
            setNewRepeticoesMinimo(null);
            setDisabledSalvar(true);
        }catch(error){
            console.log('Erro ao salvar:', error)
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
                                <TouchableOpacity onPress={() => (
                                    setCampoEditando('repeticoes'),
                                    setNewRepeticoesMaximo(null),
                                    setNewRepeticoesMinimo(null)
                                    )}>
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
                <>
                    <View style={{...StyleSheet.absoluteFill, backgroundColor:'rgba(0, 0, 0, 0.3)'}} pointerEvents="auto" />                  
                    <View style={styles.slidePanel}>
                        {campoEditando === 'titulo' && (
                            <View style={styles.viewEditando}>
                                <Text style={styles.textTituloEditando}>Selecione o exercício:</Text>
                                <Picker
                                    selectedValue={newExercicioSelect}
                                    onValueChange={(itemValue) => {
                                        setNewExercicioSelect(itemValue);
                                        setDisabledSalvar(false);
                                    }}
                                    style={{height: 50, width: 300, paddingBottom: 200}}
                                    itemStyle={{color: 'black'}}
                                >
                                    {exercicios.map((item) => (
                                        <Picker.Item key={item.id} label={item.titulo} value={item.titulo}/>
                                    ))}
                                </Picker>
                                <View style={styles.viewSalvarFechar}>
                                    <TouchableOpacity 
                                        style={{...styles.touchableOpacitySalvar, opacity: disabledSalvar ? 0.5 : 1}} disabled={disabledSalvar} 
                                        onPress={() => (
                                            setNewParametros(user, treino, exercicioSelectDetalhe[0].id, campoEditando, newExercicioSelect),
                                            setDisabledSalvar(true)
                                            )}>
                                        <Text style={styles.textSalvar}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (
                                            setCampoEditando(null),
                                            setDisabledSalvar(true),
                                            setNewExercicioSelect(listExercicio[0].titulo)
                                        )} style={{padding: 20}}>
                                        <Ionicons name="close" size={40} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {campoEditando === 'carga' && (
                            <View style={styles.viewEditando}>
                                <Text style={styles.textTituloEditando}>Insira a nova carga: </Text>
                                <View style={styles.viewSalvarFechar}>
                                    <TextInput 
                                        style={styles.textInputEditando}
                                        placeholder={listExercicio[0].carga}
                                        placeholderTextColor={'#0000006e'}
                                        keyboardType="numeric"
                                        onChange={(itemValue) => (setNewExercicioSelect(itemValue.nativeEvent.text), setDisabledSalvar(false))}
                                    />
                                    <Text style={{marginLeft: 15, fontSize: 20}}>Kg</Text>
                                </View>
                                <View style={styles.viewSalvarFechar}>
                                    <TouchableOpacity 
                                        style={{...styles.touchableOpacitySalvar, opacity: disabledSalvar ? 0.5 : 1}} disabled={disabledSalvar} 
                                        onPress={() => (
                                            setNewParametros(user, treino, exercicioSelectDetalhe[0].id, campoEditando, newExercicioSelect),
                                            setDisabledSalvar(true)
                                            )}>
                                        <Text style={styles.textSalvar}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (
                                        setCampoEditando(null),
                                        setDisabledSalvar(true)
                                        )}>
                                        <Ionicons name="close" size={40}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {campoEditando === 'repeticoes' && (
                            <View style={styles.viewEditando}>
                                <Text style={styles.textTituloEditando}>Insira o novo intervalo de repetições: </Text>
                                <View style={styles.viewSalvarFechar}>
                                    <TextInput 
                                        style={styles.textInputEditando}
                                        placeholder={listExercicio[0].repeticoes.minimo.toString()}
                                        placeholderTextColor={'#0000006e'}
                                        keyboardType="numeric"
                                        onChange={(itemValue) => (setNewRepeticoesMinimo(itemValue.nativeEvent.text), setDisabledSalvar(false))}
                                    />
                                    <Text style={{marginHorizontal: 20}}>-</Text>
                                    <TextInput 
                                        style={styles.textInputEditando}
                                        placeholder={listExercicio[0].repeticoes.maximo.toString()}
                                        placeholderTextColor={'#0000006e'}
                                        keyboardType="numeric"
                                        onChange={(itemValue) => (setNewRepeticoesMaximo(itemValue.nativeEvent.text), setDisabledSalvar(false))}
                                    />    
                                </View>
                                <View style={styles.viewSalvarFechar}>
                                    <TouchableOpacity 
                                        style={{...styles.touchableOpacitySalvar, opacity: disabledSalvar ? 0.5 : 1}} disabled={disabledSalvar} 
                                        onPress={() => {
                                            newRepeticoesMinimo && setNewParametros(user, treino, exercicioSelectDetalhe[0].id, 'repeticoes.minimo', newRepeticoesMinimo);
                                            newRepeticoesMaximo && setNewParametros(user, treino, exercicioSelectDetalhe[0].id, 'repeticoes.maximo', newRepeticoesMaximo);
                                            setNewRepeticoesMinimo(null);
                                            setNewRepeticoesMaximo(null);
                                            setDisabledSalvar(true);
                                        }}
                                        >
                                        <Text style={styles.textSalvar}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (
                                        setCampoEditando(null),
                                        setDisabledSalvar(true),
                                        setNewRepeticoesMaximo(null),
                                        setNewRepeticoesMinimo(null)
                                        )}>
                                        <Ionicons name="close" size={40}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {campoEditando === 'series' && (
                            <View style={styles.viewEditando}>
                                <Text style={styles.textTituloEditando}>Insira a nova quantidade de séries:</Text>
                                <TextInput 
                                        style={styles.textInputEditando}
                                        placeholder={listExercicio[0].series}
                                        placeholderTextColor={'#0000006e'}
                                        keyboardType="numeric"
                                        onChange={(itemValue) => (setNewExercicioSelect(itemValue.nativeEvent.text), setDisabledSalvar(false))}
                                    />
                                <View style={styles.viewSalvarFechar}>
                                    <TouchableOpacity style={{...styles.touchableOpacitySalvar, opacity: disabledSalvar ? 0.5 : 1}} disabled={disabledSalvar} 
                                        onPress={() => (setNewParametros(user, treino, exercicioSelectDetalhe[0].id, campoEditando, newExercicioSelect))}
                                    >
                                        <Text style={styles.textSalvar}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (
                                            setDisabledSalvar(true),
                                            setCampoEditando(null)
                                        )}>
                                        <Ionicons name="close" size={30}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {campoEditando === 'descanso' && (
                            <View style={styles.viewEditando}>
                                <Text style={styles.textTituloEditando}>Insira o novo tempo de descanso:</Text>
                                <View style={styles.viewSalvarFechar}>
                                    <TextInput 
                                        style={styles.textInputEditando}
                                        placeholder={listExercicio[0].descanso.toString()}
                                        placeholderTextColor={'#0000006e'}
                                        keyboardType="numeric"
                                        onChange={(itemValue) => (setNewExercicioSelect(itemValue.nativeEvent.text), setDisabledSalvar(false))}
                                    />
                                    <Text style={{marginLeft: 15, fontSize: 20}}>segundos</Text>
                                </View>
                                <View style={styles.viewSalvarFechar}>
                                    <TouchableOpacity style={{...styles.touchableOpacitySalvar, opacity: disabledSalvar ? 0.5 : 1}} disabled={disabledSalvar} 
                                        onPress={() => (setNewParametros(user, treino, exercicioSelectDetalhe[0].id, campoEditando, newExercicioSelect))}
                                    >
                                        <Text style={styles.textSalvar}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (
                                            setDisabledSalvar(true),
                                            setCampoEditando(null)
                                        )}>
                                        <Ionicons name="close" size={30}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {/* <TouchableOpacity onPress={() => console.log(listExercicio[0].repeticoes.minimo)}>
                            <Text>Console</Text>
                        </TouchableOpacity> */}
                    </View>
                </>
            )}
            </Modal>
            <VirtualizedList
                data={listExercicio}
                getItemCount={(treinoDetalhe) => treinoDetalhe.length}
                getItem={(treinoDetalhe, index) => treinoDetalhe[index]}
                renderItem={({item, index}) => (
                    <View key={index}>
                        <TouchableOpacity style={{...styles.buttonListExercicio, flexDirection: 'row'}} onPress={() =>(
                                fetchExerciciosSelectDetalhes(item.id),
                                setModalVisible(true),
                                setNewExercicioSelect(item.titulo)
                                )}>
                            <Text style={{...styles.textListExercicio, width: '73%'}}>
                                {item.titulo}
                            </Text>
                        <TouchableOpacity>
                            <Ionicons name={checkButton} size={20} color={'#ffffff'} style={styles.buttonListExercicio}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="trash-outline" size={20} color={'#ffffff'} style={styles.buttonListExercicio}/>
                        </TouchableOpacity>
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
        borderRadius: 5,
        borderColor: '#ffffff50',
        color: '#ffffff',
        
    },
    buttonListExercicio: {
        backgroundColor: '#ff6767',
        padding: 10,
        marginBottom: 2,
        marginHorizontal: 5,
    },
    slidePanel: {
        position: 'absolute',
        height: '50%',
        bottom: '25%',
        left: 5,
        right: 5,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    viewSalvarFechar:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSalvar:{
        fontSize: 20,
        padding: 10,
    },
    touchableOpacitySalvar:{
        backgroundColor: '#00ce005e',
    },
    viewEditando: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputEditando: {
        borderWidth: 1,
        borderColor: '#000',
        width: 60,
        height: 60,
        padding: 10,
        marginBottom: 20,
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
    },
    textTituloEditando: {
        marginBottom: 20,
        fontSize: 15
    }
});
