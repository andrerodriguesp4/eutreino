import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container1: {
        paddingVertical: 10,
        paddingHorizontal:30,
        borderRadius: 25,
        backgroundColor: '#ffffff1f',

    },
    whitetext:{
        fontFamily: 'impact',
        fontSize: 40,
        color: 'white',
        marginBottom: -20,
    },
    redtext:{
        fontFamily: 'impact',
        fontSize: 80,
        color: '#fa801c',
    },
    button: {
        backgroundColor: '#008000b0',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 50,
    },
    textbutton: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    imageBg:{
        height: "100%",
        width: "100%",
        flex:1,
        backgroundColor: 'black',
    }
});

export default styles;