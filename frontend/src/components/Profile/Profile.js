import GoalIndexItem from '../Goals/GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGoal, fetchUserGoals, getUserKeyGoals } from '../../store/goals'
import { Link } from 'react-router-dom';

import { fetchAllUserExerciseEntries, fetchUserExerciseEntries } from '../../store/exerciseEntries';
import { getUserKeyExerciseEntries } from '../../store/exerciseEntries';

import { sampleExerciseEntries } from './ProfileSeedData';
import ExerciseEntryTile from './ExerciseEntryTile';

import './Profile.css';

function Profile () {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  // const sessionUserId = sessionUser._id;
  const userGoalsObj = useSelector(getUserKeyGoals);
  const userGoals = userGoalsObj[`${sessionUser._id}`];
  
  const userExerciseEntries = useSelector(getUserKeyExerciseEntries);

  


  useEffect(() => {
    dispatch(fetchUserGoals(sessionUser._id))
    dispatch(fetchUserExerciseEntries(sessionUser._id))
  }, [])
  
  const sampleExerciseEntryData = Object.values(sampleExerciseEntries);
  
  const generateEntryTilesForGoal = (goalId, exerciseEntriesArray) => {
    // Filter for the goal
    debugger
    const filteredByGoal = exerciseEntriesArray.filter(exerciseEntry => {
      return exerciseEntry.goalId === goalId;
    })
    // Sort by the date
    debugger
    const sortedByDate = filteredByGoal.toSorted((a, b) => {
      return new Date(a.exerciseEntry.date) - new Date(b.exerciseEntry.date)
    })
    // Generate tiles
    debugger
    const generatedTiles = [];
    sortedByDate.forEach(entry => {
      generatedTiles.push(<ExerciseEntryTile rating={entry.exerciseEntry.rating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/>)
    })
    return generatedTiles;
  };


  const sampleExerciseEntryTiles = generateEntryTilesForGoal(21, sampleExerciseEntryData);

  debugger
  if (!userExerciseEntries) {
    return (
      <div> Loading... </div>
    )
  }

  // console.log(userExerciseEntries)
  
  // Change currentGoal to be the first goal in userGoals from the back without a completedDate,
  // if not found, no currentGoal.
  // const currentGoal = userGoals.slice(-1)[0];
  // const goalItems = userGoals.slice(0,-1).map(goal => <GoalIndexItem goal={goal} />)

  return (
    <div className='profile-container'>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

      {/* DATA VIZ - START */}
      {/* DATA VIZ - START */}
      <div className="profile-container-styles profile-data-vis-container">
        <h2>DATA VIZ</h2>
      </div>
      {/* DATA VIZ - END */}
      {/* DATA VIZ - END */}

      {/* GOAL'S WORKOUT SELECTOR - START */}
      {/* GOAL'S WORKOUT SELECTOR - START */}
      <div className='profile-container-styles profile-goal-workout-content-container'>

        {/* WORKOUT SELECTOR - START */}
        <div className="profile-workout-selector-container workout-component">
          {/* <h2>WORKOUT SELECTOR</h2> */}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
          {sampleExerciseEntryTiles}
        </div>
        {/* WORKOUT SELECTOR - END */}

        {/* STICKY EXERCISE BREAKDOWN - START */}
        <div className="profile-exercise-chart workout-component">
        <h2>EXERCISE CHART</h2>
        </div>
        {/* STICKY EXERCISE BREAKDOWN - END */}

      </div>
      {/* GOAL'S WORKOUT SELECTOR - END */}
      {/* GOAL'S WORKOUT SELECTOR - END */}
      
      <div className='profile-container-styles profile-footer'>
        <h2>FOOTER PLACEHOLDER</h2>
      </div>

    </div>
  )
}

export default Profile;