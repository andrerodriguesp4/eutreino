import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function ModalContent({ visible, onClose, styles }) {
  const [exercicioSelectDetalhe, setExercicioSelectDetalhe] = useState([]);
  const [campoEditando, setCampoEditando] = useState(null);
  const [newExercicioSelect, setNewExercicioSelect] = useState();
  const [newRepeticoesMinimo, setNewRepeticoesMinimo] = useState();
  const [newRepeticoesMaximo, setNewRepeticoesMaximo] = useState();

  return (
  <Modal visible={visible}>
    <View style={styles.containerModal}>
      {loadingVisible && (
        <View style={styles.viewLoading}>
          <ActivityIndicator
            size={"large"}
          />
        </View>
      )}
      <View style={styles.modalContent}>
        <Text>Clique no ítem para editar</Text>
        <TouchableOpacity
          onPress={() => onClose()}
          style={{ padding: 20 }}
        >
        <Ionicons name="close" size={50} color="black" />
        </TouchableOpacity>
        {exercicioSelectDetalhe.map((item, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => setCampoEditando("titulo")}>
              <Text style={styles.modalText}>Exercício: {item.titulo}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCampoEditando("carga")}>
              <Text style={styles.modalText}>Carga: {item.carga} kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (
                setCampoEditando("repeticoes"),
                setNewRepeticoesMaximo(null),
                setNewRepeticoesMinimo(null)
              )}
            >
              <Text style={styles.modalText}>
                Repetições: {item.repeticoes.minimo} -{" "}
                {item.repeticoes.maximo}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCampoEditando("series")}>
              <Text style={styles.modalText}>Séries: {item.series}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCampoEditando("descanso")}>
              <Text style={styles.modalText}>
                Descanso: {item.descanso} segundos
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
    {campoEditando && (
      <>
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        pointerEvents="auto"
      />
        <View style={styles.slidePanel}>
          {campoEditando === "titulo" && (
            <View style={styles.viewEditando}>
              <Text style={styles.textTituloEditando}>
                Selecione o exercício:
              </Text>
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
                    setNewParametros(
                      treino,
                      exercicioSelectDetalhe[0].id,
                      campoEditando,
                      newExercicioSelect
                    ),
                    setDisabledSalvar(true)
                  )}
                >
                  <Text style={styles.textSalvar}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (
                    setCampoEditando(null),
                    setDisabledSalvar(true),
                    setNewExercicioSelect(listExercicio[0].titulo)
                  )}
                  style={{ padding: 20 }}
                >
                  <Ionicons name="close" size={40} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {campoEditando === "carga" && (
            <View style={styles.viewEditando}>
              <Text style={styles.textTituloEditando}>
                Insira a nova carga:{" "}
              </Text>
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
                    setNewParametros(
                      treino,
                      exercicioSelectDetalhe[0].id,
                      campoEditando,
                      newExercicioSelect
                    ),
                    setDisabledSalvar(true)
                  )}
                >
                      <Text style={styles.textSalvar}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => (
                        setCampoEditando(null), setDisabledSalvar(true)
                      )}
                    >
                      <Ionicons name="close" size={40} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {campoEditando === "repeticoes" && (
                <View style={styles.viewEditando}>
                  <Text style={styles.textTituloEditando}>
                    Insira o novo intervalo de repetições:{" "}
                  </Text>
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
                          setNewParametros(
                            treino,
                            exercicioSelectDetalhe[0].id,
                            "repeticoes.minimo",
                            newRepeticoesMinimo
                          );
                        newRepeticoesMaximo &&
                          setNewParametros(
                            treino,
                            exercicioSelectDetalhe[0].id,
                            "repeticoes.maximo",
                            newRepeticoesMaximo
                          );
                        setNewRepeticoesMinimo(null);
                        setNewRepeticoesMaximo(null);
                        setDisabledSalvar(true);
                      }}
                    >
                      <Text style={styles.textSalvar}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => (
                        setCampoEditando(null),
                        setDisabledSalvar(true),
                        setNewRepeticoesMaximo(null),
                        setNewRepeticoesMinimo(null)
                      )}
                    >
                      <Ionicons name="close" size={40} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {campoEditando === "series" && (
                <View style={styles.viewEditando}>
                  <Text style={styles.textTituloEditando}>
                    Insira a nova quantidade de séries:
                  </Text>
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
                  <View style={styles.viewSalvarFechar}>
                    <TouchableOpacity
                      style={{
                        ...styles.touchableOpacitySalvar,
                        opacity: disabledSalvar ? 0.5 : 1,
                      }}
                      disabled={disabledSalvar}
                      onPress={() =>
                        setNewParametros(
                          treino,
                          exercicioSelectDetalhe[0].id,
                          campoEditando,
                          newExercicioSelect
                        )
                      }
                    >
                      <Text style={styles.textSalvar}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => (
                        setDisabledSalvar(true), setCampoEditando(null)
                      )}
                    >
                      <Ionicons name="close" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {campoEditando === "descanso" && (
                <View style={styles.viewEditando}>
                  <Text style={styles.textTituloEditando}>
                    Insira o novo tempo de descanso:
                  </Text>
                  <View style={styles.viewSalvarFechar}>
                    <TextInput
                      style={styles.textInputEditando}
                      placeholder={listExercicio[0].descanso.toString()}
                      placeholderTextColor={"#0000006e"}
                      keyboardType="numeric"
                      onChange={(itemValue) => (
                        setNewExercicioSelect(itemValue.nativeEvent.text),
                        setDisabledSalvar(false)
                      )}
                    />
                    <Text style={{ marginLeft: 15, fontSize: 20 }}>
                      segundos
                    </Text>
                  </View>
                  <View style={styles.viewSalvarFechar}>
                    <TouchableOpacity
                      style={{
                        ...styles.touchableOpacitySalvar,
                        opacity: disabledSalvar ? 0.5 : 1,
                      }}
                      disabled={disabledSalvar}
                      onPress={() =>
                        setNewParametros(
                          treino,
                          exercicioSelectDetalhe[0].id,
                          campoEditando,
                          newExercicioSelect
                        )
                      }
                    >
                      <Text style={styles.textSalvar}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => (
                        setDisabledSalvar(true), setCampoEditando(null)
                      )}
                    >
                      <Ionicons name="close" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </Modal>
  );
}
