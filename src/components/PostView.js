import React, {useState,  useEffect, useContext} from "react"
import ProfilePicture from './ProfilePicture'
import '../styling/PostView.css'
import {AuthContext} from '../Context/AuthContext';
/*
 {username: 'user4', comment: 'blah blah', acs: 23}, 
        {username: 'user2', comment: 'blah blah1', acs: 22}, 
        {username: 'user1', comment: 'blah blah2', acs: 3}, 
        */
export default function View(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    const path = ' /zone/display/' + authContext.user.username + '/' + postId ;
    const [commentBody, setCommentBody] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [likes, setLikes] = useState(0); 
    const [acs, setAcs] = useState(0); 
    const [content, setContent] = useState(''); 
    const [agree, setAgree] = useState(false); 
    const [disagree, setDisagree] = useState(false); 
    const [comments, setComments] = useState([]); 

    useEffect(() => {
      
        fetch(path).then(res => res.json())
        .then(data => {
          console.log("Data: " + data.posts.poster);
          setUsername(data.posts.poster.username); 
          setAcs(data.posts.poster.acs); 
          setLikes(data.posts.likes); 
          setContent(data.posts.body); 
          setAgree(data.posts.upvoted); 
          setDisagree(data.posts.downvoted); 
          setComments(data.posts.comments); 
          console.log(agree); 
          console.log(disagree); 
        })
        .catch((error) => {
          console.log(error); 
        })
        
      }, [])
    
    const handlePostAgree = () => {
        
        const body = {
          post: postId, 
          username: authContext.user.username, 
          upvoted: agree, 
          downvoted: disagree, 
        }
        fetch('/zone/upvote', {
          method :  "put",
          body : JSON.stringify(body),
          headers: {
              'Content-Type' : 'application/json'
          }
        }).then(res => res.json())
        //axios.post('http://localhost:5000/post/add', body)
        .then(data => {
          setAgree(data.upvoted);
          setDisagree(data.downvoted); 
          setLikes(data.likes); 
          console.log(data.likes);
        }) 
        .catch((error) => {
          console.log(error);
        })  
        
        
    }
    const handlePostDisagree = () => {
      
      const body = {
        post: postId, 
        username: authContext.user.username, 
        upvoted: agree, 
        downvoted: disagree, 
      }
      fetch('/zone/downvote', {
        method :  "put",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(data => {
        setDisagree(data.downvoted); 
        setAgree(data.upvoted);
        setLikes(data.likes); 
      }) 
      .catch((error) => {
        console.log(error);
      })  
    }

    const handleCommentAgree = () => {
      
    }
    const handleCommentDisagree = () => { 
      
    }
    const handleChangeCommentBody = (e) => {
      setCommentBody(e.target.value); 
    }
    const handleAddComment = () => { 
      const body = {
        post: postId, 
        commenter: authContext.user.username, 
        body: commentBody,
      }
      fetch('/zone/addComment', {
        method :  "post",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(data => {
        window.location.reload(); 
      }) 
      .catch((error) => {
        console.log(error);
      })
    }
  return (
  <div className="tzpv-background">
      <div className="tzpv-container">
        <div className="tzpv-post-container">
            <div className="tzpv-user-info">
                <ProfilePicture username = {username}/>
                <label> {username} ({acs})  </label>

            </div>
            <div className="tzpv-post-info"> 
            <p> {content} </p>
            <label> {likes} </label>
            </div>
        </div>
        <div className="tzpv-post-buttons"> 
            <button onClick={handlePostAgree} className={agree ? "tzpv-post-button-agree-selected" :"tzpv-post-button-agree" }>   Agree  </button>
            <button onClick={handlePostDisagree} className={disagree? "tzpv-post-button-disagree-selected" : "tzpv-post-button-disagree" }> Disagree </button>
        </div>
        <div className="tzpv-post-comment-container">
            <input type="text" name="comment-body" onChange={handleChangeCommentBody}/>
            <button onClick={handleAddComment}> Post Comment </button> 
        </div>
        <div className="tzpv-comments-container"> 
            {comments.map(data => {
                return (
                    <div className="tzpv-comment-container">
                        <div className="tzpv-profile">
                            <label> {data.commenter.username} ({data.commenter.acs})</label>
                            <ProfilePicture scale={0.8} username={data.commenter.username}/>
                            <div>
                                <a> Agree </a>
                                <a> Disagree </a>
                            </div>      
                        </div>
                        <label>{data.body}</label>
                        <label>{data.likes}</label>

                    </div>
                )
            })}
        </div>
      </div>
  </div>
  )
}