import { db } from "../firebaseConfig";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";

export async function deleteWorkout(tituloId, user) {
        try{
            const treinoRef = doc(db, `users/${user}/treinos`, tituloId.toString());
            const exerciciosRef = collection(treinoRef, 'exercicios');
            const exerciciosSnapshot = await getDocs(exerciciosRef);

            const deletePromises = exerciciosSnapshot.docs.map((doc) => 
                deleteDoc(doc.ref)
            );
            
            await Promise.all(deletePromises);
            await deleteDoc(treinoRef);
        }catch(error){
            console.log('Erro na função deleteWorkout', error);
        }
    }