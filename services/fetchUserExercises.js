import { getExerciciosDoTreino } from "./workoutService";

export async function fetchUserExercises(userId, treinoId) {
    try {
        const listaExercicios = await getExerciciosDoTreino(userId, treinoId);
        return listaExercicios;
    } catch (error) {
        console.log("Erro na função fetchUserExercises: ", error);}
};