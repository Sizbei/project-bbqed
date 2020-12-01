import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import PlayOffPrediction from './PlayOffPrediction';
import Teambox from './TeamBox';
import '../styling/PlayOffPrediction.css'

export default class PicksAndPredictions extends Component {
    render() {
        return(
        <div className>
            <PlayOffPrediction predictions={[1, 2, 3, 4, 5, 6, 7]} ></PlayOffPrediction>
        </div>
        );
    }
}