const TestProps = (props) => {
	const delayedText = () => {
		setTimeout(() => {
			console.log("hi")
			return "hi"
		}, 2000)
	}
	return (
		<div>
			{/* This should re-render if props changes...? {props.testPropNum} */}
			This should re-render if props changes...? {delayedText()}
		</div>
	)
}

export default TestProps;