import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import {db} from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getUser } from '../services/getUser';
import ModalContent from "./components/ModalContent";
import SlidePanelEdicoes from "./components/SlidePanelEdicoes";
import FormularioAdicionarExercicio from "./components/FormularioAdicionarExercicio";

export default function DetalhesTreino({ navigation }) {
  const route = useRoute();
  const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [campoEditando, setCampoEditando] = useState(null);
  const [newExercicioSelect, setNewExercicioSelect] = useState();
  const [exercicios, setExercicios] = useState([]);
  const [user, setUser] = useState();
  const treino = route.params.treino;
  const [listExercicio, setListExercicio] = useState(route.params.treinoDetalhe);
  const [disabledSalvar, setDisabledSalvar] = useState(true);
  const [newRepeticoesMinimo, setNewRepeticoesMinimo] = useState();
  const [newRepeticoesMaximo, setNewRepeticoesMaximo] = useState();
  const [campoAdicionando, setCampoAdicionando] = useState(false);
  const [tituloAdicionar, setTituloAdicionar] = useState(null);
  const [cargaAdicionar, setCargaAdicionar] = useState(null);
  const [repeticoesMinimoAdicionar, setRepeticoesMinimoAdicionar] = useState(null);
  const [repeticoesMaximoAdicionar, setRepeticoesMaximoAdicionar] = useState(null);
  const [seriesAdicionar, setSeriesAdicionar] = useState(null);
  const [descansoAdicionar, setDescansoAdicionar] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    getUser(setUser, navigation);
    fetchExercicios();
  }, []);
  useEffect(() => {
    const itensAtualizados = exercicios.map((item) => ({
      label: item.titulo,
      value: item.titulo,
    }));
    setItems(itensAtualizados);
  }, [exercicios]);

  function sleep(ms){
    return new Promise(result => setTimeout(result, ms))
  };

  const fetchExerciciosSelectDetalhes = async (exercicio) => {
    try {
      const filterList = listExercicio.filter((item) => item.id === exercicio);

      setExercicioSelectDetalhe(filterList);
    } catch {
      console.log(error)(
        "Erro na função fetchExerciciosSelectDetalhes: ",
        error
      );
    }
  };
  const fetchExercicios = async () => {
    try {
      setLoadingVisible(true);
      const exerciciosCollection = collection(db, "exercicios");
      const querySnapshot = await getDocs(exerciciosCollection);

      const exerciciosList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setExercicios(exerciciosList);
      await sleep(500);
      setLoadingVisible(false);
      
    } catch (error) {
      console.log("Erro na função fetchExercicios: ", error);
    }
  };

  async function setNewParametros(treino, exercicio, parametro, newParametros) {
    try {
      setLoadingVisible(true);
      const treinosCollection = collection(db, `users/${user}/treinos/${treino}/exercicios`);

      const docSelect = query(treinosCollection, where("id", "==", exercicio));
      const querySnapshot = await getDocs(docSelect);

      for (const document of querySnapshot.docs) {
        await updateDoc(doc(db, document.ref.path), {
          [parametro]: newParametros,
        });
      }

      const atualizarItem = (item) => {
        if (item.id !== exercicio) return item;

        if (parametro.startsWith("repeticoes.")) {
          const subCampo = parametro.split(".")[1];
          return {
            ...item,
            repeticoes: {
              ...item.repeticoes,
              [subCampo]: newParametros,
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

  async function setNewExercicio(treino, titulo, carga, minimo, maximo, series, descanso) {
  try {
    setLoadingVisible(true);
    if (!titulo) {
      alert("Selecione o exercício!");
    } else {
      const exerciciosRef = collection(
        db,
        `users/${user}/treinos/${treino}/exercicios`
      );
      const snapshot = await getDocs(exerciciosRef);

      let maiorId = -1;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.id === "number" && data.id > maiorId) {
          maiorId = data.id;
        }
      });

      const novoId = maiorId + 1;

      await setDoc(doc(exerciciosRef, novoId.toString()), {
        titulo,
        carga,
        repeticoes: { minimo, maximo },
        series,
        descanso,
        id: novoId,
        checkButton: 0,
      });

      setListExercicio((prev) => [
        ...prev,
        {
          titulo,
          carga,
          repeticoes: { minimo, maximo },
          series,
          descanso,
          id: novoId,
          checkButton: 0,
        },
      ]);

      setCampoAdicionando(false);
      setOpen(false);
      setDisabledSalvar(true);
      setTituloAdicionar(null);
      setCargaAdicionar(null);
      setRepeticoesMinimoAdicionar(null);
      setRepeticoesMaximoAdicionar(null);
      setSeriesAdicionar(null);
      setDescansoAdicionar(null);
      setLoadingVisible(false);
    }
  } catch (error) {
    console.log("Erro na função setNewExercicio", error);
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
  
  return (
    <View style={styles.container}>
      {modalVisible && (
        <View style={styles.overlay}>
          <View style={styles.containerModal}>
            {loadingVisible && (
              <View style={styles.viewLoading}>
                <ActivityIndicator size={"large"} color={"black"} />
              </View>
            )}
            <ModalContent
              exercicioSelectDetalhe={exercicioSelectDetalhe}
              setCampoEditando={setCampoEditando}
              setModalVisible={setModalVisible}
            />
          </View>
          <SlidePanelEdicoes
          campoEditando={campoEditando}
          disabledSalvar={disabledSalvar}
          setDisabledSalvar={setDisabledSalvar}
          newExercicioSelect={newExercicioSelect}
          setNewExercicioSelect={setNewExercicioSelect}
          setCampoEditando={setCampoEditando}
          setNewParametros={setNewParametros}
          listExercicio={listExercicio}
          exercicios={exercicios}
          treino={treino}
          exercicioSelectDetalhe={exercicioSelectDetalhe}
          newRepeticoesMinimo={newRepeticoesMinimo}
          setNewRepeticoesMinimo={setNewRepeticoesMinimo}
          newRepeticoesMaximo={newRepeticoesMaximo}
          setNewRepeticoesMaximo={setNewRepeticoesMaximo}
        />
      </View>
    )}
    <VirtualizedList
        style={styles.viewVirtualizedList}
        data={listExercicio}
        getItemCount={(treinoDetalhe) => treinoDetalhe.length}
        getItem={(treinoDetalhe, index) => treinoDetalhe[index]}
        renderItem={({ item, index }) => (
          <View key={index}>
            <TouchableOpacity
              style={{ ...styles.buttonListExercicio, flexDirection: "row" }}
              onPress={() => (
                fetchExerciciosSelectDetalhes(item.id),
                setModalVisible(true),
                setNewExercicioSelect(item.titulo)
              )}
            >
              <Text style={{ ...styles.textListExercicio, flex: 1 }}>
                {item.titulo}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => 
                  setNewParametros(
                    treino,
                    item.id,
                    'checkButton',
                    item.checkButton === 0 ? 1 : 0
                )}>
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
            onPress={() => setCampoAdicionando(true)}
          >
            <FontAwesome5 name="plus" color={"white"} size={20} />
            <Text style={{ ...styles.textAdicionarExercicio, marginLeft: 5 }}>
              Adicionar Exercício
            </Text>
          </TouchableOpacity>
        )}
      />
      <FormularioAdicionarExercicio
      open={open}
      setOpen={setOpen}
      items={items}
      setItems={setItems}
      tituloAdicionar={tituloAdicionar}
      setTituloAdicionar={setTituloAdicionar}
      cargaAdicionar={cargaAdicionar}
      setCargaAdicionar={setCargaAdicionar}
      repeticoesMinimoAdicionar={repeticoesMinimoAdicionar}
      setRepeticoesMinimoAdicionar={setRepeticoesMinimoAdicionar}
      repeticoesMaximoAdicionar={repeticoesMaximoAdicionar}
      setRepeticoesMaximoAdicionar={setRepeticoesMaximoAdicionar}
      seriesAdicionar={seriesAdicionar}
      setSeriesAdicionar={setSeriesAdicionar}
      descansoAdicionar={descansoAdicionar}
      setDescansoAdicionar={setDescansoAdicionar}
      disabledSalvar={disabledSalvar}
      setDisabledSalvar={setDisabledSalvar}
      setCampoAdicionando={setCampoAdicionando}
      setNewExercicio={setNewExercicio}
      treino={treino}
      campoAdicionando={campoAdicionando}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  containerModal: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width:'95%'
  },
  modalContent: {
    alignItems: "center",
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
