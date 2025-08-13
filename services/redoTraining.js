import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function redoTraining(userId, trainingTitle, trainingId) {
    try{
        const exercisesRef = collection(db, `users/${userId}/treinos/${trainingId}/exercicios`);
        const snapshotExercises = await getDocs(exercisesRef);        

        const treinoRef = collection(db, `users/${userId}/treinos`);
        const snapshotTraining = await getDocs(treinoRef);


        let maiorId = -1;
        snapshotTraining.forEach((doc) => {
            const data = doc.data();
            if (typeof data.id === "number" && data.id > maiorId) {
            maiorId = data.id;
            }
        });

        const novoId = maiorId + 1;
        await setDoc(doc(treinoRef, novoId.toString()),{
            titulo: trainingTitle,
            id: novoId,
        });
        
        for (const exerciseSnap of snapshotExercises.docs){
            const exerciseData = exerciseSnap.data();
            const newExerciseRef = doc(db, `users/${userId}/treinos/${novoId.toString()}/exercicios/${exerciseSnap.id}`
            );
            await setDoc(newExerciseRef,{...exerciseData, checkButton: 0});
        };
        return
    }catch(error){
        console.log('Erro na função setNewTreino', error);
    }
}