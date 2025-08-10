import { View } from "react-native"
import PasswordField from "./Passwordfield"
import { useState } from "react";
import styles from '../../account/styles/styles';
import { updatePassword } from "../../../services/updatePassword";
import ModernButton from "../../../utils/ModernButton";

export default function PasswordUpdateScreen({navigation, route}){
    const {userId} = route.params;
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    async function handleUpdatePassword(){
        setPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');

        const success = await updatePassword(
            userId, password, newPassword, confirmPassword,
            setPasswordError, setNewPasswordError, setConfirmPasswordError);
        
        if(success){navigation.goBack();}
    }

    return (
        <View style={styles.container}>
            <View style={{marginTop:10, marginHorizontal:5}}>
                <PasswordField
                    label={"Senha Atual"}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={"Senha Atual"}
                    errorMessage={passwordError}
                />
                <PasswordField
                    label={"Nova Senha"}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nova Senha"
                    errorMessage={newPasswordError}
                />
                
                <PasswordField
                    label={"Confirmar Nova Senha"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Digite a senha novamente"
                    errorMessage={confirmPasswordError}
                />
            </View>
            <View style={{...styles.footContainer, alignSelf: 'center'}}>
                <ModernButton
                    text="Salvar Dados"
                    onPress={handleUpdatePassword}
                    icon="save"
                />
            </View>
        </View>
    )
}