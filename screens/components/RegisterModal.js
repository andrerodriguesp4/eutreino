import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createUser from '../../services/CreateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordField from '../account/components/Passwordfield';

export default function RegisterModal({ visible, onClose, onSuccess, styles }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repSenha, setRepSenha] = useState('');
  const [loadingVisible, setLoadingVisible] = useState(false);

  const [passwordError, setPasswordError] = useState(null);
  const [repSenhaError, setRepSenhaError] = useState(null);

  function resetFields() {
    setUsername('');
    setEmail('');
    setSenha('');
    setRepSenha('');
  }

  async function handleRegister() {
    setPasswordError(null);
    setRepSenhaError(null);
    if (!username || !email || !senha || !repSenha) {
      alert('Preencha todos os campos!');
      return;
    }
    if (senha.length < 6){
      setPasswordError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    if (senha !== repSenha) {
      setRepSenhaError('As senhas não coincidem!');
      return;
    }

    try {
      setLoadingVisible(true);
      const uid = await createUser( username, senha, email );
      await AsyncStorage.setItem('user', uid);
      resetFields();
      onSuccess(); // navega para a tela principal
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário');
    } finally {
      setLoadingVisible(false);
    }
  }

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        {loadingVisible && (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <View style={styles.viewModal}>
          <View style={styles.viewForm}>
            <View>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Digite o nome de usuário"
                placeholderTextColor="#666"
                style={styles.inputLogin}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o e-mail"
                placeholderTextColor="#666"
                keyboardType="email-address"
                style={styles.inputLogin}
              />
              <PasswordField
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite a senha"
                errorMessage={passwordError}
              />
              <PasswordField
                label="Confirmar Senha"
                value={repSenha}
                onChangeText={setRepSenha}
                placeholder="Digite a senha novamente"
                errorMessage={repSenhaError}
              />
            </View>
            <View style={styles.viewButtons}>
              <TouchableOpacity onPress={handleRegister} style={styles.buttonLogin}>
                <Text>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { resetFields(); onClose(); }} style={styles.voltarButton}>
                <Ionicons name="chevron-back" size={17} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
