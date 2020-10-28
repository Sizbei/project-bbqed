import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import InGameTrivia from './InGameTrivia';

export default class Trivia extends Component {
    render() {
        return(
        <div>
          <InGameTrivia/>
        </div>
        );
    }
}