import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import moment from 'moment';

export async function getTodayWorkout(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const today = moment().format('YYYY-MM-DD');

  const treinosRef = collection(db, 'users', userId, 'treinos');
  const treinosQuery = query(treinosRef, orderBy('titulo'));
  const treinosSnap = await getDocs(treinosQuery);

  const treinosList = treinosSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

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