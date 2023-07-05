import './LandingPage.css';
import { useEffect, useState } from 'react';

const LandingGifContainer = () => {
	// let imgName = "narutoirl";
  const imgNames = ["narutoirl", "swim", "warmup", "narutoirl", "dekupushup", "bicyclecrunch", "jogging", "narutoirl", "tyingshoes", "yoga"]

	// let counter = 1
  // let bgInterval = setInterval(() => {
  //   counter += 1;
  //   console.log(counter)
  //   imgName = imgNames[counter % imgNames.length];
  // }, 3000)

	// let counter = 1
	const [counter, setCounter] = useState(1);
	const [imgName, setImgName] = useState("narutoirl");

	useEffect(() => {
		const bgInterval = setInterval(() => {
			setCounter(oldCount => oldCount + 1);
			console.log(counter)
			setImgName(imgNames[counter % imgNames.length]);
		}, 4000)

    // cleanup function
    return () => clearInterval(bgInterval);
	}, [counter])

	return (
		<img className="landing-gif" src={require(`../../images/${imgName}.gif`)}/>
	)
}

export default LandingGifContainer;