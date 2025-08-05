import { FlatList, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

 
export default function DisplayExercises({
    user,
    treino,
    listExercicios,
    setListExercicio,
    setExercicioSelectDetalhe,
    setUpdateVisible,
    deleteExercicio,
    deleteVisible = true,
}){
    async function setCheckButton(exercicioId, newValor) {
        try {
            await updateDoc(doc(db, 'users', String(user), 'treinos', String(treino), 'exercicios', String(exercicioId)), {checkButton: newValor});
            setListExercicio((prev) =>
                prev.map((item) =>
                    item.id === exercicioId ? {...item, checkButton: newValor} : item
                )
            );
        } catch (error) {
            console.log("Erro na função setCheckButton:", error);
        }
    };

    return(
        <FlatList
            style={styles.exercisesList}
            data={listExercicios}
            renderItem={({ item, index }) => (
                <View key={index}>
                    <TouchableOpacity
                        style={{ ...styles.buttonListExercicio, flexDirection: "row" }}
                        onPress={() => {
                            setExercicioSelectDetalhe(item.id);
                            setUpdateVisible(true);
                        }}
                    >
                        <Text style={{ ...styles.textListExercicio, flex: 1 }}>{item.titulo}</Text>
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
                            {deleteVisible && (
                                <TouchableOpacity onPress={() => deleteExercicio(user, treino, item.id)}>
                                    <FontAwesome5
                                        name="trash-alt"
                                        size={20}
                                        color={"#ffffff"}
                                        style={styles.buttonListExercicio}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    exercisesList: {
        marginTop: 2,
    },  
    textListExercicio: {
        fontSize: 20,
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ffffff50",
        color: "#ffffff",
    },
    buttonListExercicio: {
        borderRadius: 20,
        backgroundColor: "#ff8585",
        padding: 10,
        marginBottom: 2,
        marginHorizontal: 2,
    },
});