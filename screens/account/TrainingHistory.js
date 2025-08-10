import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getExerciciosDoTreino, getWorkouts } from '../../services/workoutService';
import { useCallback, useEffect, useState } from 'react';
import { getUser } from '../../services/getUser';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/default';

export default function TrainingHistory({navigation}){
    const [user, setUser] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [treinos, setTreinos] = useState([]);

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
                console.log(treinosList)
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
                            <TouchableOpacity style={styles.buttonTraining}>
                                <Text style={{...styles.textTraining, fontSize: 20}}>{item.titulo}</Text>
                                <Text style={{...styles.textTraining, fontStyle: 'italic'}}>Realizado dia {newData}</Text>
                            </TouchableOpacity>
                        )
                    }
                }
                }
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 2,
    },
    buttonTraining:{
        backgroundColor: COLORS.list_2,
        marginHorizontal: 2,
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
})