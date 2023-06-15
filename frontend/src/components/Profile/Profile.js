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

import DataVis from './DataVis';

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
    // debugger 
    const filteredByGoal = exerciseEntriesArray.filter(exerciseEntry => {
      return exerciseEntry.goalId === goalId;
    })
    // Sort by the date
    // debugger
    const sortedByDate = filteredByGoal.toSorted((a, b) => {
      return new Date(a.exerciseEntry.date) - new Date(b.exerciseEntry.date)
    })
    // Generate tiles
    // debugger
    const generatedTiles = [];
    sortedByDate.forEach(entry => {
      generatedTiles.push(<ExerciseEntryTile rating={entry.exerciseEntry.rating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/>)
    })
    return generatedTiles;
  };


  const sampleExerciseEntryTiles = generateEntryTilesForGoal(21, sampleExerciseEntryData);

  // debugger
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

      {/* DATA VIZ - START */}
      {/* DATA VIZ - START */}

      <div className="data-vis">
        <DataVis />
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