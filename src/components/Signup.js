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
  const [usernameExists, setUsernameExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [maleRadio, setMaleRadio] = useState()
  const [femaleRadio, setFemaleRadio] = useState()
  const [otherRadio, setOtherRadio] = useState()
  let history = useHistory();

  const RedirectToSignIn = () => {
    setFormState("button");
    history.push("/profile");
  } 

  
  const onSubmit = async data => {
    console.log(data);
    RedirectToSignIn();
  };

  const checkUsernameExists = async (username) => {
    const send = {
      params: {
        username: username
      }
    }
    
    const returnValue = await axios.get('http://localhost:5000/signup/existingUsername', send);
    return returnValue.data.exists;
  }

  const handleUsernameChange = async (username) => {    
    setUsernameExists(await checkUsernameExists(username.target.value));
  }

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

  const year = (new Date()).getFullYear();
  const years = Array.from(new Array(120),( val, index) => -index + year);
  console.log(years);

  if (formState === "button") {
    console.log(formState);
    return <button className="SignUpBtn" onClick={() => {setFormState("form-0")}}> Sign up </button>;
  } else if (formState === "form-0") {
    return (
      <div>
        <button className="SignUpBtn" onClick={() => {}}> Sign up </button>
      
        <div className='popup' onClick={() => setFormState("button")}>
          <div className='popup_inner' onClick = {(e) => { e.stopPropagation(); }}>
            <div className="signup-logo-container">
              <img src={logo} className="signup-logo" alt="SportCred" href="the_zone"/>
              <span className="slogan">Start Building Your ACS Score</span>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="div-name">
                <div className="div-firstname">
                  <input name="firstName" className="input-firstname" placeholder="First name" ref={register({ required: true })} />
                  {errors.firstName && <span className="error-message">This field is required.</span>}
                </div>

                <div className="div-lastname">
                  <input name="lastName" className="input-lastname" placeholder="Last name" ref={register({ required: true })} />
                  {errors.lastName && <span className="error-message">This field is required.</span>}
                </div>
              </div>

              <input name="username" className="input-field" placeholder="Username" ref={register({ required: true })} onInput={handleUsernameChange} />
              <ErrorMessage flag={usernameExists} text="This username already exists." />
              {errors.username && <span className="error-message">This field is required.</span>}

              <input type="password" className="input-field" placeholder="Password" name="password" ref={ register({ required: true }) } />
              {errors.password && <span className="error-message">This field is required.</span>}

              <input name="email" className="input-field" placeholder="Email" ref={register({ required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              }})} onInput={handleEmailChange} />

              <ErrorMessage flag={emailExists} text="This email has already been used." />
              {errors.email && errors.email.type === "required" && <span className="error-message">This field is required.</span>}
              {errors.email && errors.email.type === "pattern" && <span className="error-message">Invalid email address.</span>}

              <input name="phoneNumber" className="input-field" placeholder="Phone Number (optional)" ref={register} />

              <label className="form-label">Birthday:</label>
              <div className="birthdate-container">
                <select name="month" ref={register} className="select-month" >
                  <option value="January">Jan</option>
                  <option value="February">Feb</option>
                  <option value="March">Mar</option>
                  <option value="April">Apr</option>
                  <option value="May">May</option>
                  <option value="June">Jun</option>
                  <option value="July">Jul</option>
                  <option value="August">Aug</option>
                  <option value="September">Sep</option>
                  <option value="October">Oct</option>
                  <option value="November">Nov</option>
                  <option value="December">Dec</option>
                </select>

                <select name="day" ref={register} className="select-day" >
                  {
                    Array(31).fill(1).map((el, i) => <option value={i}>{i + 1}</option>) 
                  }
                </select>

                <select name="year" ref={register} className="select-year" >
                  {
                    years.map((year, index) => {
                      return <option key={year} value={year}>{year}</option>
                    })
                  }
                </select>
              </div>

              <label className="form-label">Gender:</label>
              <div className="gender-container">
                  <span className="radio-container" onClick={ e => maleRadio.click() }> 
                    <label className="radio-text">male</label>
                    <input type="radio" name="gender" className="gender-radio" ref={ i => setMaleRadio(i) }></input>
                  </span>
                  <span className="radio-container" onClick={ e => femaleRadio.click() }> 
                    <label className="radio-text">female</label>
                    <input type="radio" name="gender" className="gender-radio" ref={ i => setFemaleRadio(i) }></input>
                  </span>
                  <span className="radio-container" onClick={ e => otherRadio.click() }> 
                    <label className="radio-text">other</label>
                    <input type="radio" name="gender" className="gender-radio" ref={ i => setOtherRadio(i) }></input>
                  </span>
              </div>

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