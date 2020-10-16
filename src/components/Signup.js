import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import Header from './Header';
import Registration from './Registration'
import logo from '../res/SportCredLogo.png';

import '../styling/Signup.css';

function ErrorMessage(props) {
  const flag = props.flag;
  const text = props.text;

  if (flag) {
    return <span className="error-message"> {text} </span>;
  } else {
    return null;
  }
} 


export default function Popup() {
  const [formState, setFormState] = useState("button");
  const { register, handleSubmit, watch, errors } = useForm();
  const [emailExists, setEmailExists] = useState(false)
  let history = useHistory();

  const RedirectToSignIn = () => {
    setFormState("button");
    history.push("/registration");
  } 

  
  const onSubmit = async data => {
    console.log(data);
  };

  const checkEmailExists = async (email) => {
    const send = {
      params: {
        email: email
      }
    }
    
    const returnValue = await axios.get('http://localhost:5000/signup/existingEmail', send);
    return returnValue.data.exists;
  }

  const handleEmailChange = async (email) => {    
    setEmailExists(await checkEmailExists(email.target.value));
  }

  if (formState === "button") {
    console.log(formState);
    return <button className="SignUpBtn" onClick={() => {setFormState("form-0")}}> Sign up </button>;
    // return <div> some text.</div>
  } else if (formState === "form-0") {
    return (
      <div>
        <button className="SignUpBtn" onClick={() => {}}> Sign up </button>
      
        <div className='popup'>
          <div className='popup_inner'>
          <img src={logo} className="signup-logo" alt="SportCred" href="the_zone"/>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="div-name">
                {/* <label>First Name:</label> */}
                <input name="firstName" className="input-firstname" placeholder="First name" ref={register({ required: true })} />
                {errors.firstName && <span className="error-message">This field is required.</span>}

                {/* <label>Last Name:</label> */}
                <input name="lastName" className="input-lastname" placeholder="Last name" ref={register({ required: true })} />
                {errors.lastName && <span className="error-message">This field is required.</span>}
              </div>

              <input name="email" className="input-field" placeholder="Email" ref={register({ required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              }})} onInput={handleEmailChange} />

              <ErrorMessage flag={emailExists} text="This email has already been used." />
              {errors.email && errors.email.type === "required" && <span className="error-message">This field is required.</span>}
              {errors.email && errors.email.type === "pattern" && <span className="error-message">Invalid email address.</span>}

              <input name="phoneNumber" className="input-field" placeholder="Phone Number (optional)" ref={register} />
              
              <input type="submit" className="submit" value="Continue" /> 
            </form>
          </div>
        </div>
      </div>
    )
  } else {
    return <h1>form-1</h1>
  }
}