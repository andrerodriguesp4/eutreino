import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet } from 'react-native';
import { getExerciciosDoTreino, getWorkouts } from '../../services/workoutService';
import { useCallback, useEffect, useState } from 'react';
import { getUser } from '../../services/getUser';
import { useFocusEffect } from '@react-navigation/native';

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
        backgroundColor: '#79ff79',
        marginHorizontal: 2,
    },
    textTraining:{
        padding: 10,
    },
})