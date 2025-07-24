import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000ff',
    },
    inputLogin: {
        backgroundColor:'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 5,
        width: 250,
    },
    inputLoginPassword: {
        backgroundColor:'white',
        borderColor: 'black',
        width: 250,
    },
    viewInputs:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLogin: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignItems: 'center',
        margin: 5,
        
    },
    viewButtons: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
    },
    viewModal: {
        flex: 1,
        margin: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewForm:{
        backgroundColor: '#FA801C',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    voltarButton: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        margin: 5,
    },
    viewLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: '#0000008a',
        justifyContent: 'center',
        alignItems: 'center',
    },  
});

export default styles;