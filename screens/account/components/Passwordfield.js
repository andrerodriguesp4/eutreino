// src/components/PasswordField.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';

const PasswordField = ({ label, value, onChangeText, placeholder }) => {
    const [visible, setVisible] = useState(false);
    return (
    <View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.passwordContainer}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666"
                secureTextEntry={!visible}
                style={styles.inputPassword}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <FontAwesome5
                name={visible ? 'eye-slash' : 'eye'}
                size={20}
                color="#666"
                />
            </TouchableOpacity>
        </View>
    </View>
    );
};

export default PasswordField;