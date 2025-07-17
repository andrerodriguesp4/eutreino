import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

async function logIn(user, senha) {
  if (!user || !senha) {
    throw new Error('Usuário e senha obrigatórios!');
  }

  const querySnapshot = await getDocs(collection(db, 'users'));

  const users = querySnapshot.docs.map(doc => doc.data());
  const userDoc = users.find(u => u.user === user);

  if (!userDoc || userDoc.senha !== senha) {
    throw new Error('Usuário ou senha inválidos!');
  }

  await AsyncStorage.setItem('usuario', user);
  await AsyncStorage.setItem('senha', senha);
  return userDoc.user;
}

export default logIn;