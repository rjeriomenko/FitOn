import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeedPostErrors, createFeedPost } from '../../store/feedPosts';
import FeedPostBlock from './FeedPostBlock';
import FeedPostEditable from './FeedPostEditable';
import './GoalCreate.css';

function GoalCreate () {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);
  const newFeedPost = useSelector(state => state.feedPosts.new);
  const errors = useSelector(state => state.errors.feedPosts);

  useEffect(() => {
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createFeedPost({ text })); 
    setText('');
  };

  const update = e => setText(e.currentTarget.value);

  return (
    <>
      <form className="create-feed-post" onSubmit={handleSubmit}>
        <input 
          type="textarea"
          value={text}
          onChange={update}
          placeholder="Write your Feed Post..."
          required
        />
        <div className="errors">{errors?.text}</div>
        <input type="submit" value="Submit" />
      </form>
      <div className="feed-post-preview">
        <h3>Feed Post Preview</h3>
        {/* {text ? <FeedPostBlock feedPost={{text, author}} /> : undefined} */}
        {text ? <FeedPostEditable feedPost={{text, setText, author}} /> : undefined}
      </div>
      <div className="previous-feed-post">
        <h3>Previous Feed Post</h3>
        {/* {newFeedPost ? <FeedPostBlock feedPost={newFeedPost} /> : undefined} */}
        {newFeedPost ? <FeedPostEditable feedPost={newFeedPost} /> : undefined}
      </div>
    </>
  )
}

export default GoalCreate;