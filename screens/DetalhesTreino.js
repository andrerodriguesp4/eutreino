import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import {db} from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getUser } from '../services/getUser';
import SetExerciseForm from "./components/SetExerciseForm";
import { fetchUserExercises } from "../services/fetchUserExercises";

export default function DetalhesTreino({ navigation }) {
  const route = useRoute();
  const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
  const [user, setUser] = useState();
  const treino = route.params.treino;
  const [listExercicio, setListExercicio] = useState(route.params.treinoDetalhe);
  
  const [addExerciseVisible, setAddExerciseVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getUser(setUser, navigation);
  }, []);

  function sleep(ms){
    return new Promise(result => setTimeout(result, ms))
  };
  
  const handleUpdateExercise = async (titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps) => {
    const exercise = await fetchUserExercises(user, treino, exercicioSelectDetalhe);
    setIsUpdating(true);
    
    const dadosAtualizados = {};
    if (carga !== exercise.carga) dadosAtualizados.carga = carga;
    if (series !== exercise.series) dadosAtualizados.series = series;
    if (descanso !== exercise.descanso) dadosAtualizados.descanso = descanso;
    
    if (modoRepeticoes === 'fixo') {
      if (!valorFixoReps) {
        Alert.alert('Erro', 'Informe o valor fixo das repetições.');
        setIsUpdating(false);
        return;
      }
      dadosAtualizados.repeticoes = {
        tipo: 'fixo',
        valor: valorFixoReps,
      };
    } else if (modoRepeticoes === 'intervalo') {
      if (!valorMinimoReps || !valorMaximoReps) {
        Alert.alert('Erro', 'Informe o mínimo e máximo de repetições.');
        setIsUpdating(false);
        return;
      }
      dadosAtualizados.repeticoes = {
        tipo: 'intervalo',
        minimo: valorMinimoReps,
        maximo: valorMaximoReps,
      };
    }
    
    try {
      await updateDoc(doc(db, 'users', String(user), 'treinos', String(treino), 'exercicios', String(exercicioSelectDetalhe)), dadosAtualizados);
      Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível atualizar os dados.')
    } finally {
      setIsUpdating(false);
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
      
      setListExercicio((prev) => [
        ...prev,
        {
          titulo,
          carga,
          series,
          descanso,
          repeticoes,
          id: novoId,
          checkButton: 0,
        },
      ]);
    } catch (error) {
      console.log("Erro na função handleNewExercise", error);
      setLoadingVisible(false);
    } finally {
      setLoadingVisible(false);
      setAddExerciseVisible(false);
    }
  }

  async function setCheckButton(exercicioId, newValor) {
    try {
      await updateDoc(doc(db, 'users', String(user), 'treinos', String(treino), 'exercicios', String(exercicioId)), {checkButton: newValor});
      setListExercicio((prev) =>
        prev.map((item) =>
          item.id === exercicioId ? {...item, checkButton: newValor} : item
        )
      );

      await sleep(50);
    } catch (error) {
      console.log("Erro na função setCheckButton:", error);
    }
  };

  async function deleteExercicio(user, treino, exercicioId) {
    try{
      setLoadingVisible(true);
      await deleteDoc(doc(db, `users/${user}/treinos/${treino}/exercicios`, exercicioId.toString()));
      fetchListaExercicios(user, treino);
      setLoadingVisible(false);
    }catch(error){
      console.log('Erro na função deleteExercicio', error);
    }
  };

  async function fetchListaExercicios(user, treino) {
    try{
      const exerciciosRef = collection(db, `users/${user}/treinos/${treino}/exercicios`);
      const snapshot = await getDocs(exerciciosRef);
      const novaLista = snapshot.docs.map(doc => doc.data());
      setListExercicio(novaLista);    
    }catch(error){
      console.log('Erro na função fetchListaExercicio', error);
    }
  }
  
  if (isUpdating){ <ActivityIndicator size="large" color="#FA801C" style={{ marginTop: 20 }} />}
  return (
    <View style={styles.container}>
      {updateVisible && (
        <View style={styles.overlay}>
          {loadingVisible && (
            <View style={styles.viewLoading}>
              <ActivityIndicator size={"large"} color={"black"} />
            </View>
          )}
          <SetExerciseForm
            userId={user}
            treinoId={treino}
            exercicioId={exercicioSelectDetalhe}
            setVisible={setUpdateVisible}
            setExerciseFunction={handleUpdateExercise}
          />
      </View>
    )}
    <FlatList
      style={styles.viewVirtualizedList}
      data={listExercicio}
      renderItem={({ item, index }) => (
        <View key={index}>
          <TouchableOpacity
            style={{ ...styles.buttonListExercicio, flexDirection: "row" }}
            onPress={() => {
              setExercicioSelectDetalhe(item.id);
              setUpdateVisible(true);
            }}
          >
            <Text style={{ ...styles.textListExercicio, flex: 1 }}>
              {item.titulo}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => 
                setCheckButton(
                  item.id,
                  item.checkButton === 0 ? 1 : 0
                )}
              >
                <Ionicons
                  name={item.checkButton === 1 ? 'checkmark-outline' : 'stop-outline'}
                  size={22}
                  color={"#ffffff"}
                  style={styles.buttonListExercicio}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExercicio(user, treino, item.id)}>
                <FontAwesome5
                  name="trash-alt"
                  size={20}
                  color={"#ffffff"}
                  style={styles.buttonListExercicio}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={() => (
        <TouchableOpacity
          style={{
            ...styles.buttonAdicionarExercicio,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => setAddExerciseVisible(true)}
        >
          <FontAwesome5 name="plus" color={"white"} size={20} />
          <Text style={{ ...styles.textAdicionarExercicio, marginLeft: 5 }}>
            Adicionar Exercício
          </Text>
        </TouchableOpacity>
      )}
    />
      {addExerciseVisible && (
        <View style={styles.overlay}>
          {loadingVisible && (
            <View style={styles.viewLoading}>
              <ActivityIndicator size={"large"} color={"black"} />
            </View>
          )}
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

      {loadingVisible && (
        <View style={styles.viewLoading}>
          <ActivityIndicator
            size={"large"}
            color={"black"}
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
  textListExercicio: {
    fontSize: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ffffff50",
    color: "#ffffff",
  },
  buttonListExercicio: {
    backgroundColor: "#ff8585",
    padding: 10,
    marginBottom: 2,
    marginHorizontal: 2,
  },
  viewVirtualizedList: {
    marginTop: 2,
  },  
  textAdicionarExercicio: {
    fontSize: 20,
    padding: 5,
    color: "#ffffff",
  },
  buttonAdicionarExercicio: {
    backgroundColor: "#ff4949",
    padding: 10,
    marginBottom: 2,
    marginHorizontal: 2,
  },  
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
});
