import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import { AuthContext } from '../Context/AuthContext';


export default function TheZone(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    const path = ' /zone/display/' + authContext.user.username + '/' + postId;
    const [username, setUsername] = useState('');
    const [likes, setLikes] = useState(0);
    const [acs, setAcs] = useState(0);
    const [content, setContent] = useState('');
    const [agree, setAgree] = useState(false);
    const [disagree, setDisagree] = useState(false);


    useEffect(() => {
        fetch(path).then(res => res.json())
            .then(data => {
                setUsername(data.posts.poster.username);
                setAcs(data.posts.poster.acs);
                setLikes(data.posts.likes);
                setContent(data.posts.body);
                setAgree(data.posts.upvoted);
                setDisagree(data.posts.downvoted);

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
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            //axios.post('http://localhost:5000/post/add', body)
            .then(data => {
                setAgree(data.upvoted);
                setDisagree(data.downvoted);
                setLikes(data.likes);
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
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
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

    


    return (
        <div class="tzone-page">
            <div class= "tzone-all-posts"> 
                <div class="tzone-post-body">   
                    <input type="text" class="tzone-creat-post" placeholder="Create Post"></input>

                </div>
            </div>

            
        </div>
    )
}

