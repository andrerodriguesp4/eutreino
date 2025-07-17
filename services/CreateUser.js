import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';


function isEmailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function createUser(user, senha, email) {
  // if (!isEmailValid(email)) {
  //   throw new Error('Digite um e-mail válido!');
  // }

  const querySnapshot = await getDocs(collection(db, 'users'));
  const users = querySnapshot.docs.map(doc => doc.data());

  const usernameExists = users.some(u => u.user === user);
  const emailExists = users.some(u => u.email === email);

  if (usernameExists) {
    throw new Error('Usuário já existe!');
  }
  if (emailExists) {
    throw new Error('Email já utilizado!');
  }

  await setDoc(doc(db, 'users', user), { user: user, senha: senha, email: email });
  return user;
}

export default createUser;

