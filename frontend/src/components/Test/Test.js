import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { 
    fetchAllUserGoals, 
    fetchUserGoals, 
    fetchUserGoal, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    getGoal, 
    getGoals, 
    getUserKeyGoals,
    getNewGoal 
} from '../../store/goals';

import {
    fetchUserExerciseEntries, 
    fetchUserExerciseEntry, 
    fetchAllUserExerciseEntries,
    fetchGoalExerciseEntries,
    createExerciseEntry,
    updateExerciseEntry,
    deleteExerciseEntry,
} from '../../store/exerciseEntries';

import {
    fetchUserExercise,
    fetchUserExercises,
    fetchAllUserExercises,
    fetchGoalExercises,
    createExercise,
    updateExercise,
    deleteExercise,
} from '../../store/exercises';


function LandingPage() {
    const dispatch = useDispatch();
    
    window.dispatch = dispatch;
    window.fetchAllUserGoals = fetchAllUserGoals;
    window.fetchUserGoals = fetchUserGoals;
    window.fetchUserGoal = fetchUserGoal;
    window.createGoal = createGoal;
    window.updateGoal = updateGoal;
    window.deleteGoal = deleteGoal;

    window.fetchUserExerciseEntry = fetchUserExerciseEntry;
    window.fetchUserExerciseEntries = fetchUserExerciseEntries;
    window.fetchGoalExerciseEntries = fetchGoalExerciseEntries;
    window.fetchAllUserExerciseEntries = fetchAllUserExerciseEntries;
    window.createExerciseEntry = createExerciseEntry;
    window.updateExerciseEntry = updateExerciseEntry;
    window.deleteExerciseEntry = deleteExerciseEntry;

    window.fetchUserExercise = fetchUserExercise;
    window.fetchUserExercises = fetchUserExercises;
    window.fetchGoalExercises = fetchGoalExercises;
    window.fetchAllUserExercises = fetchAllUserExercises;
    window.createExercise = createExercise;
    window.updateExercise = updateExercise;
    window.deleteExercise = deleteExercise;
    
    const goal = useSelector(getGoal('648a1a1604e5d0d3c703386d'));
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