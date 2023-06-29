import GoalIndexItem from '../Goals/GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGoal, fetchUserGoals } from '../../store/goals'
import { Link } from 'react-router-dom';

import { fetchAllUserExerciseEntries, fetchUserExerciseEntries } from '../../store/exerciseEntries';
import { getUserKeyExerciseEntries } from '../../store/exerciseEntries';

import { sampleExerciseEntries } from './ProfileSeedData';
import ExerciseEntryTile from './ExerciseEntryTile';

import { formatTwoDigitNumberString } from '../../utils/utils';

import './Profile.css';

import DataVis from './DataVis';

function Profile () {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  
  const userExerciseEntries = useSelector(getUserKeyExerciseEntries);

  const [mouseOverTextData, setMouseOverTextData] = useState(undefined);
  const [sampleTileSet, setSampleTileSet] = useState([]);
  const [mouseOverTextDataRows, setMouseOverTextDataRows] = useState([]);
  const [mouseOverDataTotals, setMouseOverDataTotals] = useState({});

  const sampleExerciseEntryData = Object.values(sampleExerciseEntries);

  // let mouseOverTextDataRows;

  const handleMouseEnter = (e) => {
    const tileId = e.currentTarget.getAttribute('dataExerciseEntryId');
    const matchingExerciseEntry = sampleExerciseEntryData.find(exerciseEntry => {
      return exerciseEntry.exerciseEntryId.toString() === tileId
    });
    setMouseOverTextData(matchingExerciseEntry); 

    let totalSets = 0;
    let totalReps = 0;
    let totalTime = 0;

    // BELOW BUG!!! mouseOverTextData will not have updated via above line of code,
    // and read as 'undefined'.
    // setMouseOverTextDataRows(mouseOverTextData?.exerciseEntry?.exercises?.map(exercise => {
    setMouseOverTextDataRows(matchingExerciseEntry?.exerciseEntry?.exercises?.map(exercise => {
      totalSets += exercise.sets
      totalReps += exercise.reps
      totalTime += exercise.time
      return (
        <tr>
          <td>{exercise.name}</td>      
          <td>{exercise.sets}</td>      
          <td>{exercise.reps}</td>      
          <td>{exercise.time}</td>      
        </tr>
      )
    }))
    setMouseOverDataTotals({sets: totalSets, reps: totalReps, time: totalTime})

  }

  const generateEntryTilesForGoal = (goalId, exerciseEntriesArray) => {
    // Filter for the goal
    const filteredByGoal = exerciseEntriesArray.filter(exerciseEntry => {
      return exerciseEntry.goalId === goalId;
    })
    // Sort by the date
    const sortedByDate = filteredByGoal.toSorted((a, b) => {
      return new Date(a.exerciseEntry.date) - new Date(b.exerciseEntry.date)
    })

    // Generate tiles
    const generatedTiles = [];

    // Create 23 fake sets of same seed data:
    for(let i = 0; i < 23; i++){

      sortedByDate.forEach(entry => {
        
          // Seed only: generate random ratings and associated photos:
          const displayedRating = Math.floor(Math.random() * 5) + 1;
          const numSamplePhotos = 7;
          const randomImageNumber = Math.floor(Math.random() * numSamplePhotos) + 1;
          const twoDigitRandomImageNumber = formatTwoDigitNumberString(randomImageNumber)

          const tile = <>
            <div onMouseEnter={handleMouseEnter} dataExerciseEntryId={entry.exerciseEntryId} >
              {/* NON sample dataset might look more like this: */}
              {/* <ExerciseEntryTile photoNum={twoDigitRandomImageNumber} rating={entry.exerciseEntry.rating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/> */}
              <ExerciseEntryTile photoNum={twoDigitRandomImageNumber} rating={displayedRating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/>
            </div>
          </>

          generatedTiles.push(tile)
        
      })
    }
    return generatedTiles;
  };

  useEffect(() => {
    dispatch(fetchUserGoals(sessionUser._id))
    dispatch(fetchUserExerciseEntries(sessionUser._id))

    // random scramble effect
    let repeats = 0;
    let interval = setInterval(() => {
      repeats += 1;
      if(repeats === 5) clearInterval(interval)
      setSampleTileSet(generateEntryTilesForGoal(21, sampleExerciseEntryData));
      
    }, 100)

    // Here is where we can actually render actual state
    setSampleTileSet(generateEntryTilesForGoal(21, sampleExerciseEntryData));
  }, [])

  if (!userExerciseEntries) {
    return (
      <div> Loading... </div>
    )
  }
  
  return (
    <div className='profile-container'>

      {/* DATA VIZ - START */}
      {/* DATA VIZ - START */}
      <div className="progress-title">
        <h2>my progress...</h2>
      </div>

      <div className="data-vis">
        <DataVis />
      </div>

      {/* DATA VIZ - END */}
      {/* DATA VIZ - END */}

      {/* GOAL'S WORKOUT SELECTOR - START */}
      {/* GOAL'S WORKOUT SELECTOR - START */}
      <div className='profile-container-styles profile-goal-workout-content-container'>

        {/* WORKOUT SELECTOR - START */}
        {/* WORKOUT SELECTOR - START */}
        <div className="profile-workout-selector-container workout-component">
          {sampleTileSet}
        </div>
        {/* WORKOUT SELECTOR - END */}
        {/* WORKOUT SELECTOR - END */}

        {/* STICKY EXERCISE BREAKDOWN - START */}
        {/* STICKY EXERCISE BREAKDOWN - START */}
        <div className="profile-exercise-chart workout-component">
          <div className='exercise-entry-deets'>
            <div className='exercise-entry-deets-header'>
              <span>{mouseOverTextData ? mouseOverTextData?.exerciseEntry?.date : ""}</span>
              <span>{mouseOverTextData ? `${mouseOverTextData?.exerciseEntry?.rating}/5` : ""}</span>
            </div>
            <span className='exercise-entry-deets-note'>{mouseOverTextData?.exerciseEntry?.note}</span>
          </div>
          <div className='chart-div'></div>
          <table className='exercise-chart-table'>
            <thead>
              <tr className='exercise-chart-header-row'>
                <th>Name</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {mouseOverTextDataRows}
              
            </tbody>
            <tfoot>
              <tr>
                <th>Totals</th>
                <td>{mouseOverDataTotals.sets}</td>
                <td>{mouseOverDataTotals.reps}</td>
                <td>{mouseOverDataTotals.time}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* STICKY EXERCISE BREAKDOWN - END */}
        {/* STICKY EXERCISE BREAKDOWN - END */}

      </div>
      {/* GOAL'S WORKOUT SELECTOR - END */}
      {/* GOAL'S WORKOUT SELECTOR - END */}
      

    </div>
  )
}

export default Profile;