import { useEffect, useState } from "react";
import WorkoutScreen from "./components/WorkoutScreen"
import { getUser } from "../services/getUser";

const TodayWorkout = ({ navigation }) => {
    
    const [userId, setUserId] = useState(null);

    useEffect(() =>{
        getUser(setUserId, navigation);
    }, []);
    return (
        <WorkoutScreen
            userId={userId}
            markAsDone={true}
            deleteVisible={false}
        />
    )
}

export default TodayWorkout;