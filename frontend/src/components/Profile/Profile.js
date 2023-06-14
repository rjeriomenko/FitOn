import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFeedPosts, clearFeedPostErrors } from '../../store/feedPosts';

function Profile () {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const userFeedPosts = useSelector(state => Object.values(state.feedPosts.user))
  
  useEffect(() => {
    dispatch(fetchUserFeedPosts(currentUser._id));
    return () => dispatch(clearFeedPostErrors());
  }, [currentUser, dispatch]);

  if (userFeedPosts.length === 0) {
    return <div>{currentUser.username} has no FeedPosts</div>;
  } else {
    return (
      <>
        <h2>All of {currentUser.username}'s FeedPosts</h2>
        {/* {userFeedPosts.map(feedPost => (
          <FeedPostBlock key={feedPost._id} feedPost={feedPost} />
        ))} */}
      </>
    );
  }
}

export default Profile;