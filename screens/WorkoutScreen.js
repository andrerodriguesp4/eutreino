import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet,  TouchableOpacity } from 'react-native';
import { getExerciciosDoTreino, getTodayWorkout, markWorkoutAsDone } from '../services/workoutService';
import { getUser } from '../services/getUser';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import DisplayExercises from './components/DisplayExercises';
import { COLORS } from './styles/default';
import ModernButton from '../utils/ModernButton';

const WorkoutScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [workout, setWorkout] = useState(null);
    const [alreadyDone, setAlreadyDone] = useState(false);
    const [userId, setUserId] = useState(null);
    const [exercicios, setExercicios] = useState([]);
    const [workoutVisible, setWorkoutVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState([]);
    const [updateVisible, setUpdateVisible] = useState(false);
    
    useEffect(() =>{
        getUser(setUserId, navigation);
    }, []);
    
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                loadWorkout();
            }
        }, [userId])
    );
    
    const loadWorkout = async () => {
        try {
            setLoading(true);
            const { workout, alreadyDone } = await getTodayWorkout(userId);
            setWorkout(workout);
            setAlreadyDone(alreadyDone);

            const listaExercicios = await getExerciciosDoTreino(userId, workout.id);
            setExercicios(listaExercicios);
            setWorkoutVisible(true);
        } catch (error) {
            console.log('Erro ao carregar treino:', error);
            setWorkoutVisible(false);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDone = async () => {
        await markWorkoutAsDone(userId, workout.index);
        setAlreadyDone(true);
        alert('Treino marcado como feito!');
    };
    
    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
    
    return (
    <View style={styles.container}>
        {workoutVisible ? (
            <View style={{flex:1}}>
                <Text style={styles.title}>Hoje:</Text>
                <Text style={styles.workout}>{workout?.titulo}</Text>
                
                {alreadyDone ? (
                    <Text style={styles.doneText}>✅ Treino já feito hoje!</Text>
                ) : (
                    <ModernButton
                        text="Concluir"
                        onPress={handleDone}
                        icon="check-circle"
                    />
                )}

                <Text style={styles.subtitle}>Exercícios:</Text>
                <DisplayExercises
                    user={userId}
                    treino={workout.id}
                    listExercicios={exercicios}
                    setListExercicio={setExercicios}
                    setExercicioSelectDetalhe={setSelectedExercise}
                    setUpdateVisible={setUpdateVisible}
                    deleteVisible={false}
                />
            </View>
        ) : (
            <View>
                <Text>Nenhum treino encontrado!</Text>
            </View>
        )}
    </View>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    workout: {
        fontSize: 40,
        marginVertical: 10
    },
    finishButton: {
        color: 'white',
        backgroundColor: COLORS.buttons,
        borderRadius: 10,
        padding: 10,
        marginBottom: 2,
        marginHorizontal: 20,
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    doneText: {
        fontSize: 16,
        color: 'green',
        marginVertical: 10
    },
    subtitle: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
});
