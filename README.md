# [Goal Getters](https://goal-getters.onrender.com/)
![Splash Page](splash.gif)

# Background & Overview

A healthy lifestyle is difficult to navigate. It is challenging to realize one's own fitness goals. Consistency is the foundation of fitness success. As social beings, exercising with others can be very motivating. Goal Getters provides a social platform for users to work alongside each other as they carve out their best selves. 

We recognize that it is rewarding to give and receive support. Goal Getters strives to build a community centered around promoting accountability and support between its users. Goal Getters allows users to create and share goals, along with the progress they've made to reach those goals. 

Goal Getters provides tools for users to view their progress. Two distinct graphs are populated on a user's stats page as a user logs workouts. Those same workouts will populate other users' feeds. 

# Functionality & MVP
    - Goals: Users can create/set goals and track progress toward goals with different categories (e.g. strength, weight loss)
         - Users can document/track their progress through routine milestones and document with photos (optional)
         - Visualization of quantitative data (each exercise event is a data point) 

    - Exercise Events:
        - duration, which routine was completed, (optional) photo, (optional) user comment/description
    
    - Feed:
        - Subscription/follow-based 
        - Index of followed-users' routines and goal updates (completing or *CREATING* a goal)

## Data Visualization
![Dynamic Stacked Bar Graph](dataVis.gif)
-
Once users have logged their workouts, they can view progress towards their current goals. A user's exercises are visualized on a stacked bar graph. Users can toggle the graph's Y-Axis with a switch.                  

``` js
    // fetches data
    const data = await fetchExerciseEntry();
    const dates = Object.keys(data);
    dates.sort((a,b) => new Date(a) - new Date(b));

    // finds unique exercises by flattening dates
    const exercises = Array.from(
      new Set(dates.flatMap(date => Object.keys(data[date])))
    );
    
    // creates datasets by matching date to exercise 
    const datasets = exercises.map(exercise => {
      const dataset = {
        label: exercise,
        data: dates.map(date => data[date][exercise] || 0),
        backgroundColor: generateRandomColor()
      };

      return dataset;
    });
```
The dataset is generated from exercises that are stratified by name and date.

``` js
    // creating chart
    const chartElement = chartRef.current;
    const newChart = new Chart(chartElement, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
```
The graph is created with Chart.js.

![Calendar Graph](calendarGraph.gif)
-
A user's workouts populate a dynamic calendar graph. The rating of each workout determines its color, allowing a user to easily see which workouts a user liked best. The graph displays details about each day's workout and logged exercises.

``` js
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
      const tile =
        <div 
            onClick={() => setFreezeCalendar(freeze => !freeze)} 
            onMouseEnter={handleMouseEnter} 
            key={workout._id} 
            workoutid={workout._id}
        >
            <ExerciseEntryTile 
                workout={workout} 
                frozen={freezeCalendar}
            />
        </div>
      generatedTiles.push(tile)
    })
    return generatedTiles;
};
```
The calendar tiles are generated from a user's workouts. 

``` js 
const animateOnce = (e) => {
    if (!frozen) {
        const workoutContainer = e.currentTarget;
        const workoutImg = workoutContainer.querySelector(".tile-background");
        const overlay = workoutContainer.querySelector(".tile-rating-overlay");
        workoutContainer.classList.add("tile-container-hover");
        workoutImg.classList.add("tile-img-hover");
        overlay.classList.add("tile-active-overlay")
    }
}
```
The tiles are animated with CSS and JavaScript.

## Follows
Users can follow and unfollow other users to see progress updates on the feed. 

## Exercises
![Fuzzy Search](fuzzy.gif)
-
Fuse.js is leveraged to standardize exercise names. 

``` js
const handleFuzzyChange = (value, index) => {
        const results = fuse.search(value);

        if (results.length > 0) {
            const matchedExercise = results[0].item.exercise;
            const updatedInputs = exerciseInputs.map((input, i) => {
                if (i === index) {
                    return { ...input, name: matchedExercise };
                }
                return input;
            });
            setExerciseInputs(updatedInputs);
        }

        setFuzzyResults(results);
        
    };
```
When users log their workouts, they also log their exercises.

## Future Feature Implementation
In the future, users will be able to like and comment on posts.

# Technologies & Technical Challenges
## Technologies 
- MongoDB (Atlas) 
- Passport
- Express
- React 
- Redux
- JavaScript 
- AWS 
- Node.js
- Chart.js
- Fuse.js

## Technical Challenges
- Implementing interactive feed
- Limiting fetch request without over-embedding
- Visualizing workouts concisely 

# Group Members & Work Breakdown
## Group Members: 
- Team Lead: [Rokas Jeriomenko](https://github.com/rjeriomenko)
- Frontend Lead: [Carvey Hor](https://github.com/carveyh)
- Backend Lead: [Sam Oh](https://github.com/ohksam)
- Flex Lead: [Michele Zhang](https://github.com/mzhanggg)


## Monday, 6/12
- Setup backend user auth - Sam Oh
- Setup frontend user auth - Carvey Hor 
- Build signup/login pages - Rokas Jeriomenko
- Build splash page - Michele Zhang

## Tuesday, 6/13
- Setup backend API routes - Sam Oh
- Build routine creator - Carvey Hor, Michele Zhang, Rokas Jeriomenko, Sam Oh
- Build homepage/feed - Carvey Hor, Michele Zhang, Rokas Jeriomenko, Sam Oh

## Wednesday, 6/14
- Setup/configure AWS - Sam Oh
- Build goal creator - Carvey Hor, Michele Zhang
- Build exercise event creator - Rokas Jeriomenko, Sam Oh

## Thursday, 6/15
- Polish and debug - Carvey Hor, Michele Zhang, Rokas Jeriomenko, Sam Oh
- Build about page - Carvey Hor, Michele Zhang
- Implement likes/comments (time permitting) - Rokas Jeriomenko, Sam Oh


