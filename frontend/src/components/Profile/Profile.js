import GoalIndexItem from '../Goals/GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteGoal, fetchUserGoals } from '../../store/goals'
import { updateUser, getUser, fetchUser } from '../../store/users';
import { getCurrentUser } from '../../store/session';

import { fetchAllUserExerciseEntries, fetchUserExerciseEntries } from '../../store/exerciseEntries';
import { getUserExerciseEntries } from '../../store/exerciseEntries';

import { sampleExerciseEntries } from './ProfileSeedData';
import ExerciseEntryTile from './ExerciseEntryTile';

import { formatTwoDigitNumberString } from '../../utils/utils';

import './Profile.css';

import DataVis from './DataVis';
import { fetchGoalExercises, fetchUserExercises, getUserKeyExercises } from '../../store/exercises';

function Profile () {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const userId = useParams().userId;
  const user = useSelector(getUser(userId));
  const currentGoal = user?.currentGoal;
  
  
  const userExerciseEntries = useSelector(getUserExerciseEntries);
  // const userExerciseEntriesArray = Object.values(userExerciseEntries);
  // const currentGoalWorkouts = userExerciseEntriesArray.filter(workout => workout.goal._id === currentGoal._id)

  const userWorkoutsAll = Object.values(useSelector(getUserExerciseEntries));
  const userExercisesAll = Object.values(useSelector(getUserKeyExercises));


  const sampleExerciseEntryData = Object.values(sampleExerciseEntries);

  const [mouseOverTextData, setMouseOverTextData] = useState(undefined);
  const [sampleTileSet, setSampleTileSet] = useState([]);
  const [mouseOverTextDataRows, setMouseOverTextDataRows] = useState([]);
  const [mouseOverDataTotals, setMouseOverDataTotals] = useState({});

  const [image, setImage] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('Submit');
  const [freezeCalendar, setFreezeCalendar] = useState(false);


  const [timeGraph, setTimeGraph] = useState(true);
  const goalExercises = useSelector(state => state.exercises.byGoal ? state.exercises.byGoal : {});
  const goalExercisesCount = Object.keys(goalExercises).length;

  // let mouseOverTextDataRows;

  const updateFile = e => setImage(e.target.files[0]);

  const handleSubmit = e => {
    e.preventDefault();
    const inputField = document.getElementById("imageInput")
    if (submitStatus !== 'Submitting...' && inputField.value) {
      const user = {
        image,
        _id: sessionUser._id
      };
  
      setSubmitStatus('Submitting...')
  
      dispatch(updateUser(user))
        .then(() => dispatch(getCurrentUser()))
        .then(() => {
          setSubmitStatus('Submit')
          inputField.value = "";
        });
    }
  }

  const handleMouseEnter = (e) => {
    if(!freezeCalendar) {
      const tileId = e.currentTarget.getAttribute('workoutid');
      const matchingExerciseEntry = userWorkoutsAll.find(workout => {
        return workout._id.toString() === tileId
      });
      setMouseOverTextData(matchingExerciseEntry); 
  
      let totalSets = 0;
      let totalReps = 0;
      let totalWeight = 0;
      let totalTime = 0;


  
      // BELOW BUG!!! mouseOverTextData will not have updated via above line of code,
      // and read as 'undefined'.
      // setMouseOverTextDataRows(mouseOverTextData?.exerciseEntry?.exercises?.map(exercise => {
      setMouseOverTextDataRows(matchingExerciseEntry?.exerciseEntry?.exercises?.map(exercise => {
        totalSets += exercise.sets ? exercise.sets : 0;
        totalReps += exercise.reps ? exercise.reps : 0;
        totalWeight += exercise.weight ? exercise.weight : 0;
        totalTime += exercise.time ? exercise.time : 0;
        return (
          <tr>
            <td>{exercise.name}</td>      
            <td>{exercise.sets ? exercise.sets : 0}</td>      
            <td>{exercise.reps ? exercise.reps : 0}</td>      
            <td>{exercise.weight ? exercise.weight : 0}</td>      
            <td>{exercise.time ? exercise.time : 0}</td>      
          </tr>
        )
      }))
      setMouseOverDataTotals({sets: totalSets, reps: totalReps, weight: totalWeight, time: totalTime})
    }
  }

  const generateEntryTilesForGoal = (goalId, workoutsArray) => {
    // Filter for the goal
    const filteredByGoal = workoutsArray.filter(workout => {
      return workout.goal._id === goalId;
    })
    // Sort by the date
    const sortedByDate = filteredByGoal.toSorted((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })

    // Generate tiles
    const generatedTiles = [];
    
    sortedByDate.forEach((workout, i) => {
      const numSamplePhotos = 7;
      const randomImageNumber = Math.floor(Math.random() * numSamplePhotos) + 1;
      const twoDigitRandomImageNumber = formatTwoDigitNumberString(randomImageNumber)
      const tile =
        <div onClick={() => setFreezeCalendar(freeze => !freeze)} onMouseEnter={handleMouseEnter} key={workout._id} workoutid={workout._id}>
          {/* <ExerciseEntryTile photoNum={twoDigitRandomImageNumber} rating={workout.rating} dateText={workout.date} note={workout.note} exerciseEntry={workout}/> */}
          <ExerciseEntryTile workout={workout}/>
        </div>
      generatedTiles.push(tile)
    })
    return generatedTiles;

    // DEMO ONLY - START
    // DEMO ONLY - START
    // DEMO ONLY - START
    // Create 23 fake sets of same seed data with randomized associated images, 
    // and random ratings (that differ from the sample data's ratings, for color variation appeal)
    // for(let i = 0; i < 23; i++){
    //   const shuffledBase = sortedByDate.sort(() => Math.random() - 0.5)
    //   shuffledBase.slice(0, 3).forEach(entry => {
    //       // RANDOM RATING
    //       // const displayedRating = Math.floor(Math.random() * 5) + 1;
    //       // ACTUAL RATING
    //       const displayedRating = entry?.exerciseEntry.rating;
    //       const numSamplePhotos = 7;
    //       const randomImageNumber = Math.floor(Math.random() * numSamplePhotos) + 1;
    //       const twoDigitRandomImageNumber = formatTwoDigitNumberString(randomImageNumber)
    //       const tile =
    //         // <div onMouseEnter={handleMouseEnter} dataExerciseEntryId={entry.exerciseEntryId} >
    //         <div onMouseEnter={handleMouseEnter} key={entry.exerciseEntryId+`${i}`} dataExerciseEntryId={entry.exerciseEntryId}>
    //           {/* NON sample dataset might look more like this: */}
    //           {/* <ExerciseEntryTile photoNum={twoDigitRandomImageNumber} rating={entry.exerciseEntry.rating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/> */}
    //           <ExerciseEntryTile photoNum={twoDigitRandomImageNumber} rating={displayedRating} dateText={entry.exerciseEntry.date} note={entry.exerciseEntry.note} exerciseEntry={entry}/>
    //         </div>
    //       generatedTiles.push(tile)
    //   })
    // }
    // return generatedTiles;
    // DEMO ONLY - END
    // DEMO ONLY - END
    // DEMO ONLY - END

  };

  const progressTitle = () => {
    if (user && user.username) {
      if (sessionUser._id === userId) {
        return <h4 id="progress-subheader">· my progress ·</h4>;
      } else {
        return <h4 id="progress-subheader">· {user.username}'s progress ·</h4>;
      }
    }
  };
  
  const noExercises = () => {
    if ( goalExercisesCount === 0 && sessionUser._id === userId ) {
      return (
        <>
          <h4 id="progress-subheader">log your workouts to see progress towards greatness</h4>
        </>
      )
    } else if ( goalExercisesCount === 0 && sessionUser._id !== userId) {
      return <h4 id="progress-subheader">no progress towards greatness</h4>
    }
  }

  const displayCurrentGoal = () => {
    if (currentGoal) {
      return (
        <>
          <h3 id="progress-goal-title">{currentGoal.title}</h3>
          {noExercises()}
        </>
      )
    } else if (!currentGoal && sessionUser._id === userId){
      return (
        <>
          <h3 id="progress-goal-title">No Goal to Show</h3>
          <h4 id="progress-subheader">set your goal and see your progress today</h4>
        </>
      )
    } else if (!currentGoal && sessionUser._id !== userId) {
      return <h3 id="progress-goal-title">No Goal Set</h3>
    }
  }

  useEffect(() => {
    dispatch(fetchUser(userId))
    dispatch(fetchUserGoals(userId))
    dispatch(fetchUserExerciseEntries(userId))
    // dispatch(fetchGoalExercises(currentGoal?._id))
    dispatch(fetchUserExercises(userId))

    // // RANDOM SCRAMBLE DEMO DATA IF RANDOM RATING IS ON
    // let repeats = 0;
    // let interval = setInterval(() => {
    //   repeats += 1;
    //   if(repeats === 5) clearInterval(interval)
    //   setSampleTileSet(generateEntryTilesForGoal(21, sampleExerciseEntryData));      
    // }, 100)
    // Here is where we can actually render actual state

    // DEMO
    // setSampleTileSet(generateEntryTilesForGoal(21, sampleExerciseEntryData));
    // NON-DEMO
    // setSampleTileSet(generateEntryTilesForGoal(currentGoal?._id, userExercisesAll));
  }, [])
  
  const tiles = generateEntryTilesForGoal(currentGoal?._id, userWorkoutsAll)
  // setSampleTileSet(tiles)
  // setSampleTileSet(generateEntryTilesForGoal(currentGoal?._id, userExercisesAll));

  if (!userExerciseEntries) {
    return (
      <div> Loading... </div>
    )
  }
  
  return (
    <div className='profile-container'>
      <h3>Update Profile Picture</h3>
      <input type="file" accept=".jpg, .jpeg, .png" id="imageInput" onChange={updateFile} />
      <input className="profile-submit" type="submit" value={submitStatus} onClick={handleSubmit} />

      {/* DATA VIZ - START */}
      {/* DATA VIZ - START */}
      <div className="progress-header">
        {progressTitle()}
        {displayCurrentGoal()}
      </div>

      <div className="data-vis-container">
        <div className="toggle-container">
          <label className="toggle-graph">
            <input type="checkbox" onClick={() => {setTimeGraph(timeGraph ? false : true)}}/>
            <span className="slider-graph"></span>
            <span className="slider-labels" data-on="SETS/REPS" data-off="TIME"></span>
          </label>
        </div>
      
        <div className="data-vis">
          { user && <DataVis user={user} timeGraph={timeGraph}/> }
        </div>
      </div>
      
      <div className="profile-line"></div>

      {/* DATA VIZ - END */}
      {/* DATA VIZ - END */}

      {/* GOAL'S WORKOUT SELECTOR - START */}
      {/* GOAL'S WORKOUT SELECTOR - START */}
      <div className='profile-container-styles profile-goal-workout-content-container'>

        {/* WORKOUT SELECTOR - START */}
        {/* WORKOUT SELECTOR - START */}
        <div className="profile-workout-selector-container workout-component">
          {/* {sampleTileSet} */}
          {tiles}
        </div>
        {/* WORKOUT SELECTOR - END */}
        {/* WORKOUT SELECTOR - END */}

        {/* STICKY EXERCISE BREAKDOWN - START */}
        {/* STICKY EXERCISE BREAKDOWN - START */}
        <div className="profile-exercise-chart workout-component">
          <div className='exercise-entry-deets'>
            <div className='exercise-entry-deets-header'>
              <span>{mouseOverTextData ? new Date(mouseOverTextData.date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric" }) : ""}</span>
              <span>{mouseOverTextData ? `${mouseOverTextData?.rating}/5` : ""}</span>
            </div>
            <span className='exercise-entry-deets-note'>{mouseOverTextData?.note}</span>
          </div>
          <div className='chart-div'></div>
          <table className='exercise-chart-table'>
            <thead>
              <tr className='exercise-chart-header-row'>
                <th>Name</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
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
                <td>{mouseOverDataTotals.weight}</td>
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