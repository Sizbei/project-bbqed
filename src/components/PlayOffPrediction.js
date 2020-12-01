import React, {useState,  useEffect} from "react"
import '../styling/PlayOffPrediction.css'
import TeamBox from './TeamBox'
 
export default function PlayOffPrediction(props) {
    const predictions = props.predictions;
    var results = "results" in props ? props.results : "Pending";

    const teamClassName = (index) => {
        const base = "team" + (index + 1) + "Box";
        return base;
    }

    const darkenOtherBox = (indexOpposite, indexClicked) => {
       document.getElementsByClassName("team" + indexOpposite + "Box")[0].style = "filter: brightness(50%)";
       document.getElementsByClassName("team" + indexClicked + "Box")[0].style = "filter: brightness(100%)";
    }

    if (results !== "Pending") {
        return (
            <div className="center-predictionBox">
                <div className="predictionBox">
                    {predictions.map((data, index) => {
                        console.log(data);
                        return (
                            <div className="gamePredictionBox">
                                <div className="gameNumber">Game {index + 1}</div>
                                <div className='predictTeams'>
                                    <div className='darkened'>
                                        <TeamBox name="Atlanta Hawks" height='4vw' width='12vw'></TeamBox>
                                    </div>
                                    <div className='spaceAllotted'></div>
                                    <div className='darkened'>
                                        <TeamBox name="Atlanta Hawks" height='4vw' width='12vw'></TeamBox>
                                    </div>
                                </div>
                                <div className="resultPrediction">
                                    <label>Result</label>
                                    <label>{results}</label>
                                </div>    
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return (
        <div className="center-predictionBox">
            <div className="predictionBox">
                {predictions.map((data, index) => {
                    console.log(data);
                    return (
                        <div className="gamePredictionBox">
                            <div className="gameNumber">Game {index + 1}</div>
                            <div className='predictTeams'>
                                <div className={teamClassName(index)} onClick={() => darkenOtherBox(index+1.5, index+1)}>
                                    <TeamBox name="Atlanta Hawks" height='4vw' width='12vw'></TeamBox>
                                </div>
                                <div className='spaceAllotted'></div>
                                <div className={teamClassName(index+0.5)} onClick={() => darkenOtherBox(index+1, index+1.5)}>
                                    <TeamBox name="Atlanta Hawks" height='4vw' width='12vw'></TeamBox>
                                </div>
                            </div>
                            <div className="resultPrediction">
                                <label>Result</label>
                                <label>{results}</label>
                            </div>    
                        </div>
                    );
                })}
            </div>
        </div>
    );
}