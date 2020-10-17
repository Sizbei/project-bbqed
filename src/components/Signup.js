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

  const year = (new Date()).getFullYear();
  const years = Array.from(new Array(120),( val, index) => -index + year);
  console.log(years);

  if (formState === "button") {
    console.log(formState);
    return <button className="SignUpBtn" onClick={() => {setFormState("form-0")}}> Sign up </button>;
    // return <div> some text.</div>
  } else if (formState === "form-0") {
    return (
      <div>
        <button className="SignUpBtn" onClick={() => {}}> Sign up </button>
      
        <div className='popup' onClick={console.log("click")}>
          <div className='popup_inner'>
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

              <input name="email" className="input-field" placeholder="Email" ref={register({ required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              }})} onInput={handleEmailChange} />

              <ErrorMessage flag={emailExists} text="This email has already been used." />
              {errors.email && errors.email.type === "required" && <span className="error-message">This field is required.</span>}
              {errors.email && errors.email.type === "pattern" && <span className="error-message">Invalid email address.</span>}

              <input name="phoneNumber" className="input-field" placeholder="Phone Number (optional)" ref={register} />

              <label>Birthday:</label>
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