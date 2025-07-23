import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function FormularioAdicionarExercicio({
  open,
  setOpen,
  items,
  setItems,
  tituloAdicionar,
  setTituloAdicionar,
  cargaAdicionar,
  setCargaAdicionar,
  repeticoesMinimoAdicionar,
  setRepeticoesMinimoAdicionar,
  repeticoesMaximoAdicionar,
  setRepeticoesMaximoAdicionar,
  seriesAdicionar,
  setSeriesAdicionar,
  descansoAdicionar,
  setDescansoAdicionar,
  disabledSalvar,
  setDisabledSalvar,
  setCampoAdicionando,
  setNewExercicio,
  treino,
  campoAdicionando,
}) {
  if (!campoAdicionando) return null;

  const resetFormularioAdicionar = () => {
    setCampoAdicionando(false);
    setOpen(false);
    setDisabledSalvar(true);
    setTituloAdicionar(null);
    setCargaAdicionar(null);
    setRepeticoesMinimoAdicionar(null);
    setRepeticoesMaximoAdicionar(null);
    setSeriesAdicionar(null);
    setDescansoAdicionar(null);
  };

  return (
    <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center"
        }}
        pointerEvents="auto">
      <View style={styles.slidePanel}>
        <View style={{alignSelf: "flex-end"}}>
            <TouchableOpacity onPress={resetFormularioAdicionar}>
                <FontAwesome5 name="times" size={25} />
            </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "space-between" }}>
          <View style={styles.viewAdicionando}>
            <Text style={styles.textAdicionando}>Exercício:</Text>
            <DropDownPicker
              open={open}
              value={tituloAdicionar}
              items={items}
              setOpen={setOpen}
              setValue={(val) => {
                setTituloAdicionar(val);
                setDisabledSalvar(false);
              }}
              setItems={setItems}
              placeholder="-"
              style={{ width: 150 }}
              dropDownContainerStyle={{ width: 150 }}
            />
          </View>
          <View style={styles.viewAdicionando}>
            <Text style={styles.textAdicionando}>Carga: </Text>
            <TextInput
              onChangeText={(carga) => {
                setCargaAdicionar(carga);
                setDisabledSalvar(false);
              }}
              style={styles.textInputEditando}
              keyboardType="numeric"
              returnKeyType="done"
            />
            <Text>Kg</Text>
          </View>
          <View style={styles.viewAdicionando}>
            <Text style={styles.textAdicionando}>Repetições:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                onChangeText={(repsmin) => {
                  setRepeticoesMinimoAdicionar(repsmin);
                  setDisabledSalvar(false);
                }}
                style={styles.textInputEditando}
                keyboardType="numeric"
                returnKeyType="done"
              />
              <Text>-</Text>
              <TextInput
                onChangeText={(repsmax) => {
                  setRepeticoesMaximoAdicionar(repsmax);
                  setDisabledSalvar(false);
                }}
                style={styles.textInputEditando}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>
          <View style={styles.viewAdicionando}>
            <Text style={styles.textAdicionando}>Séries:</Text>
            <TextInput
              onChangeText={(series) => {
                setSeriesAdicionar(series);
                setDisabledSalvar(false);
              }}
              style={styles.textInputEditando}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
          <View style={styles.viewAdicionando}>
            <Text style={styles.textAdicionando}>Descanso:</Text>
            <TextInput
              onChangeText={(desc) => {
                setDescansoAdicionar(desc);
                setDisabledSalvar(false);
              }}
              style={styles.textInputEditando}
              keyboardType="numeric"
              returnKeyType="done"
            />
            <Text>segundos</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ ...styles.buttonAdicionar, opacity: disabledSalvar ? 0.5 : 1 }}
            disabled={disabledSalvar}
            onPress={() => {
              setNewExercicio(
                treino,
                tituloAdicionar,
                cargaAdicionar,
                repeticoesMinimoAdicionar,
                repeticoesMaximoAdicionar,
                seriesAdicionar,
                descansoAdicionar,
                resetFormularioAdicionar
              );
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slidePanel: {
    width: "98%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center", // centraliza verticalmente
    alignItems: "center", // centraliza horizontalmente
  },
  viewAdicionando: {
    flexDirection: "row",
    alignItems: "center", // alinha verticalmente texto e input
    justifyContent: "flex-start",
    marginBottom: 12, // espaço entre os campos
    width: "100%",
    maxWidth: 350,
  },
  textAdicionando: {
    width: 90,
    textAlign: "left", // alinha texto à esquerda
    marginRight: 10,
    fontSize: 16,
  },
  textInputEditando: {
    borderWidth: 1,
    borderRadius: 5,
    width: 120,
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    fontSize: 16,
    color: "black",
    backgroundColor: "#f5f5f5",
  },
  buttonAdicionar: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
})