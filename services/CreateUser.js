import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';


function isEmailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function createUser(user, senha, email) {
  if (!isEmailValid(email)) {
    throw new Error('Digite um e-mail válido!');
  }

  const snapshot = await getDocs(collection(db, 'users'));
  const users = snapshot.docs.map(doc => doc.data());

  const usernameExists = users.some(u => u.user === user);
  const emailExists = users.some(u => u.email === email);

  if (usernameExists) {
    throw new Error('Usuário já existe!');
  }
  if (emailExists) {
    throw new Error('Email já utilizado!');
  }

  let maiorId = -1;
  snapshot.forEach((doc) =>{
    const data = doc.data();
    if (typeof data.id === 'number' && data.id > maiorId) {
      maiorId = data.id;
    }
  });

  const novoId = maiorId +1;

  await setDoc(doc(db, 'users', novoId.toString()), {id: novoId, user: user, senha: senha, email: email });
  return user;
}

export default createUser;