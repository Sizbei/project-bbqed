import React, {useEffect, useRef, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import BracketView from './BracketView.js';

export default function BracketController(props) {

  const onClick = (index) => {
    console.log(index);
  }

  return <BracketView onClick={onClick}/>
}

