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

function LandingPage() {
    const dispatch = useDispatch();
    
    window.dispatch = dispatch;
    window.fetchAllUserGoals = fetchAllUserGoals;
    window.fetchUserGoals = fetchUserGoals;
    window.fetchUserGoal = fetchUserGoal;
    window.createGoal = createGoal;
    window.updateGoal = updateGoal;
    window.deleteGoal = deleteGoal;
    
    const newGoal = useSelector(getNewGoal);

    useEffect(() => {
        dispatch(createGoal('64875c1e2a098afd82dbc9f6', {
                completionDate: 'kek',
                deadline: 'kek',
                description: 'kek',
                title: 'kek'
        }));
    }, [])
    console.log(newGoal)
    
    return (
        <>
            {console.log('TEST COMPONENT ENABLED')}
        </>
    );
}

export default LandingPage;