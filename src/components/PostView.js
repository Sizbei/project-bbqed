import React, {useState,  useEffect, Component} from "react"
import ProfilePicture from './ProfilePicture'
import '../styling/PostView.css'


export default function View() {
    
    const [username, setUsername] = useState('user3'); 
    const [acs, setAcs] = useState(0); 
    const [content, setContent] = useState('testing123'); 
    const [agree, setAgree] = useState(false); 
    const [disagree, setDisagree] = useState(false); 
    const [comments, setComments] = useState([
        {username: 'user4', comment: 'blah blah', acs: 23}, 
        {username: 'user2', comment: 'blah blah1', acs: 22}, 
        {username: 'user1', comment: 'blah blah2', acs: 3}, 
    ]); 
    useEffect(() => {
        
      }, [])

    const handlePostAgree = () => {

        setAgree(!agree);
    }
    const handlePostDisagree = () => { 

    }

    const handleCommentAgree = () => {

    }
    const handleCommentDisagree = () => { 

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
            </div>
        </div>
        <div className="tzpv-post-buttons"> 
            <button onClick={handlePostAgree} className={agree ? "tzpv-post-button-agree-selected" :"tzpv-post-button-agree" }>   Agree  </button>
            <button onClick={handlePostDisagree} className={disagree? "tzpv-post-button-disagree-selected" : "tzpv-post-button-disagree" }> Disagree </button>
        </div>
        <div className="tzpv-post-comment-container">
            <input type="text"/>
            <button> Post Comment </button> 
        </div>
        <div className="tzpv-comments-container"> 
            {comments.map(data => {
                return (
                    <div className="tzpv-comment-container">
                        <div className="tzpv-profile">
                            <label> {data.username} ({data.acs})</label>
                            <ProfilePicture scale={0.8} username={data.username}/>
                            <div>
                                <a> Agree </a>
                                <a> Disagree </a>
                            </div>      
                        </div>
                        {data.comment}

                    </div>
                )
            })}
        </div>
      </div>
  </div>
  )
}