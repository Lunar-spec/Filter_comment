import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const apiUrl = 'https://jsonplaceholder.typicode.com/comments?_limit=100';

const App = () => {
  const [comments, setComments] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postIdFilter, setPostIdFilter] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => {
        setComments(res.data);
        setFilteredPosts(res.data);
      })
      .catch((error) => {
        console.log('Error in fetching the data', error);
      });
  }, []);

  useEffect(() => {
    const filtered = comments.filter((comment) =>
      comment.postId.toString() === postIdFilter
    );
    setFilteredPosts(filtered);

    if (postIdFilter !== '' && Number(postIdFilter) > 20) {
      setValidationMessage('Post ID should not be greater than 20');
    } else {
      setValidationMessage('');
    }
  }, [comments, postIdFilter]);

  const handlePostClick = (postId) => {
    postId = String(postId);
    setPostIdFilter(postId);
  };

  const renderFirstComments = () => {
    const uniquePosts = Array.from(
      new Set(comments.map((comment) => comment.postId))
    );

    return uniquePosts.map((postId) => {
      const firstComment = comments.find((comment) => comment.postId === postId);

      return (
        <div
          key={postId}
          className={`comment ${postIdFilter === String(postId) ? 'active' : ''}`}
          onClick={() => handlePostClick(postId)}
        >
          <h2>{`Post ${postId}`}</h2>
          <p>{firstComment.body}</p>
        </div>
      );
    });
  };

  return (
    <div className="app">
      <div className="left-panel">
        <div className="filter-container">
          <label htmlFor="postIdFilter">Filter by Post ID: </label>
          <input
            type="text"
            id="postIdFilter"
            value={postIdFilter}
            onChange={(e) => setPostIdFilter(e.target.value)}
            placeholder='Enter a PostId'
          />
        </div>
        {renderFirstComments()}
      </div>
      <div className="right-panel">
        {validationMessage ? (
          <div className="empty-comments">{validationMessage}</div>
        ) : (
          filteredPosts.length === 0 ? (
            <div className="empty-comments">Enter/ Select a Post</div>
          ) : (
            filteredPosts.map((comment) => (
              <div key={comment.id} className="comment">
                <h2>{`Comment ${comment.id}`}</h2>
                <p>{comment.body}</p>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default App;
