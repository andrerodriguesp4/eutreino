import { doc, getDoc, updateDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import moment from 'moment';

export async function getWorkouts(userId) {
  const treinosRef = collection(db, 'users', String(userId), 'treinos');
  const treinosQuery = query(treinosRef);
  const treinosSnap = await getDocs(treinosQuery);

  const treinosList = treinosSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  return treinosList;
}

export async function getTodayWorkout(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const today = moment().format('YYYY-MM-DD');

  const treinosList = await getWorkouts(userId);

  if (treinosList.length === 0) {
    throw new Error('Nenhum treino encontrado!');
  }

  let nextIndex = 0;
  let lastIndex = -1;
  let lastDate = '';

  if (userSnap.exists()) {
    const userData = userSnap.data();
    lastIndex = userData.lastWorkoutIndex ?? -1;
    lastDate = userData.lastWorkoutDate ?? '';
  }

  let alreadyDone = false;

  if (lastDate === today) {
    nextIndex = lastIndex;
    alreadyDone = true;
  } else {
    nextIndex = (lastIndex + 1) % treinosList.length;
    alreadyDone = false;
  }

  return {
    workout: {
      index: nextIndex,
      titulo: treinosList[nextIndex].titulo,
      id: treinosList[nextIndex].id
    },
    alreadyDone
  };
}

export async function markWorkoutAsDone(userId, workoutIndex) {
  const userRef = doc(db, 'users', userId);
  const today = moment().format('YYYY-MM-DD');

  await updateDoc(userRef, {
    lastWorkoutIndex: workoutIndex,
    lastWorkoutDate: today
  });

  return true;
}

export async function getExerciciosDoTreino(userId, treinoId) {
  const exerciciosRef = collection(db, 'users', String(userId), 'treinos', String(treinoId), 'exercicios');
  const snapshot = await getDocs(exerciciosRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
export async function setNewParametros(user, treino, exercicio, parametro, newParametros) {
  try {
    setLoadingVisible(true);
    const treinosCollection = collection(
      db,
      `users/${user}/treinos/${treino}/exercicios`
    );
    const docSelect = query(treinosCollection, where("id", "==", exercicio));
    const querySnapshot = await getDocs(docSelect);
    for (const document of querySnapshot.docs) {
      await updateDoc(doc(db, document.ref.path), {
        [parametro]: newParametros,
      });
    }
    
    const atualizarItem = (item) => {
      if (item.id !== exercicio) return item;
      if (parametro === "repeticoes.minimo") {
        return {
          ...item,
          repeticoes: {
            ...item.repeticoes,
            minimo: newParametros,
          },
        };
      }
      
      if (parametro === "repeticoes.maximo") {
        return {
          ...item,
          repeticoes: {
            ...item.repeticoes,
            maximo: newParametros,
          },
        };
      }
      return {
        ...item,
        [parametro]: newParametros,
      };
    };
    
    setListExercicio((prev) => prev.map(atualizarItem));
    
    setExercicioSelectDetalhe((prev) => prev.map(atualizarItem));
    
    setCampoEditando(null);
    setNewRepeticoesMaximo(null);
    setNewRepeticoesMinimo(null);
    setDisabledSalvar(true);
    await sleep(50);
    setLoadingVisible(false);
  } catch (error) {
    console.log("Erro na função setNewParametros:", error);
  }
};
*/