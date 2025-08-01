import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { getExerciciosDoTreino, getTodayWorkout, markWorkoutAsDone } from '../services/workoutService';
import { getUser } from '../services/getUser';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const WorkoutScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [workout, setWorkout] = useState(null);
    const [alreadyDone, setAlreadyDone] = useState(false);
    const [userId, setUserId] = useState(null);
    const [exercicios, setExercicios] = useState([]);
    const [workoutVisible, setWorkoutVisible] = useState(false);
    
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
        {workoutVisible && (
            <View>
                <Text style={styles.title}>Treino do Dia:</Text>
                <Text style={styles.workout}>{workout?.titulo}</Text>
                
                {alreadyDone ? (
                    <Text style={styles.doneText}>✅ Treino já feito hoje!</Text>
                ) : (
                <Button title="Marcar como feito" onPress={handleDone} />
                )}

                <Text style={styles.subtitle}>Exercícios:</Text>
                <FlatList
                    data={exercicios}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={styles.exercicio}>
                            <Text style={styles.exercicioNome}>{item.titulo}</Text>
                            {/* Você pode exibir mais dados, como reps, series, etc */}
                        </View>
                    )}
                    ListEmptyComponent={<Text>Nenhum exercicio cadastrado</Text>}
                    contentContainerStyle={{paddingBottom: 40}}
                />
            </View>
        )}
        {!workoutVisible && (
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
        padding: 20,
        paddingTop: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    workout: {
        fontSize: 40,
        marginVertical: 10
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
    exercicio: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    exercicioNome: {
        fontSize:16
    },
});
