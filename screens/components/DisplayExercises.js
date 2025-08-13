import { FlatList, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { COLORS } from "../styles/default";
import IconButton from "../../utils/IconButton";

 
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
                        style={styles.buttonListExercicio}
                        onPress={() => {
                            setExercicioSelectDetalhe(item.id);
                            setUpdateVisible(true);
                        }}
                    >
                        <Text style={{ ...styles.textListExercicio, flex: 1 }}>{item.titulo}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <IconButton
                                onPress={() =>
                                    setCheckButton(
                                        item.id,
                                        item.checkButton === 0 ? 1 : 0
                                )}
                                icon={item.checkButton === 1 ? 'check-square' : 'square'}
                            />
                            {deleteVisible && (
                                <IconButton
                                    onPress={() => deleteExercicio(user, treino, item.id)}
                                    icon={"trash-alt"}
                                    backgroundColor = {'#ff2600c0'}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
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
        backgroundColor: COLORS.list,
        flexDirection: "row",
        padding: 10,
        marginBottom: 4,
        marginHorizontal: 2,
        elevation: 8,
    },
});