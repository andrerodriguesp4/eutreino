import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Timer (){
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timerKey, setTimerKey] = useState(0);

    return (
        <View style={styles.viewTimer}>
            <CountdownCircleTimer
                key={timerKey}
                isPlaying={isPlaying}
                duration={time}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[10, 5, 2, 0]}
                onComplete={() => {
                    setIsPlaying(false);
                    setTimerKey(prev => prev + 1);
                    Vibration.vibrate();
                    alert("Tempo encerrado!");
                    return { shouldRepeat: false };
                }}
            >
                {({ remainingTime }) => <Text style={{ fontSize: 30 }}>{remainingTime}</Text>}
            </CountdownCircleTimer>
            <View>
                <View style={styles.viewAddTime}>
                    <TouchableOpacity onPress={() => {
                        if(time === 0){
                            return;
                        }else{
                            setTime(time-5)
                        }
                        }}
                        
                        disabled={isPlaying}
                    >
                        <FontAwesome5 name="minus" size={30}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 30, marginHorizontal: 20}}>{time}</Text>
                    <TouchableOpacity onPress={() => setTime(time + 5)} disabled={isPlaying}>
                        <FontAwesome5 name="plus" size={30}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewPlayPause}>
                    <TouchableOpacity style={{right: 20}} onPress={() => {
                        if(time > 0){
                            setIsPlaying(true);
                        }
                    }}>
                        <FontAwesome5 name="play" size={25}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{left: 20}} onPress={() => (setIsPlaying(false), setTimerKey(prev => prev + 1))}>
                        <FontAwesome5 name="stop" size={25}/>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    viewTimer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAddTime:{
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        top: 50,
        marginBottom: 50,
    },
    viewPlayPause: {
        flexDirection: 'row',
        top: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})