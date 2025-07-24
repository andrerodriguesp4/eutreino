import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Verifica se o usuário e senha correspondem a um usuário válido no banco.
 * Se válido, salva os dados no AsyncStorage e retorna o ID do usuário.
 *
 * @param {string} user - Nome de usuário.
 * @param {string} senha - Senha.
 * @returns {string} - ID do usuário autenticado.
 */
async function logIn(user, senha) {

  const snapshot = await getDocs(collection(db, 'users'));

  const users = snapshot.docs.map(doc => doc.data());
  const matchedUser = users.find(item => item.user === user && item.senha === senha);

  if (!matchedUser) {
    alert('Usuário ou senha incorretos!');
  }
  
  await AsyncStorage.setItem('usuario', matchedUser.id.toString());
  await AsyncStorage.setItem('senha', senha);
  return matchedUser.id.toString();
}

export default logIn;