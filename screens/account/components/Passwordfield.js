import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';
import { COLORS } from '../../styles/default';

const PasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    style = {},
    errorMessage = null,
}) => {
    const [visible, setVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(1)).current;
    
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, {
            toValue: 2,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };
    
    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };
    
    const borderColor = borderAnim.interpolate({
        inputRange: [1, 2],
        outputRange: ['#ccc', COLORS.buttons],
    });
    return (
    <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <Animated.View style={[styles.passwordContainer, style, { borderColor }]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666"
                secureTextEntry={!visible}
                style={styles.inputPassword}
                autoCapitalize='none'
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <FontAwesome5
                    name={visible ? 'eye-slash' : 'eye'}
                    size={20}
                    color={isFocused ? COLORS.buttons : '#666'}
                />
            </TouchableOpacity>
        </Animated.View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
    );
};

export default PasswordField;