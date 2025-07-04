import { View, Text, StyleSheet, TouchableOpacity, VirtualizedList, Modal, TextInput} from "react-native";
import app from "../firebaseConfig";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where} from "firebase/firestore";
import {useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

export default function Treinos({navigation}){
    const [user, setUser] = useState();
    const [treinos, setTreinos] = useState([]);
    const [exercicios, setExercicios] = useState([]);
    const [treinoId, setTreinoId] = useState(0);
    const [treinoSelect, setTreinoSelect] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisibleExercicio, setModalVisibleExercicio] = useState(false);
    const [modalVisibleRepeticoes, setModalVisibleRepeticoes] = useState(false);
    const [modalVisibleCarga, setModalVisibleCarga] = useState(false);
    const [modalVisibleDescanso, setModalVisibleDescanso] = useState(false);
    const [modalVisibleSeries, setModalVisibleSeries] = useState(false);
    const [treinoDetalhe, setTreinoDetalhe] = useState([]);
    const [checkButtonClick, setCheckButtonClick] = useState({});
    const [treinoSelectDetalhe, setTreinoSelectDetalhe] = useState([]);
    const [exercicioSelect, setExercicioSelect] = useState({});
    const [newExercicioSelect, setNewExercicioSelect] = useState();
    const [newParams, setNewParams] = useState();
    const [valueSelect, setValueSelect] = useState({});
    const [textState, setTextState] = useState('Salvar');
    
    useEffect(() => {
        getUser();
        fetchExercicios();
        checkButtonClickGetItems();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => getUser()}>
                    <Text style={{color: 'white', margin: 5, padding: 5}}>
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

    async function checkButtonClickGetItems() {
        try{
            const checkButtonClickListAsync = await AsyncStorage.getItem('checkButtonClick');
            if(checkButtonClickListAsync !== null){
                setCheckButtonClick(JSON.parse(checkButtonClickListAsync));
            }else{
                setCheckButtonClick({});
            }
        }catch(error){
            console.log('Errona função checkButtonClickGetItems(): ', error);
        }
    }

    async function checkButtonClickAsyncStorage(listaparametros) {
        try{
            await AsyncStorage.setItem('checkButtonClick', JSON.stringify(listaparametros));
        } catch (error){
            console.log('Erro ao salvar checkButtonClick', error);
        }
    }

    function checkButton(titulo){
        try{
            const newState = {
                ...checkButtonClick,
                [titulo]: checkButtonClick[titulo] === 'checkmark-done' ? 'radio-button-off' : 'checkmark-done'
            };
            setCheckButtonClick(newState)
            checkButtonClickAsyncStorage(newState)
        }catch(error){
            console.log('Erro na função checkButton: ', error)
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

    const fetchExerciciosSelectDetalhes = async (exercicio) => {
        try{
            const exercicioSelect = treinoDetalhe.filter(item => item.id === exercicio);
            setTreinoSelectDetalhe(exercicioSelect);
        }catch{
            console.log(error)('Erro na função fetchExerciciosSelectDetalhes: ', error)
        }
    }

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
            console.log(user, treino, exercicio, newParametros)
            const db = getFirestore(app);
            const treinosCollection = collection(db, `users/${user}/treinos/${treino}/exercicios`);
            const docSelect = query(treinosCollection, where('id', '==', exercicio));
            const querySnapshot = await getDocs(docSelect);
            for (const document of querySnapshot.docs) {
                    await updateDoc(doc(db, document.ref.path), {
                    [parametro]: newParametros,
                });
            }
            await fetchExerciciosSelect(user,treino);
            await fetchExerciciosSelectDetalhes(exercicio);
            setValueSelect(newParametros);
            setTextState('Salvo com sucesso!');
        }catch(error){
            console.log('Erro ao salvar:', error)
        }
    }

    return(
        <View style={styles.container}>
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.containerModal}>
                    <Modal visible={modalVisible2}>
                        <View style={styles.containerModal1}>
                            <View style={styles.viewDetalhesExercicio}>
                                <View style={styles.buttonModalBack}>
                                    <TouchableOpacity style={styles.buttonBack} onPress={() => setModalVisible2(false)}>
                                            <Ionicons name="chevron-back" size={30} color='black'/>
                                    </TouchableOpacity>    
                                </View>                                                       
                                <View>
                                    <Modal transparent animationType="fade" visible={modalVisibleExercicio}>
                                        <View style={styles.containerModal2}>
                                            <View style={styles.viewEditarExercicio}>
                                                <View style={styles.viewSelecionarExercicio}>
                                                    <Picker
                                                        selectedValue={newExercicioSelect}
                                                        onValueChange={(itemValue) => {
                                                            setNewExercicioSelect(itemValue)
                                                            setTextState('Salvar')
                                                        }}
                                                        style={{height: 50, width: 300}}
                                                        itemStyle={{color: 'black'}}
                                                    >
                                                        {exercicios.map((item) => (
                                                            <Picker.Item key={item.id} label={item.titulo} value={item.titulo}/>
                                                        ))}
                                                    </Picker>
                                                </View>
                                                <View style={styles.viewButtonSalvarFechar}>
                                                    <TouchableOpacity style={styles.buttonSalvar} onPress={async () => {
                                                        await setNewParametros(user, treinoSelect, exercicioSelect,'titulo', newExercicioSelect)
                                                        await fetchExerciciosSelectDetalhes(exercicioSelect)
                                                    }}>
                                                        <Text style={{color:'white'}}>{textState}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.buttonFechar} onPress={async() => {
                                                        await fetchExerciciosSelectDetalhes(exercicioSelect)
                                                        setModalVisibleExercicio(false)
                                                        setTextState('Salvar');
                                                    }}>
                                                        <Ionicons name="close" size={20} color='white'/>
                                                    </TouchableOpacity>
                                                </View>
                                                

                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal transparent animationType="fade" visible={modalVisibleSeries}>
                                        <View style={styles.containerModal2}>
                                            <View style={styles.viewEditarExercicio}>
                                                <Text>Séries:</Text>
                                                <TextInput 
                                                    style={styles.textInputEditSeries} 
                                                    placeholder={valueSelect.toString()} 
                                                    placeholderTextColor="grey" maxLength={3}
                                                    keyboardType="numeric"
                                                    onChangeText={setNewParams}
                                                    onChange={() => setTextState('Salvar')}                                               
                                                />
                                                <View style={styles.viewButtonSalvarFechar}>
                                                    <TouchableOpacity onPress={async() => {
                                                        await setNewParametros(user, treinoSelect, exercicioSelect, 'series', newParams)
                                                        await fetchExerciciosSelectDetalhes(exercicioSelect)
                                                    }} style={styles.buttonSalvar}>
                                                        <Text style={{color:'white'}}>{textState}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.buttonFechar} onPress={() => {
                                                        fetchExerciciosSelectDetalhes(exercicioSelect)
                                                        setModalVisibleSeries(false)
                                                        setTextState('Salvar')
                                                    }}>
                                                        <Ionicons name="close" size={20} color='white'/>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal transparent animationType="fade" visible={modalVisibleRepeticoes}>
                                        <View style={styles.containerModal2}>
                                            <View style={styles.viewEditarExercicio}>
                                                <Text>Mínimo: </Text>
                                                <TextInput style={styles.textInputEditSeries}/>
                                                <Text>Máximo: {exercicioSelect[1]}</Text>
                                                <View style={styles.viewButtonSalvarFechar}>
                                                    <TouchableOpacity style={styles.buttonSalvar}>
                                                        <Text style={{color:'white'}}>Salvar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.buttonFechar} onPress={() => setModalVisibleRepeticoes(false)}>
                                                        <Ionicons name="close" size={20} color='white'/>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal transparent animationType="fade" visible={modalVisibleCarga}>
                                        <View style={styles.containerModal2}>
                                            <View style={styles.viewEditarExercicio}>
                                                <Text>Carga: {exercicioSelect} Kg</Text>
                                                <View style={styles.viewButtonSalvarFechar}>
                                                    <TouchableOpacity style={styles.buttonSalvar}>
                                                        <Text style={{color:'white'}}>Salvar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.buttonFechar} onPress={() => setModalVisibleCarga(false)}>
                                                        <Ionicons name="close" size={20} color='white'/>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal transparent animationType="fade" visible={modalVisibleDescanso}>
                                        <View style={styles.containerModal2}>
                                            <View style={styles.viewEditarExercicio}>
                                                <Text>Descanso: {exercicioSelect} s</Text>
                                                <View style={styles.viewButtonSalvarFechar}>
                                                    <TouchableOpacity style={styles.buttonSalvar}>
                                                        <Text style={{color:'white'}}>Salvar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.buttonFechar} onPress={() => setModalVisibleDescanso(false)}>
                                                        <Ionicons name="close" size={20} color='white'/>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>
                                    {treinoSelectDetalhe.map((item, index) => (
                                            <View key={index}>
                                                <View style={styles.viewTextDetalheExercicio}>
                                                    <Text style={styles.textDetalheExercicio}>Exercicio: {item.titulo}</Text>
                                                    <TouchableOpacity onPress={() => {
                                                        setExercicioSelect(item.id);
                                                        setValueSelect(item.titulo);
                                                        setNewExercicioSelect(item.titulo);
                                                        setModalVisibleExercicio(true);
                                                        }}>
                                                        <Ionicons style={styles.buttonEditExercicio} name="pencil" color='white' size={20}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.viewTextDetalheExercicio}>
                                                    <Text style={styles.textDetalheExercicio}>Séries: {item.series}</Text>
                                                    <TouchableOpacity onPress={() => {
                                                        setExercicioSelect(item.id);
                                                        setValueSelect(item.series)
                                                        setModalVisibleSeries(true);
                                                    }}>
                                                        <Ionicons style={styles.buttonEditExercicio} name="pencil" color='white' size={20}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.viewTextDetalheExercicio}>
                                                    <Text style={styles.textDetalheExercicio}>Repetições: {item.repeticoes.minimo} a {item.repeticoes.maximo}</Text>
                                                    <TouchableOpacity onPress={() => {
                                                        setExercicioSelect(item.id);
                                                        setValueSelect([item.repeticoes.minimo, item.repeticoes.maximo])
                                                        setModalVisibleRepeticoes(true);
                                                    }}>
                                                        <Ionicons style={styles.buttonEditExercicio} name="pencil" color='white' size={20}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.viewTextDetalheExercicio}>
                                                    <Text style={styles.textDetalheExercicio}>Carga: {item.carga} Kg</Text>
                                                    <TouchableOpacity onPress={() => {
                                                        setExercicioSelect(item.id);
                                                        setValueSelect(item.carga)
                                                        setModalVisibleCarga(true);
                                                    }}>
                                                        <Ionicons style={styles.buttonEditExercicio} name="pencil" color='white' size={20}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.viewTextDetalheExercicio}>
                                                    <Text style={styles.textDetalheExercicio}>Descanso: {item.descanso} segundos</Text>
                                                    <TouchableOpacity onPress={() => {
                                                        setExercicioSelect(item.id);
                                                        setValueSelect(item.descanso)
                                                        setModalVisibleDescanso(true);
                                                    }}>
                                                        <Ionicons style={styles.buttonEditExercicio} name="pencil" color='white' size={20}/>
                                                    </TouchableOpacity>
                                                </View>     
                                            </View>
                                        ))}
                                </View>
                            </View>
                            
                        </View>
                    </Modal>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.buttonBack}>
                        <Ionicons name="close" size={30} color='white'/>
                    </TouchableOpacity>
                    <View style={styles.viewExibirExercicios}>
                        <View style={styles.viewTextTituloTreino}>
                            <Text style={styles.textTituloTreinoSelect}>{treinoSelect}</Text>
                        </View>
                        <View style={styles.viewTextExibirExercicios}>
                            <VirtualizedList
                                data={treinoDetalhe}
                                getItemCount={(treinoDetalhe) => treinoDetalhe.length}
                                getItem={(treinoDetalhe, index) => treinoDetalhe[index]}
                                renderItem={({item, index}) => (
                                    <View key={index} style={styles.viewTextListDetalhes}>
                                        <TouchableOpacity onPress={() => {
                                                fetchExerciciosSelectDetalhes(item.id)
                                                setModalVisible2(!modalVisible2)
                                            }}>
                                            <Text style={styles.textTituloExercicios}>{item.titulo}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {checkButton(item.titulo)}}>
                                            <Ionicons 
                                            style={styles.buttonExitListaExercicios}
                                            name={checkButtonClick[item.titulo] || 'radio-button-off'}
                                            size={25}/>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <VirtualizedList
                data={treinos}
                getItemCount={(treinos) => treinos.length}
                getItem={(treinos, index) => treinos[index]}
                renderItem={({item}) => (
                    <View style={styles.listaTreinos} key={item.id}>
                        <TouchableOpacity onPress={async() => {
                                setTreinoId(item.id);
                                setTreinoSelect(item.titulo);
                                const detalhes = await fetchExerciciosSelect(user, item.titulo); // Aguarda os dados
                                const treinoRoute = item.titulo;
                                navigation.navigate('DetalhesTreino', { treinoDetalhe: detalhes, treino: treinoRoute }); // Passa os dados recebidos
                        }}>
                            <Text style={styles.textTituloTreino}>{item.titulo}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    containerModal: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0000008a',
    },
    containerModal1:{
        flex: 1,
        backgroundColor:'#0000008a',
    },
    containerModal2:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0000008a',
    },
    viewTextExibirExercicios: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },

    textTituloExercicios: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 20, 
        width: 300,
        margin: 5,
    },
    buttonExitListaExercicios: {
        padding: 10
    },

    listaTreinos: {
        marginVertical: 1,
        marginHorizontal:5,
        paddingHorizontal:10,
        paddingVertical: 15,
        backgroundColor:'#0400ff4d',
    },
    viewTextListDetalhes:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewExibirExercicios: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 10,
    },
    viewDetalhesExercicio:{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 30,
        marginVertical: 150,
        justifyContent: 'center'
    },
    buttonModalBack:{
        position: 'absolute',
        top: 20,
        left: 20,
        marginBottom: 20,
    },
    viewTextDetalheExercicio:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0400ff4d',
        marginHorizontal: 10,
        marginVertical: 2,
        
    },
    textDetalheExercicio: {
        fontSize: 20,
        marginVertical: 2,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    buttonEditExercicio: {
        marginRight: 10,
        backgroundColor: '#00800067',
        borderRadius: 5,
        padding: 8,
    },
    viewEditarExercicio: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        width: 300,
        height: 300,
    },
    viewButtonSalvarFechar: {
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonFechar:{
        backgroundColor: '#a50000d0',
        padding: 10,
        marginLeft: 5,

    },
    buttonSalvar:{
        backgroundColor: '#00ad00ff',
        padding: 10,

    },
    buttonBack:{
        marginBottom: 50,
        backgroundColor: '#00800067',
        borderRadius: 5, 
        padding: 10,
    },
    textTituloTreinoSelect:{
        color: '#252525',
        fontSize: 25,
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    viewTextTituloTreino:{
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 30,
        backgroundColor: '#ff5b5b8a',
    },
    textTituloTreino:{
        color: '#252525',
        fontSize: 20,
        fontFamily: 'arial',
    },
    viewSelecionarExercicio:{
        flex: 1,
        justifyContent: 'space-between',
        margin: 10,     
    },
    textInputEditSeries: {
        borderWidth:1,
        borderRadius: 3,
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: 20,
    }
})

