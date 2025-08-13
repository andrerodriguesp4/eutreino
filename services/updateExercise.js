import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Alert } from "react-native";
import { getExerciciosDoTreino } from "./workoutService";

export async function updateExercise (user, treino, selectedExercise, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) {
    const listExercises = await getExerciciosDoTreino(user, treino);
    const exercise = listExercises[selectedExercise];

    const dadosAtualizados = {};
    if (carga !== exercise.carga) dadosAtualizados.carga = carga;
    if (series !== exercise.series) dadosAtualizados.series = series;
    if (descanso !== exercise.descanso) dadosAtualizados.descanso = descanso;
    
    if (modoRepeticoes === 'fixo') {
        if (!valorFixoReps) {
            alert('Informe o valor das repetições.');
            return;
        }
        if (valorFixoReps !== exercise.repeticoes.valor) {
            dadosAtualizados.repeticoes = {
                tipo: 'fixo',
                valor: valorFixoReps,
            };
        }
    }
    if (modoRepeticoes === 'intervalo') {
        if (!valorMinimoReps || !valorMaximoReps) {
            alert('Informe o mínimo e máximo de repetições.');
            return;
        }
        if (valorMinimoReps !== exercise.repeticoes.minimo || valorMaximoReps !== exercise.repeticoes.maximo) {
            dadosAtualizados.repeticoes = {
                tipo: 'intervalo',
                minimo: valorMinimoReps,
                maximo: valorMaximoReps,
            };
        }
    }
    if (Object.keys(dadosAtualizados).length === 0){
        Alert.alert('Aviso', 'Nenhum dado foi alterado.');
        return;
    }
    
    try {
        await updateDoc(doc(db, 'users', String(user), 'treinos', String(treino), 'exercicios', String(selectedExercise)), dadosAtualizados);
        Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (error) {
        console.log(error)
        Alert.alert('Erro', 'Não foi possível atualizar os dados.')
    }
};