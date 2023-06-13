import "./FeedPostEditable.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
// import { Link } from "react-router-dom";

function FeedPostEditable ({feedPost, type}) {
  const { text, author } = feedPost;
  const { username } = author;
	const [content, setContent] = useState(text);
	const [editable, setEditable] = useState(false);
	const loggedIn = useSelector(state => !!state.session.user);
	// need logic for if sessionUser === post's author


	const handleContentChange = e => {
		setContent(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	}

	switch(type){
		case POST_TYPE_EXERCISE_ENTRY:
			break;
		case POST_TYPE_GOAL:
			break;
		default: 
			break;
	}

  return (
		<div className="feedPostBlock feed-post-editable-container">
			<div className="feed-post-content">
				<div className="feed-post-heading">
					<div>{username}</div>
					<div>Jun 10</div>
				</div>
				<br/>
				{!editable && <p>{content}</p>}
				{/* need logic check sessionUser === post's author */}
				{editable && <>
					<textarea id="feed-post-text-edit"
						contentEditable={true}
						value={content}
						onChange={handleContentChange}
					/>
					<div className="feed-post-crud-button" onClick={e => setEditable(false)}>Update</div>
				</>}
			</div>
			<div className="feed-post-crud-controls">
				<div className="feed-post-crud-button" onClick={e => setEditable(true)}>
					Update
				</div>
				<div className="feed-post-crud-button">Delete</div>
			</div>
		</div>
  );
}

export default FeedPostEditable;