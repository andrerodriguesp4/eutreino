import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';

const PasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    style = {},
    errorMessage = null,
}) => {
    const [visible, setVisible] = useState(false);
    
    return (
    <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.passwordContainer, style]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666"
                secureTextEntry={!visible}
                style={[styles.inputPassword, style]}
                autoCapitalize='none'
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <FontAwesome5
                name={visible ? 'eye-slash' : 'eye'}
                size={20}
                color="#666"
                />
            </TouchableOpacity>
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
    );
};

export default PasswordField;