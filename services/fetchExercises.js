import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function fetchExercises() {
    try {
        const exerciciosCollection = collection(db, "exercicios");
        const querySnapshot = await getDocs(exerciciosCollection);
  
        const exerciciosList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        return exerciciosList;
      } catch (error) {
        console.log("Erro na função fetchExercicios: ", error);
      }
    };