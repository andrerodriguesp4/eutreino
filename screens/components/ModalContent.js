import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CampoBox from "../../utils/CampoBox";
import { doc, updateDoc } from "firebase/firestore";
import { getExerciciosDoTreino } from "../../services/workoutService";
import { db } from "../../firebaseConfig";

export default function ModalContent({
  userId,
  treinoId,
  exercicioId,
  setModalVisible,
}) {
  
  const [disabledSalvar, setDisabledSalvar] = useState(true);
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const[exercise, setExercise] = useState('');
  const [titulo, setTitulo] = useState('');
  const [carga, setCarga] = useState('');
  const [series, setSeries] = useState('');
  const [descanso, setDescanso] = useState('');

  const [modoRepeticoes, setModoRepeticoes] = useState('fixo');
  const [valorFixoReps, setValorFixoReps] = useState('');
  const [valorMinimoReps, setValorMinimoReps] = useState('');
  const [valorMaximoReps, setValorMaximoReps] = useState('');


  useEffect(() => {
    resetFields();
    fetchExercises();
  }, [treinoId,exercicioId]);

  const resetFields = () => {
    setExercise('');
    setTitulo('');
    setCarga('');
    setSeries('');
    setDescanso('');
  };

  const fetchExercises = async () => {
    try {
      const listaExercicios = await getExerciciosDoTreino(userId, treinoId);
      const exercicioSelecionado = listaExercicios[exercicioId];
      
      setExercise(exercicioSelecionado);
      setTitulo(exercicioSelecionado.titulo || '');
      setCarga(exercicioSelecionado.carga || '');
      setSeries(exercicioSelecionado.series || '');
      setDescanso(exercicioSelecionado.descanso || '');
      setIsLoading(false);

      if (exercicioSelecionado.repeticoes?.tipo === 'intervalo'){
        setModoRepeticoes('intervalo');
        setValorMinimoReps(exercicioSelecionado.repeticoes?.minimo || '');
        setValorMaximoReps(exercicioSelecionado.repeticoes?.maximo || '');
      } else {
        setModoRepeticoes('fixo');
        setValorFixoReps(exercicioSelecionado.repeticoes?.valor || '');
      }
    } catch (error) {
      console.log(
        "Erro na função fetchExercises: ", error);
    }
  };

  const handleUpdateExercise = async () => {
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
      await updateDoc(doc(db, 'users', String(userId), 'treinos', String(treinoId), 'exercicios', String(exercicioId)), dadosAtualizados);
      resetFields();
      Alert.alert('Sucesso', 'Dados atualizados!');
      setDisabledSalvar(true);
      setModalVisible(false);
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível atualizar os dados.')
    } finally {
      setIsUpdating(false);
    }
  };

  if (!exercise) return <ActivityIndicator size="large" color="#FA801C" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.slidePanel}>
      <View style={{flexDirection:'row', width: '98%', justifyContent:'flex-end', marginBottom: '20'}}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <FontAwesome5 name="times" size={25} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size={"large"} color={"black"}/>
      ) : (
        <>
          <View>
            <CampoBox
              label={"Exercício:"}
              value={titulo}
              placeholder={titulo}
              setter={setTitulo}
              editable={false}
              setDisabledSalvar={setDisabledSalvar}
            />
            <CampoBox
              label={'Carga:'}
              value={carga}
              placeholder={`${carga} Kg`}
              setter={setCarga}
              editable={editable}
              setDisabledSalvar={setDisabledSalvar}
            />
            
            <Text style={styles.label}>Modo de Repetições:</Text>
            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent:'space-evenly'}}>
              <TouchableOpacity
                onPress={() => setModoRepeticoes('fixo')}
                style={{
                  backgroundColor: modoRepeticoes === 'fixo' ? '#ccc' : '#eee',
                  padding: 10,
                  borderRadius: 5,
                  marginRight: 5,
                }}
              >
                <Text>Fixo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModoRepeticoes('intervalo')}
                style={{
                  backgroundColor: modoRepeticoes === 'intervalo' ? '#ccc' : '#eee',
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text>Intervalo</Text>
              </TouchableOpacity>
            </View>
            {modoRepeticoes === 'fixo' ? (
              <CampoBox
                label="Repetições:"
                value={valorFixoReps}
                placeholder="12"
                setter={setValorFixoReps}
                editable={editable}
                setDisabledSalvar={setDisabledSalvar}
              />
            ) : (
              <>
                <CampoBox
                  label="Minimo:"
                  value={valorMinimoReps}
                  placeholder="8"
                  setter={setValorMinimoReps}
                  editable={editable}
                  setDisabledSalvar={setDisabledSalvar}
                />
                <CampoBox
                  label="Máximo"
                  value={valorMaximoReps}
                  placeholder="12"
                  setter={setValorMaximoReps}
                  editable={editable}
                  setDisabledSalvar={setDisabledSalvar}
                />
              </>
            )}

            <CampoBox
              label={'Séries:'}
              value={series}
              placeholder={series}
              setter={setSeries}
              editable={editable}
              setDisabledSalvar={setDisabledSalvar}
            />
            <CampoBox
              label={'Descanso:'}
              value={descanso}
              placeholder={`${descanso} segundos`}
              setter={setDescanso}
              editable={editable}
              setDisabledSalvar={setDisabledSalvar}
            />
            
            <View style={styles.campoBox}>
              <TouchableOpacity
                style={styles.actionButton}     
                onPress={() => setEditable(true)}         
              >
                <Text style={{color: '#FA801C', fontWeight: 'bold', fontSize: 22, alignSelf: 'center'}}>Editar</Text>
              </TouchableOpacity>
              {isUpdating ? (
                <ActivityIndicator size="large" color="#FA801C" style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity
                  style={{
                    ...styles.saveButton,
                    opacity: disabledSalvar ? 0.5 : 1,
                  }}
                  disabled={disabledSalvar}
                  onPress={() => {
                    handleUpdateExercise();
                    setEditable(false);
                  }}
                >
                  <Text style={{color: "#016401ef", fontWeight: 'bold', fontSize: 22, alignSelf: 'center'}}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  slidePanel: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center", // centraliza verticalmente
  },
  modalText: {
    fontSize: 20,
  },
  campoBox: {
    flexDirection:'row',
    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  label: {
    fontSize: 20,
    color: '#444',
    marginHorizontal: 5,
    marginVertical: 0,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  saveButton: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#00ce005e",
  },
  actionButton: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
})