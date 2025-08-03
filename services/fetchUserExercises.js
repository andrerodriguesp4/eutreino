import { getExerciciosDoTreino } from "./workoutService";

export async function fetchUserExercises(userId, treinoId, exercicioId) {
    try {
        const listaExercicios = await getExerciciosDoTreino(userId, treinoId);
        const exercicioSelecionado = listaExercicios[exercicioId];
        return exercicioSelecionado;
    } catch (error) {
        console.log("Erro na função fetchUserExercises: ", error);}
};