import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function SlidePanelEdicoes({
  campoEditando,
  disabledSalvar,
  setDisabledSalvar,
  newExercicioSelect,
  setNewExercicioSelect,
  setCampoEditando,
  setNewParametros,
  listExercicio,
  exercicios,
  treino,
  exercicioSelectDetalhe,
  newRepeticoesMinimo,
  setNewRepeticoesMinimo,
  newRepeticoesMaximo,
  setNewRepeticoesMaximo,
}) {
  if (!campoEditando) return null;
  const id = exercicioSelectDetalhe[0]?.id;

  return (
    <View style={styles.slidePanel}>
        {campoEditando === "titulo" && (
          <View style={styles.viewEditando}>
            <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
            <Text style={styles.textTituloEditando}>Selecione o exercício:</Text>
              <View style={{alignSelf: "flex-end"}}>
                <TouchableOpacity onPress={() => (
                  setCampoEditando(null),
                  setDisabledSalvar(true),
                  setNewExercicioSelect(listExercicio[0].titulo)
                )}>
                  <FontAwesome5 name="times" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <Picker
              selectedValue={newExercicioSelect}
              onValueChange={(itemValue) => {
                setNewExercicioSelect(itemValue);
                setDisabledSalvar(false);
              }}
              style={{ height: 50, width: 300, paddingBottom: 200 }}
              itemStyle={{ color: "black" }}
            >
              {exercicios.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.titulo}
                  value={item.titulo}
                />
              ))}
            </Picker>
            <View style={styles.viewSalvarFechar}>
              <TouchableOpacity
                style={{
                  ...styles.touchableOpacitySalvar,
                  opacity: disabledSalvar ? 0.5 : 1,
                }}
                disabled={disabledSalvar}
                onPress={() => (
                  setNewParametros(treino, id, campoEditando, newExercicioSelect),
                  setDisabledSalvar(true)
                )}
              >
                <Text style={styles.textSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {campoEditando === "carga" && (
          <View style={styles.viewEditando}>
            <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
              <Text style={styles.textTituloEditando}>Insira a nova carga: </Text>
              <View style={{alignSelf: "flex-end"}}>
                <TouchableOpacity onPress={() => (
                  setCampoEditando(null),
                  setDisabledSalvar(true)
                )}>
                  <FontAwesome5 name="times" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TextInput
                style={styles.textInputEditando}
                placeholder={listExercicio[0].carga}
                placeholderTextColor={"#0000006e"}
                keyboardType="numeric"
                onChange={(itemValue) => (
                  setNewExercicioSelect(itemValue.nativeEvent.text),
                  setDisabledSalvar(false)
                )}
              />
              <Text style={{ marginLeft: 15, fontSize: 20 }}>Kg</Text>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TouchableOpacity
                style={{
                  ...styles.touchableOpacitySalvar,
                  opacity: disabledSalvar ? 0.5 : 1,
                }}
                disabled={disabledSalvar}
                onPress={() => (
                  setNewParametros(treino, id, campoEditando, newExercicioSelect),
                  setDisabledSalvar(true)
                )}
              >
                <Text style={styles.textSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {campoEditando === "repeticoes" && (
          <View style={styles.viewEditando}>
            <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
              <Text style={styles.textTituloEditando}>Insira o novo intervalo de repetições:</Text>
              <View style={{alignSelf: "flex-end"}}>
                <TouchableOpacity onPress={() => (
                  setCampoEditando(null),
                  setDisabledSalvar(true),
                  setNewRepeticoesMinimo(null),
                  setNewRepeticoesMaximo(null)
                )}>
                  <FontAwesome5 name="times" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TextInput
                style={styles.textInputEditando}
                placeholder={listExercicio[0].repeticoes.minimo.toString()}
                placeholderTextColor={"#0000006e"}
                keyboardType="numeric"
                onChange={(itemValue) => (
                  setNewRepeticoesMinimo(itemValue.nativeEvent.text),
                  setDisabledSalvar(false)
                )}
              />
              <Text style={{ marginHorizontal: 20 }}>-</Text>
              <TextInput
                style={styles.textInputEditando}
                placeholder={listExercicio[0].repeticoes.maximo.toString()}
                placeholderTextColor={"#0000006e"}
                keyboardType="numeric"
                onChange={(itemValue) => (
                  setNewRepeticoesMaximo(itemValue.nativeEvent.text),
                  setDisabledSalvar(false)
                )}
              />
            </View>
            <View style={styles.viewSalvarFechar}>
              <TouchableOpacity
                style={{
                  ...styles.touchableOpacitySalvar,
                  opacity: disabledSalvar ? 0.5 : 1,
                }}
                disabled={disabledSalvar}
                onPress={() => {
                  newRepeticoesMinimo &&
                    setNewParametros(treino, id, "repeticoes.minimo", newRepeticoesMinimo);
                  newRepeticoesMaximo &&
                    setNewParametros(treino, id, "repeticoes.maximo", newRepeticoesMaximo);
                  setNewRepeticoesMinimo(null);
                  setNewRepeticoesMaximo(null);
                  setDisabledSalvar(true);
                }}
              >
                <Text style={styles.textSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {campoEditando === "series" && (
          <View style={styles.viewEditando}>
            <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
              <Text style={styles.textTituloEditando}>Insira a nova quantidade de séries: </Text>
              <View style={{alignSelf: "flex-end"}}>
                <TouchableOpacity onPress={() => (
                  setCampoEditando(null),
                  setDisabledSalvar(true)
                )}>
                  <FontAwesome5 name="times" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TextInput
                style={styles.textInputEditando}
                placeholder={listExercicio[0].series}
                placeholderTextColor={"#0000006e"}
                keyboardType="numeric"
                onChange={(itemValue) => (
                  setNewExercicioSelect(itemValue.nativeEvent.text),
                  setDisabledSalvar(false)
                )}
              />
            </View>
            <View style={styles.viewSalvarFechar}>
              <TouchableOpacity
                style={{
                  ...styles.touchableOpacitySalvar,
                  opacity: disabledSalvar ? 0.5 : 1,
                }}
                disabled={disabledSalvar}
                onPress={() => (
                  setNewParametros(treino, id, campoEditando, newExercicioSelect),
                  setDisabledSalvar(true)
                )}
              >
                <Text style={styles.textSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {campoEditando === "descanso" && (
          <View style={styles.viewEditando}>
            <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
              <Text style={styles.textTituloEditando}>Insira o novo tempo de descanso: </Text>
              <View style={{alignSelf: "flex-end"}}>
                <TouchableOpacity onPress={() => (
                  setCampoEditando(null),
                  setDisabledSalvar(true)
                )}>
                  <FontAwesome5 name="times" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TextInput
                style={styles.textInputEditando}
                placeholder={listExercicio[0].descanso}
                placeholderTextColor={"#0000006e"}
                keyboardType="numeric"
                onChange={(itemValue) => (
                  setNewExercicioSelect(itemValue.nativeEvent.text),
                  setDisabledSalvar(false)
                )}
              />
              <Text style={{ marginLeft: 15, fontSize: 20 }}>segundos</Text>
            </View>
            <View style={styles.viewSalvarFechar}>
              <TouchableOpacity
                style={{
                  ...styles.touchableOpacitySalvar,
                  opacity: disabledSalvar ? 0.5 : 1,
                }}
                disabled={disabledSalvar}
                onPress={() => (
                  setNewParametros(treino, id, campoEditando, newExercicioSelect),
                  setDisabledSalvar(true)
                )}
              >
                <Text style={styles.textSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
    slidePanel: {
        position: "absolute",
        left: 5,
        right: 5,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
    },
  viewSalvarFechar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textSalvar: {
    fontSize: 20,
    padding: 10,
  },
  touchableOpacitySalvar: {
    backgroundColor: "#00ce005e",
  },
  viewEditando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "98%"
  },
  textInputEditando: {
    borderWidth: 1,
    borderColor: "#000",
    width: 60,
    height: 60,
    padding: 10,
    marginBottom: 20,
    color: "black",
    textAlign: "center",
    fontSize: 20,
  },
  textTituloEditando: {
    fontSize: 15,
  },
})