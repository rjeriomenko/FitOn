import "./FeedPostEditable.css"
import { useState } from "react";

function FeedPostEditable ({ feedPost: { text, setText, author }}) {
  const { username } = author;
	// const [description, setDescription] = useState('');
	const [editable, setEditable] = useState(false);

	const textarea = document.getElementById("feed-post-text-edit");

	const handleTextChange = e => {
		setText(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
		
	}
	// textarea.addEventListener("input", function (e) {
	// 	this.style.height = "auto";
	// 	this.style.height = this.scrollHeight + "px";

  return (
		<div className="feedPostBlock feed-post-editable-container">
			<div className="feed-post-content">
				<h3>{username}</h3>
				{!editable && <p>{text}</p>}
				{editable && <>
					<textarea id="feed-post-text-edit"
						// oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
						// type="textarea"
						contentEditable={true}
						value={text}
						// onChange={e => setText(e.target.value)}
						onChange={handleTextChange}
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