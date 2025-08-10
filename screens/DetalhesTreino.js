import { View, StyleSheet, ActivityIndicator, Alert, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";
import {db} from "../firebaseConfig";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getUser } from '../services/getUser';
import SetExerciseForm from "./components/SetExerciseForm";
import { fetchUserExercises } from "../services/fetchUserExercises";
import DisplayExercises from "./components/DisplayExercises";
import { updateExercise } from "../services/updateExercise";
import ModernButton from "../utils/ModernButton";

export default function DetalhesTreino({ navigation }) {
  const route = useRoute();
  const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
  const [user, setUser] = useState();
  const treino = route.params.treino;
  const [listExercicio, setListExercicio] = useState([]);
  
  const [addExerciseVisible, setAddExerciseVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    getUser(setUser, navigation);
  }, []);

  useEffect(() => {
    if (user) {handleUserExercises();}
  }, [user, treino]);

  async function handleUserExercises(){
    const listaExercicios = await fetchUserExercises(user, treino);
    setListExercicio(listaExercicios);
  };
  
  const handleUpdateExercise = async (titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) => {
    setLoadingVisible(true);
    try {
      await updateExercise(user, treino, exercicioSelectDetalhe, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps);
    } catch (error){
      console.log(error);
    } finally {
      setLoadingVisible(false);
      setUpdateVisible(false);
    }
  };
  

  const handleNewExercise = async (titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) => {
    setLoadingVisible(true);
    
    if (!titulo) {
      Alert.alert("Selecione o exercício!");
      setLoadingVisible(false);
      return;
    }
    if (modoRepeticoes === 'fixo' && !valorFixoReps) {
      Alert.alert('Erro', 'Informe o valor fixo das repetições.');
      setLoadingVisible(false);
      return;
    }
    if (modoRepeticoes === 'intervalo' && (!valorMinimoReps || !valorMaximoReps)) {
      Alert.alert('Erro', 'Informe o mínimo e máximo de repetições.');
      setLoadingVisible(false);
      return;
    }
    
    try {      
      const exerciciosRef = collection(db, `users/${user}/treinos/${treino}/exercicios`);
      const snapshot = await getDocs(exerciciosRef);
      
      let maiorId = -1;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.id === "number" && data.id > maiorId) {
          maiorId = data.id;
        }
      });
      
      const novoId = maiorId + 1;
      
      let repeticoes = {};
      if (modoRepeticoes === 'fixo') {
        repeticoes = { tipo: 'fixo', valor: valorFixoReps };
      } else if (modoRepeticoes === 'intervalo') {
        repeticoes = { tipo: 'intervalo', minimo: valorMinimoReps, maximo: valorMaximoReps };
      }
      
      await setDoc(doc(exerciciosRef, novoId.toString()), {
        titulo,
        carga,
        series,
        descanso,
        repeticoes,
        id: novoId,
        checkButton: 0,
      });
      
      await handleUserExercises();
    } catch (error) {
      console.log("Erro na função handleNewExercise", error);
      setLoadingVisible(false);
    } finally {
      setLoadingVisible(false);
      setAddExerciseVisible(false);
    }
  }

  async function deleteExercicio(user, treino, exercicioId) {
    try{
      setLoadingVisible(true);
      await deleteDoc(doc(db, `users/${user}/treinos/${treino}/exercicios`, exercicioId.toString()));
      await handleUserExercises();
    }catch(error){
      console.log('Erro na função deleteExercicio', error);
    } finally{
      setLoadingVisible(false);
    }
  };
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={loadingVisible}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <ActivityIndicator size="large" color="black" />
        </View>
      </Modal>
      {updateVisible && (
        <View style={styles.overlay}>
          <SetExerciseForm
            userId={user}
            treinoId={treino}
            exercicioId={exercicioSelectDetalhe}
            setVisible={setUpdateVisible}
            setExerciseFunction={handleUpdateExercise}
          />
      </View>
    )}
    <DisplayExercises
      user={user}
      treino={treino}
      listExercicios={listExercicio}
      setListExercicio={setListExercicio}
      setExercicioSelectDetalhe={setExercicioSelectDetalhe}
      setUpdateVisible={setUpdateVisible}
      deleteExercicio={deleteExercicio}
    />
    <ModernButton
      text="Adicionar Exercício"
      onPress={() => setAddExerciseVisible(true)}
      icon="plus"
    />    
      {addExerciseVisible && (
        <View style={styles.overlay}>
          <SetExerciseForm
            userId={user}
            treinoId={treino}
            exercicioId={exercicioSelectDetalhe}
            setVisible={setAddExerciseVisible}
            setExerciseFunction={handleNewExercise}
            isNew={true}
          />
      </View>
    )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
