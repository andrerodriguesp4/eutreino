import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CampoBox from "../../utils/CampoBox";
import DropDownPicker from "react-native-dropdown-picker";
import { fetchExercises } from "../../services/fetchExercises";
import { fetchUserExercises } from "../../services/fetchUserExercises";

export default function SetExerciseForm({
  userId,
  treinoId,
  exercicioId,
  setVisible,
  setExerciseFunction,
  isNew = false,
}) {

  const [open, setOpen] = useState(false);
  const [exercicios, setExercicios] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [disabledSave, setDisabledSave] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setEditable] = useState(false);

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
    if (isNew) {
      handleFetchExecises();
      setEditable(true);
    } else {
      handleFetchUserExercises();
    };
  }, [treinoId,exercicioId]);

  const resetFields = () => {
    setTitulo('');
    setCarga('');
    setSeries('');
    setDescanso('');
  };

  const dropdownItens = exercicios.map(item => ({
    label: item.titulo,
    value: item.titulo,
  }));

  const filteredItens = dropdownItens.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFetchExecises = async () => {
    const exercicios = await fetchExercises();
    setExercicios(exercicios);
    setIsLoading(false);
  };

  const handleFetchUserExercises = async () => {
    const exercicioSelecionado = await fetchUserExercises(userId, treinoId, exercicioId);
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
  }

  const handleSetExercise = async () => {
    await setExerciseFunction(titulo, carga, series, descanso, modoRepeticoes, valorFixoReps, valorMinimoReps, valorMaximoReps)
  };

  return (
    <View style={styles.slidePanel}>
      <View style={{flexDirection:'row', width: '98%', justifyContent:'flex-end', marginBottom: '20'}}>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <FontAwesome5 name="times" size={25} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size={"large"} color={"black"}/>
      ) : (
        <>
          <View>
            {isNew ? (
              <CampoBox
                label="Exercício:"
                value={titulo}
                setter={setTitulo}
                setDisabledSave={setDisabledSave}
                customComponent={
                  <View style={{width:'60%'}}>
                    <DropDownPicker
                      open={open}
                      setOpen={setOpen}
                      value={titulo}
                      setValue={setTitulo}
                      items={filteredItens}
                      searchable={true}
                      searchPlaceholder="Buscar exercício"
                      placeholder="-"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      onChangeSearchText={setSearchText}
                    />
                  </View>
                }
              />
            ) : (
              <CampoBox
                label={"Exercício:"}
                value={titulo}
                placeholder={titulo}
                setter={setTitulo}
                editable={false}
                setDisabledSave={setDisabledSave}
              />
            )}

            <CampoBox
              label={'Carga:'}
              value={carga}
              placeholder={`${carga ? carga : '10'} Kg`}
              setter={setCarga}
              editable={editable}
              setDisabledSave={setDisabledSave}
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
                setDisabledSave={setDisabledSave}
              />
            ) : (
              <>
                <CampoBox
                  label="Minimo:"
                  value={valorMinimoReps}
                  placeholder="8"
                  setter={setValorMinimoReps}
                  editable={editable}
                  setDisabledSave={setDisabledSave}
                />
                <CampoBox
                  label="Máximo"
                  value={valorMaximoReps}
                  placeholder="12"
                  setter={setValorMaximoReps}
                  editable={editable}
                  setDisabledSave={setDisabledSave}
                />
              </>
            )}

            <CampoBox
              label={'Séries:'}
              value={series}
              placeholder={series ? series : "4"}
              setter={setSeries}
              editable={editable}
              setDisabledSave={setDisabledSave}
            />
            <CampoBox
              label={'Descanso:'}
              value={descanso}
              placeholder={`${descanso ? descanso : 30} segundos`}
              setter={setDescanso}
              editable={editable}
              setDisabledSave={setDisabledSave}
            />
            
            <View style={styles.campoBox}>
              {!isNew ? (
                <TouchableOpacity
                  style={styles.actionButton}     
                  onPress={() => setEditable(true)}
                >
                  <Text style={{color: '#FA801C', fontWeight: 'bold', fontSize: 22, alignSelf: 'center'}}>Editar</Text>
                </TouchableOpacity>
              ) : (
                null
              )}
              <TouchableOpacity
                style={{
                  ...styles.saveButton,
                  opacity: disabledSave ? 0.5 : 1,
                }}
                disabled={disabledSave}
                onPress={() => {
                  handleSetExercise();
                  setEditable(false);
                }}
              >
                <Text style={{color: "#016401ef", fontWeight: 'bold', fontSize: 22, alignSelf: 'center'}}>Salvar</Text>
              </TouchableOpacity>
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
  dropdown: {
    backgroundColor: '#f5f4f4ff',
    padding: 5,
    height: 40,
    width: '98%',
    marginHorizontal:0,
    marginVertical: 5,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
})