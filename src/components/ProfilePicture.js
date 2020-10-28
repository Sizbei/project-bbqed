import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../styling/ProfilePicture.css';

// Renders a profile picture with the sportcred logo around it
// As props, give EITHER a username or a url
// 
// Optionally, provide a scale number to scale the entire result.
// Default: 1.0, which is the size of the profile picture in the header.
//
// Optionally, provide an onclick handler to fire when the user clicks the image
export default function ProfilePicture(props) {
  const urlExists = "url" in props;
  const usernameExists = "username" in props;
  const username = "username" in props ? props.username : "";
  const scale = "scale" in props ? props.scale : 1.0;

  const [url, setUrl] = useState(urlExists ? props.url : "");

  useEffect(() => {
    if (urlExists) {
      setUrl(props.url);
    } else {
      if (!usernameExists) {
        console.log("ERROR! Must provide one of username or url to ProfilePicture.js")
        return;
      }

      fetch("/profile/" + username).then(res => res.json())
          .then(data => {
            console.log("got", data.image);
            setUrl(data.image);
          })
          .catch((error) => {
            console.log(error);
          })
    }
  }, [urlExists, username, url])

  const ppDivStyle = {
    height: scale * 100 + "px",
    width: scale * 100 + "px",
  }

  const ppPhotoStyle = {
    marginLeft: scale * 17 + "px",
    marginTop: scale * 20 + "px",
    height: scale * 60 + "px",
    width: scale * 60 + "px",
  }

  return (
    <div className="pp-div" style={ppDivStyle}>
      <img src={url} key={url} className="pp-photo" alt="" style={ppPhotoStyle} />
    </div>
  )
}