import React, {useState,  useEffect} from "react"
import '../styling/Leaderboard.css'

export default function Leaderboard(props) {
    const[globalBGStyle, setGlobalBGStyle] = useState();
    const[radarBGStyle, setRadarBGStyle] = useState();
    const[globalVisStyle, setGlobalVisStyle] = useState();
    const[radarVisStyle, setRadarVisStyle] = useState();
    const[regSeasonBGStyle, setRegSeasonBGStyle] = useState();
    const[playOffBGStyle, setPlayOffBGStyle] = useState();

    var mode = props.mode;
    const givenUsers = props.users;
    var leaderboardRadarStyle;
    var leaderboardGlobalStyle;
    var globalStyle;
    var radarStyle;
    var regSeasonStyle;
    var playOffStyle;

    useEffect(() => {
        //fetch and setUsers
        globalStyle = { "background-color": "#0B0A0A" };
        radarStyle = { "background-color": "#c8651b" };
        leaderboardRadarStyle = { "visibility": "visible"};
        leaderboardGlobalStyle = { "visibility": "hidden"};
        setGlobalBGStyle(globalStyle);
        setRadarBGStyle(radarStyle);
        setGlobalVisStyle(leaderboardGlobalStyle);
        setRadarVisStyle(leaderboardRadarStyle);

        regSeasonStyle = { "background-color": "#c8651b" };
        playOffStyle = {"background-color": "#0B0A0A" };
        setRegSeasonBGStyle(regSeasonStyle);
        setPlayOffBGStyle(playOffStyle);
    }, [])
    
// /prediction/leaderboard
// /prediction/regularseason/global
// /prediction/playoff
    const changeTab = (type) => {
        if (type === "radar") {
            leaderboardRadarStyle = { "visibility": "hidden"};
            leaderboardGlobalStyle = { "visibility": "visible"};
            setGlobalVisStyle(leaderboardGlobalStyle);
            setRadarVisStyle(leaderboardRadarStyle);

            globalStyle = { "background-color": "#c8651b" };
            radarStyle = { "background-color": "#0B0A0A" };
            setGlobalBGStyle(globalStyle);
            setRadarBGStyle(radarStyle);   
        }
        else if (type === "global") {
            globalStyle = { "background-color": "#0B0A0A" };
            radarStyle = { "background-color": "#c8651b" };
            leaderboardRadarStyle = { "visibility": "visible"};
            leaderboardGlobalStyle = { "visibility": "hidden"};
            setGlobalBGStyle(globalStyle);
            setRadarBGStyle(radarStyle);
            setGlobalVisStyle(leaderboardGlobalStyle);
            setRadarVisStyle(leaderboardRadarStyle);
        }
        else if (type === "regSeason") {
            regSeasonStyle = { "background-color": "#0B0A0A" };
            playOffStyle = {"background-color": "#c8651b" };
            setRegSeasonBGStyle(regSeasonStyle);
            setPlayOffBGStyle(playOffStyle);
        }
        else if (type === "playOff") {
            regSeasonStyle = { "background-color": "#c8651b" };
            playOffStyle = {"background-color": "#0B0A0A" };
            setRegSeasonBGStyle(regSeasonStyle);
            setPlayOffBGStyle(playOffStyle);
        }
    }
        return (
            <div>
                <div className='leaderboardGlobal' style = {globalVisStyle}>
                    <div className="leaderboardButtonDiv">
                        <button className="leaderboardButton" style = {regSeasonBGStyle} onClick = {() => changeTab("playOff")}>Regular Season</button>
                        <button className="leaderboardButton" style = {playOffBGStyle} onClick = {() => changeTab("regSeason")}>Playoff</button>
                        <div className='centerSpace'></div>
                        <button className="leaderboardButton" style = {globalBGStyle}>Global</button>
                        <button className="leaderboardButton" style = {radarBGStyle}  onClick = {() => changeTab("global")}>Radar</button>
                    </div>
                
                    <div className='Leaderboard'>
                        <GlobalHeaderRow></GlobalHeaderRow>
                        {givenUsers.map((data, index) => {
                            console.log(data);
                            if(index % 2 == 0) {
                                //<GlobalRow color='#0B0A0A' rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                                return (
                                    <GlobalRow rank={index+1} color='#0B0A0A'></GlobalRow>
                                )
                            }
                            //<GlobalRow rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                            return (
                                <GlobalRow rank={index+1}></GlobalRow>
                            )
                        })}
                    </div>
                </div> 
                <div className='leaderboardRadar' style = {radarVisStyle}>
                    <div className="leaderboardButtonDiv">
                        <button className="leaderboardButton" style = {regSeasonBGStyle}  onClick = {() => changeTab("playOff")}>Regular Season</button>
                        <button className="leaderboardButton" style = {playOffBGStyle}  onClick = {() => changeTab("regSeason")}>Playoff</button>
                        <div className='centerSpace'></div>
                        <button className="leaderboardButton" style = {globalBGStyle} onClick = {() => changeTab("radar")}>Global</button>
                        <button className="leaderboardButton" style = {radarBGStyle} >Radar</button>
                    </div>
                    <div className='Leaderboard'>
                        <RadarHeaderRow></RadarHeaderRow>
                        {givenUsers.map((data, index) => {
                            console.log(data);
                            if(index % 2 == 0) {
                                //<RadarRow color='#0B0A0A' rank='1' name='andy' points='23'></RadarRow>
                                return (
                                    <RadarRow rank={index+1} color='#0B0A0A'></RadarRow>
                                )
                            }
                            //<RadarRow color='#0B0A0A'></RadarRow>
                            return (
                                <RadarRow rank={index+1}></RadarRow>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

function GlobalHeaderRow() {
    return (
        <div className='Leaderboard-row'>
            <div className='L-col-Global'>Rank</div>
            <div className='L-col-Global'>Division</div>
            <div className='L-col-Global'># of Players</div>
            <div className='L-col-Global'>% of Players</div>
            <div className='L-col-Global'>Points Needed</div>
        </div>
    )
}


function RadarHeaderRow(props) {
    return (
        <div className='Leaderboard-row'>
            <div className='L-col-Radar'>Rank</div>
            <div className='L-col-Radar-Space'>.</div>
            <div className='L-col-Radar'>Name</div>
            <div className='L-col-Radar'>Points</div>
        </div>
    )
}

function GlobalRow(props) {
    const rank = "rank" in props ? props.rank : 0;
    const division = "division" in props ? props.division : "N/A";
    const numberOfPlayers = "numberofplayers" in props ? props.numofplayers : "-";
    const percentOfPlayers = "percentofplayers" in props ? props.percentofplayers : "-";
    const pointsNeeded = "pointsNeeded" in props ? props.pointsNeeded : "-";
    const backgroundColor = "color" in props ? props.color : "1b1a18"
    useEffect(() => {
    })
    var backgroundStyle = { "background-color": backgroundColor };

    return (
        <div className='Leaderboard-row' style={backgroundStyle}>
            <label className='L-col-Global'>{rank}</label>
            <label className='L-col-Global'>{division}</label>
            <label className='L-col-Global'>{numberOfPlayers}</label>
            <label className='L-col-Global'>{percentOfPlayers}</label>
            <label className='L-col-Global'>{pointsNeeded}</label>
        </div>
    )
}

function RadarRow(props) {
    const rank = "rank" in props ? props.rank : 0;
    const name = "name" in props ? props.name : "-";
    const points = "points" in props ? props.points : "-";
    const profilePic = "profilePIc" in props ? props.profile : "https://cdn.onlinewebfonts.com/svg/img_258083.png"
    const backgroundColor = "color" in props ? props.color : "1b1a18"

    useEffect(() => {
    })
    var backgroundStyle = { "background-color": backgroundColor };

    return (
        <div className='Leaderboard-row' style={backgroundStyle}>
            <label className='L-col-Radar'>{rank}</label>
            <img className='L-col-Radar-Image' src={profilePic}></img>
            <label className='L-col-Radar'>{name}</label>
            <label className='L-col-Radar'>{points}</label>
        </div>
    )
}


  