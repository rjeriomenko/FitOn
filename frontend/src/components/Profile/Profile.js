import GoalIndexItem from '../Goals/GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGoal, fetchUserGoals, getUserKeyGoals } from '../../store/goals'
import { Link } from 'react-router-dom';

import { fetchAllUserExerciseEntries, fetchUserExerciseEntries } from '../../store/exerciseEntries';
import { getUserKeyExerciseEntries } from '../../store/exerciseEntries';

import { sampleExerciseEntries } from './ProfileSeedData';
import ExerciseEntryTile from './ExerciseEntryTile';

import { formatTwoDigitNumberString } from '../../utils/utils';

import './Profile.css';

function Profile () {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  // const userGoalsObj = useSelector(getUserKeyGoals);
  // const userGoals = userGoalsObj[`${sessionUser._id}`];
  
  const userExerciseEntries = useSelector(getUserKeyExerciseEntries);

  const [mouseOverText, setMouseOverText] = useState('');
  const [sampleTileSet, setSampleTileSet] = useState([]);

  const sampleExerciseEntryData = Object.values(sampleExerciseEntries);

  const handleMouseEnter = (e) => {
    const tileId = e.currentTarget.getAttribute('dataExerciseEntryId');
    const matchingExerciseEntry = sampleExerciseEntryData.find(exerciseEntry => {
      return exerciseEntry.exerciseEntryId.toString() === tileId
    });
    setMouseOverText(matchingExerciseEntry.exerciseEntry.note);
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
    setSampleTileSet(generateEntryTilesForGoal(21, sampleExerciseEntryData));
  }, [])

  if (!userExerciseEntries) {
    return (
      <div> Loading... </div>
    )
  }

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
        {/* WORKOUT SELECTOR - START */}
        <div className="profile-workout-selector-container workout-component">
          {sampleTileSet}
        </div>
        {/* WORKOUT SELECTOR - END */}
        {/* WORKOUT SELECTOR - END */}

        {/* STICKY EXERCISE BREAKDOWN - START */}
        {/* STICKY EXERCISE BREAKDOWN - START */}
        <div className="profile-exercise-chart workout-component">
        <h4>Date Note Rating</h4>
        <h5>Name Sets Reps Time</h5>
        <h5>{mouseOverText}</h5>







        </div>
        {/* STICKY EXERCISE BREAKDOWN - END */}
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