import { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getExerciciosDoTreino, getTodayWorkout, getWorkout, markWorkoutAsDone } from '../../services/workoutService';

import { useFocusEffect } from '@react-navigation/native';
import DisplayExercises from './DisplayExercises';
import { COLORS } from '../styles/default';
import ModernButton from '../../utils/ModernButton';
import { updateExercise } from '../../services/updateExercise';
import SetExerciseForm from './SetExerciseForm';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function WorkoutScreen ({
    route,
    userId: propUserId,
    treinoId: propTreinoId,
    markAsDone = false,
    deleteVisible = true
}) {
    const { userId: routeUserId, treinoId: routeTreinoId } = route?.params || {};
    const userId = propUserId || routeUserId;
    const treinoId = propTreinoId || routeTreinoId;

    const [loading, setLoading] = useState(false);
    const [workout, setWorkout] = useState(null);
    const [alreadyDone, setAlreadyDone] = useState(false);

    const [exercicios, setExercicios] = useState([]);
    const [workoutVisible, setWorkoutVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState();
    const [updateVisible, setUpdateVisible] = useState(false);
    
    const [addExerciseVisible, setAddExerciseVisible] = useState(false);
    
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                loadWorkoutData();
            }
        }, [userId, treinoId])
    );

    const loadWorkoutData = async () => {
        try {
            setLoading(true);

            let workoutData = null;
            let doneFlag = false;

            if (treinoId !== null && treinoId !== undefined) {
                workoutData = await getWorkout(userId, treinoId);
            } else {
                const { workout, alreadyDone } = await getTodayWorkout(userId);
                workoutData = workout;
                doneFlag = alreadyDone;
                setAlreadyDone(doneFlag);
            }

            if (!workoutData){
                setWorkoutVisible(false);
                return;
            }

            setWorkout(workoutData);
            setWorkoutVisible(true);

            const listaExercicios = await getExerciciosDoTreino(userId, workoutData.id);
            setExercicios(listaExercicios);
        } catch (error) {
            console.log('Erro ao carregar treino: ', error);
            setWorkoutVisible(false);
        } finally {
            setLoading(false);
        }
    }
    
    const handleDone = async () => {
        await markWorkoutAsDone(userId, workout.index);
        setAlreadyDone(true);
        alert('Treino marcado como feito!');
    };

    const handleNewExercise = async (titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) => {
        setLoading(true);
        
        if (!titulo) {
          Alert.alert("Selecione o exercício!");
          setLoading(false);
          return;
        }
        if (modoRepeticoes === 'fixo' && !valorFixoReps) {
          Alert.alert('Erro', 'Informe o valor fixo das repetições.');
          setLoading(false);
          return;
        }
        if (modoRepeticoes === 'intervalo' && (!valorMinimoReps || !valorMaximoReps)) {
          Alert.alert('Erro', 'Informe o mínimo e máximo de repetições.');
          setLoading(false);
          return;
        }
        
        try {      
          const exerciciosRef = collection(db, `users/${userId}/treinos/${workout.id}/exercicios`);
          const snapshot = await getDocs(exerciciosRef);
          
          let maiorId = -1;
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (typeof data.id === "number" && data.id > maiorId) {
              maiorId = data.id;
            }
          });
          
          const novoId = maiorId + 1;
          
          let repeticoes = {};
          if (modoRepeticoes === 'fixo') {
            repeticoes = { tipo: 'fixo', valor: valorFixoReps };
          } else if (modoRepeticoes === 'intervalo') {
            repeticoes = { tipo: 'intervalo', minimo: valorMinimoReps, maximo: valorMaximoReps };
          }
          
          await setDoc(doc(exerciciosRef, novoId.toString()), {
            titulo,
            carga,
            series,
            descanso,
            repeticoes,
            id: novoId,
            checkButton: 0,
          });
          
          await loadWorkoutData();
        } catch (error) {
          console.log("Erro na função handleNewExercise", error);
          setLoading(false);
        } finally {
          setLoading(false);
          setAddExerciseVisible(false);
        }
    }

    const handleUpdateExercise = async (titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) => {
        setLoading(true);
        try {
            await updateExercise(userId, workout.id, selectedExercise, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps);
        } catch (error){
            console.log(error);
        } finally {
            setLoading(false);
            setUpdateVisible(false);
        }
    };

    const deleteExercicio = async (user, workout, selectedExercise) => {
        try{
            setLoading(true);
            await deleteDoc(doc(db, 'users', String(user), 'treinos', String(workout), 'exercicios', String(selectedExercise)));
            await loadWorkoutData();
        }catch(error){
            console.log('Erro na função deleteExercicio', error);
        } finally{
            setLoading(false);
        }
    };
    
    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
    
    return (
    <View style={styles.container}>
        {updateVisible && (
            <View style={styles.overlay}>
                <SetExerciseForm
                    userId={userId}
                    treinoId={workout.id}
                    exercicioId={selectedExercise}
                    setVisible={setUpdateVisible}
                    setExerciseFunction={handleUpdateExercise}
                />
            </View>
        )}
        {workoutVisible ? (
            <View style={{flex:1, padding: 5, paddingTop: 20,}}>
                <Text style={styles.workout}>{workout?.titulo}</Text>
                {markAsDone && (
                    <View>
                        {alreadyDone ? (
                            <Text style={styles.doneText}>✅ Treino já feito hoje!</Text>
                        ) : (
                            <ModernButton
                                text="Concluir"
                                onPress={handleDone}
                                icon="check-circle"
                            />
                        )}
                    </View>
                )}

                <DisplayExercises
                    user={userId}
                    treino={workout.id}
                    listExercicios={exercicios}
                    setListExercicio={setExercicios}
                    setExercicioSelectDetalhe={setSelectedExercise}
                    setUpdateVisible={setUpdateVisible}
                    deleteExercicio={deleteExercicio}
                    deleteVisible={deleteVisible}
                />
                <View style={{width: '60%', alignSelf: 'center'}}>
                    <ModernButton
                        text="Adicionar Exercício"
                        onPress={() => setAddExerciseVisible(true)}
                        icon="plus"
                    />
                </View>
                {addExerciseVisible && (
                    <View style={styles.overlay}>
                        <SetExerciseForm
                            userId={userId}
                            treinoId={workout.id}
                            exercicioId={selectedExercise}
                            setVisible={setAddExerciseVisible}
                            setExerciseFunction={handleNewExercise}
                            isNew={true}
                        />
                    </View>
                )}
            </View>
        ) : (
            <View>
                <Text>Nenhum treino encontrado!</Text>
            </View>
        )}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        zIndex: 1000,
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
