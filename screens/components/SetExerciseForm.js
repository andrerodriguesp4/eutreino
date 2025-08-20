import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Keyboard } from "react-native";
import CampoBox from "../../utils/CampoBox";
import DropDownPicker from "react-native-dropdown-picker";
import { fetchExercises } from "../../services/fetchExercises";
import { getExerciciosDoTreino } from "../../services/workoutService";
import ModernButton from "../../utils/ModernButton";
import IconButton from "../../utils/IconButton";

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
    const listaExercicios = await getExerciciosDoTreino(userId, treinoId);
    const exercicioSelecionado = listaExercicios[exercicioId];
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
    <KeyboardAvoidingView
      style={styles.containerModal}
      behavior={Platform.OS === "ios" ? "padding" : "height"}

      // quantidade de pixels que o conteúdo sobe além do teclado. No android 80 é suficiente
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Não sei no Iphone, não tenho um pra testar
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={{flexDirection:'row', width: '98%', justifyContent:'flex-end'}}>
            <IconButton
              onPress={() => setVisible(false)}
              icon={"times"}
              color="black"
              backgroundColor="#fafafaff"
            />
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
                  type="numeric"
                />

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
                    type="numeric"
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
                      type="numeric"
                    />
                    <CampoBox
                      label="Máximo"
                      value={valorMaximoReps}
                      placeholder="12"
                      setter={setValorMaximoReps}
                      editable={editable}
                      setDisabledSave={setDisabledSave}
                      type="numeric"
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
                  type="numeric"
                />
                <CampoBox
                  label={'Descanso:'}
                  value={descanso}
                  placeholder={`${descanso ? descanso : 30} segundos`}
                  setter={setDescanso}
                  editable={editable}
                  setDisabledSave={setDisabledSave}
                  type="numeric"
                />

                <View style={styles.campoBox}>
                  {!isNew ? (
                    <ModernButton
                      text="Editar"
                      onPress={() => setEditable(true)}
                      icon="user-edit"
                    />
                  ) : (
                    null
                  )}
                  <ModernButton
                    text="Salvar"
                    onPress={() => {
                      handleSetExercise();
                      setEditable(false);
                    }}
                    icon="save"
                    disabled={disabledSave}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 10,
  },
  campoBox: {
    flexDirection:'row',
    justifyContent: 'space-evenly',
    marginVertical: 5,
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
  containerModal: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width:'95%'
  },
})