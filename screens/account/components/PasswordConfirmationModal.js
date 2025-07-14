import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../styles/styles";

const PasswordConfirmationModal= ({
        visible,
        password,
        onChangePassword,
        onCancel,
        onConfirm,
        loading,
        errorMessage,
    }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                    <Text style={styles.modalText}>Digite sua senha para confirmar:</Text>

                    <TextInput
                        placeholder="Senha"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={onChangePassword}
                        style={[
                            styles.modalInput,
                            errorMessage ? {borderColor: '#e53935'} : {},
                        ]}
                        placeholderTextColor="#666"
                    />

                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Confirmar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default PasswordConfirmationModal;