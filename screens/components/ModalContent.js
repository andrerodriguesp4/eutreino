import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function ModalContent({
  exercicioSelectDetalhe,
  setCampoEditando,
  setModalVisible,
}) {
  return (
    <View style={styles.slidePanel}>
      <View style={{flexDirection:'row', width: '98%', justifyContent: 'space-between', marginBottom: '20'}}>
        <Text>Clique no ítem para editar</Text>
        <View style={{alignSelf: "flex-end"}}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome5 name="times" size={25} />
            </TouchableOpacity>
        </View>
      </View>
      {exercicioSelectDetalhe.map((item, index) => (
        <View key={index}>
          <TouchableOpacity onPress={() => setCampoEditando("titulo")}>
            <Text style={styles.modalText}>Exercício: {item.titulo}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCampoEditando("carga")}>
            <Text style={styles.modalText}>Carga: {item.carga} kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCampoEditando("repeticoes");
            }}
          >
            <Text style={styles.modalText}>
              Repetições: {item.repeticoes.minimo} - {item.repeticoes.maximo}
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
    marginVertical: 10,
  },
})