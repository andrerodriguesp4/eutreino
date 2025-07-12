import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    imageContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 130,
        width: 130,
        borderRadius: 65,
        resizeMode: 'cover',
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginHorizontal: 5,
        marginVertical: 0,
        fontWeight: 'bold',
    },
    inputProfile: {
        backgroundColor: '#f5f4f4ff',
        padding: 5,
        height: 40,
        marginHorizontal:5,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },

    passwordContainer: {
        backgroundColor: '#f5f4f4ff',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingRight: 10,
        marginHorizontal:5,
        marginVertical: 5,
    },
    inputPassword: {
        flex: 1,
        color: '#000',
    },


    saveButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 8,
        backgroundColor: '#ddd',
        marginBottom: 65,
    },
    saveText: {
        color: '#FA801C',
        fontWeight: 'bold',
        fontSize: 22,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;