import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getWorkouts } from '../../services/workoutService';
import { useEffect, useState } from 'react';
import { getUser } from '../../services/getUser';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


export default function TrainingHistory({navigation}){
    const [user, setUser] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [treinos, setTreinos] = useState([]);
    const [repeatTraining, setRepeatTraining] = useState(false);
    const [treinoSelect, setTreinoSelect] = useState();

    useEffect(() => {
        getUser(setUser, navigation);
    }, []);

    useEffect(() =>{
        if(user){loadTreinos();}
    }, [user])

    function sleep(ms){
        return new Promise(result => setTimeout(result, ms))
    };

    const loadTreinos = async () => {
            try{
                setLoadingVisible(true);
                const treinosList = await getWorkouts(user);
                setTreinos(treinosList);
    
                await sleep(100);
                setLoadingVisible(false);
            }catch(error){
                console.log('Erro na função loadTreinos: ',error)
            }
        };

    return (
        <View style={styles.container}>
            {loadingVisible && (
                <View style={styles.viewLoading}>
                    <ActivityIndicator
                        size={"large"}
                        color={"black"}
                    />
                </View>
            )}
            <VirtualizedList
                data={treinos}
                getItemCount={() => treinos.length}
                getItem={(data, index) => data[index]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => {
                    if(item.workoutDone){
                        const data = item.workoutDone;
                        const [year, month, day] = data.split("-");
                        const newData = `${day}-${month}-${year}`;
                        return(
                            <TouchableOpacity style={styles.buttonTraining} onPress={() => (
                                setTreinoSelect(item.titulo),
                                setRepeatTraining(true)
                            )}>
                                <Text style={{...styles.textTraining, fontSize: 20}}>{item.titulo}</Text>
                                <Text style={{...styles.textTraining, fontStyle: 'italic'}}>Realizado dia {newData}</Text>
                            </TouchableOpacity>
                        )
                    }
                }
                }
            />
            {repeatTraining && (
                <View style={{...StyleSheet.absoluteFill, backgroundColor: "rgba(0, 0, 0, 0.3)",}}pointerEvents="auto">
                    <View style={styles.viewRepeatTraining}>
                        <View style={styles.viewTextRepeatTraining}>
                            <Text>{treinoSelect}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={styles.buttonRepeatTraining}>
                                    <FontAwesome5 style={{right: 5}} name='redo'/>
                                    <Text>Refazer Treino</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonDeleteTraining}>
                                    <FontAwesome5 style={{right: 5}} name='trash-alt'/>
                                    <Text>Apagar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 2,
    },
    buttonTraining:{
        backgroundColor: '#79ff79',
        marginHorizontal: 2,
        marginVertical: 1
    },
    textTraining:{
        padding: 10,
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
    viewRepeatTraining: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewTextRepeatTraining:{
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10
    },
    buttonRepeatTraining:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#79ff79',
        padding: 10,
        right: 5,
    },
    buttonDeleteTraining:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff5959',
        padding: 10,
    }
})