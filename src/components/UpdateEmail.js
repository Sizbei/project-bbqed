import React, { Component, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext';

import '../styling/Settings.css';

// https://stackoverflow.com/questions/52188192/what-is-the-simplest-and-shortest-way-for-validating-an-email-in-react
function validateEmail (email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}

export default function Popup(props) {

  const [formState, setFormState] = useState("button");
  const { register, handleSubmit, watch, errors } = useForm();
  const[verifyPass, setPassState] = useState(null);
  const[verifyEmail, setEmailState] = useState(null);
  const[verifyEmailSame, setEmailSameState] = useState(null);

  const handleChangeEmail = props.handleChangeEmail;

  const authContext = useContext(AuthContext);

  const submitForm = async data => {

    fetch('/settings/account/verifypass/' + authContext.user.username + '/' + data.password).then(res => res.json())
    .then(res => {
        setPassState(res.verified);

        fetch('/settings/account/verifyemail/' + authContext.user.username + '/' + data.email).then(res => res.json())
        .then(async res => {
            setEmailState(res.verified)
            if(!validateEmail(data.email)){
              setEmailState(false);
            }

            await setEmailSameState(data.email === data.confirmEmail);

            const updatedInfo = {
              username: authContext.user.username,
              email: data.email,
            }
        
            console.log(verifyPass, verifyEmail, verifyEmailSame)
        
            if(verifyPass && verifyEmail && verifyEmailSame){
        
              fetch('/settings/account/update/email', {
                method :  "put",
                body : JSON.stringify(updatedInfo),
                headers: {
                    'Content-Type' : 'application/json'
                }
              }).then(res => res.json())
              .then(res => handleChangeEmail(updatedInfo.email))
              .catch((error) => {
                console.log(error);
              })
        
              setFormState("button")
        
            }

        }
      );

    }
  );


  }

  if (formState === "button") {
    return <button className="settings-submit alignRight" onClick={() => {setFormState("update"); setPassState(null); setEmailState(null); setEmailSameState(null);}}>Update</button>;
  } else if (formState === "update") {
    return (
      <div>

        <div className='popup-out' onClick={() => {setFormState("button"); setPassState(true); setEmailState(true); setEmailSameState(true);}}>

          <div className='popup-in' onClick = {(e) => { e.stopPropagation(); }}>

            <h2 className="settings-h2">Update your email</h2>
            <hr className="settings-hr"></hr>

            <form className="form" onSubmit={handleSubmit(submitForm)}>
              <input type="password" name="password" placeholder="CURRENT PASSWORD" autoComplete="off" className="current-password pop-input" ref={register({required: true })} maxLength="30" required></input>
              {(verifyPass == false) ? <span className="warning">Incorrect password</span> : null}
              <input type="text" name="email" placeholder="NEW EMAIL" autoComplete="off" className="new-email pop-input" ref={register({required: true})} maxLength="30" required></input>
              {(verifyEmail == false) ? <span className="warning">Please Enter a valid email address</span> : null}
              <input type="text" name="confirmEmail" placeholder="CONFIRM EMAIL" autoComplete="off" className="new-email pop-input" ref={register({required: true})} maxLength="30" required></input>
              {(verifyEmailSame == false) ? <span className="warning">Emails do not match</span> : null}

              <input type="submit" className="submit" value="Save" /> 

            </form>


          </div>

        </div>
      </div>      
      
    );
  }

}