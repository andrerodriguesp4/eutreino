import { useState } from "react";
import { View, Text, StyleSheet, Vibration } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import IconButton from "../utils/IconButton";

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
                    <IconButton
                        onPress={() => {
                            if(time === 0){
                                return;
                            }else{
                                setTime(time-5)
                            }}
                        }
                        icon={"minus"}
                        disabled={isPlaying}
                    />
                    <Text style={{fontSize: 30, marginHorizontal: 20}}>{time}</Text>
                    <IconButton
                        onPress={() => setTime(time + 5)}
                        icon={"plus"}
                        disabled={isPlaying}
                    />
                </View>
                <View style={styles.viewPlayPause}>
                    <IconButton
                        onPress={() => {
                            if(time > 0){
                                setIsPlaying(true);
                            }}
                        }
                        icon={"play"}
                        color="black"
                        backgroundColor="#ffffff00"
                    />
                    <IconButton
                        onPress={() => (setIsPlaying(false), setTimerKey(prev => prev + 1))}
                        icon={"stop"}
                        color="black"
                        backgroundColor="#ffffff00"
                    />
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
        justifyContent: 'space-evenly',
    },
})