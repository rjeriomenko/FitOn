import "./FeedPostBlock.css"

function FeedPostBlock ({ feedPost: { text, author }}) {
  const { username } = author;
  return (
    <div className="feedPostBlock">
      <h3>{username}</h3>
      <p>{text}</p>
    </div>
  );
}

export default FeedPostBlock;