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
        marginBottom: 40,
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
    imageBg:{
        height: "100%",
        width: "100%",
        flex:1,
        backgroundColor: 'black',
    }
});

export default styles;