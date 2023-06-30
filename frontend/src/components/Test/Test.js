import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { 
    fetchUserGoals, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    getGoal, 
    getGoals, 
    getUserGoals,
    getNewGoal 
} from '../../store/goals';

import {
    fetchUserExerciseEntries,
    createExerciseEntry,
    updateExerciseEntry,
    deleteExerciseEntry,
} from '../../store/exerciseEntries';

import {
    fetchUserExercise,
    fetchUserExercises,
    fetchAllUserExercises,
    fetchGoalExercises,
    fetchWorkoutExercises,
    createExercise,
    updateExercise,
    deleteExercise,
} from '../../store/exercises';


function LandingPage() {
    const dispatch = useDispatch();
    
    window.dispatch = dispatch;
    window.fetchUserGoals = fetchUserGoals;
    window.createGoal = createGoal;
    window.updateGoal = updateGoal;
    window.deleteGoal = deleteGoal;

    window.fetchUserExerciseEntries = fetchUserExerciseEntries;
    window.createExerciseEntry = createExerciseEntry;
    window.updateExerciseEntry = updateExerciseEntry;
    window.deleteExerciseEntry = deleteExerciseEntry;

    window.fetchUserExercise = fetchUserExercise;
    window.fetchUserExercises = fetchUserExercises;
    window.fetchGoalExercises = fetchGoalExercises;
    window.fetchWorkoutExercises = fetchWorkoutExercises;
    window.fetchAllUserExercises = fetchAllUserExercises;
    window.createExercise = createExercise;
    window.updateExercise = updateExercise;
    window.deleteExercise = deleteExercise;
    
    // console.log(goal)

    // useEffect(() => {
    //     dispatch();
    // }, [])
    
    return (
        <>
            {/* {console.log('TEST COMPONENT ENABLED')} */}
        </>
    );
}

export default LandingPage;