import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeedPostErrors, fetchFeedPosts } from '../../store/feedPosts';
import FeedPostBlock from './FeedPostBlock';

function FeedPosts () {
  const dispatch = useDispatch();
  const feedPosts = useSelector(state => Object.values(state.feedPosts.all));
  
  useEffect(() => {
    dispatch(fetchFeedPosts());
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  if (feedPosts.length === 0) return <div>There are no Feed Posts</div>;
  
  return (
    <>
      <h2>All FeedPosts</h2>
      {feedPosts.map(feedPost => (
        <FeedPostBlock key={feedPost._id} feedPost={feedPost} />
      ))}
    </>
  );
}

export default FeedPosts;