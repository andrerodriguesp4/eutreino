import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function updateExerciseValues(
    userId,
    treinoId,
    exercicioId,
    parametro,
    newValue) {
    try {
      const treinosCollection = collection(db, `users/${userId}/treinos/${treinoId}/exercicios`);

      const docSelect = query(treinosCollection, where("id", "==", exercicioId));
      const querySnapshot = await getDocs(docSelect);

      for (const document of querySnapshot.docs) {
        await updateDoc(doc(db, document.ref.path), {
          [parametro]: newValue,
        });
      }

      const atualizarItem = (item) => {
        if (item.id !== exercicioId) return item;

        if (parametro.startsWith("repeticoes.")) {
          const subCampo = parametro.split("_")[1];
          return {
            ...item,
            repeticoes: {
              ...item.repeticoes,
              [subCampo]: newValue,
            },
          };
        }
        
        return {
          ...item,
          [parametro]: newValue,
        };
      };

      setListExercicio((prev) => prev.map(atualizarItem));

      setExercicioSelectDetalhe((prev) => prev.map(atualizarItem));

      await sleep(50);
    } catch (error) {
      console.log("Erro na função updateExerciseValues:", error);
    }
  };