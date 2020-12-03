import React, {useState, useEffect} from "react"
import '../styling/Leaderboard.css'

export default function Leaderboard(props) {
    const[globalBGStyle, setGlobalBGStyle] = useState({ "background-color": "#c8651b" });
    const[radarBGStyle, setRadarBGStyle] = useState({ "background-color": "#0B0A0A" });
    const[globalVisStyle, setGlobalVisStyle] = useState({ "visibility": "visible" });
    const[radarVisStyle, setRadarVisStyle] = useState({ "visibility": "hidden" });
    const[regSeasonBGStyle, setRegSeasonBGStyle] = useState({ "background-color": "#c8651b" });
    const[playOffBGStyle, setPlayOffBGStyle] = useState({ "background-color": "#0B0A0A" });

    const givenUsers = props.users;

    var leaderboardRadarStyle;
    var leaderboardGlobalStyle;
    var globalStyle;
    var radarStyle;
    var regSeasonStyle;
    var playOffStyle;

    useEffect(() => {
    }, [])
    
// /prediction/leaderboard
// /prediction/regularseason/global
// /prediction/playoff

    const changeToGlobal = () => {
        leaderboardRadarStyle = { "visibility": "hidden"};
        leaderboardGlobalStyle = { "visibility": "visible"};
        setGlobalVisStyle(leaderboardGlobalStyle);
        setRadarVisStyle(leaderboardRadarStyle);

        globalStyle = { "background-color": "#c8651b" };
        radarStyle = { "background-color": "#0B0A0A" };
        setGlobalBGStyle(globalStyle);
        setRadarBGStyle(radarStyle);
        var index;
        for (index = 1; index < 10; index++) {
            console.log(document.getElementById("globalRow" + index));
        }
    }

    const changeToRegSeason = () => {
        regSeasonStyle = { "background-color": "#c8651b" };
        playOffStyle = {"background-color": "#0B0A0A" };
        setRegSeasonBGStyle(regSeasonStyle);
        setPlayOffBGStyle(playOffStyle);
        //fetch 
    }

    const changeToPlayOff = () => {
        regSeasonStyle = { "background-color": "#0B0A0A" };
        playOffStyle = {"background-color": "#c8651b" };
        setRegSeasonBGStyle(regSeasonStyle);
        setPlayOffBGStyle(playOffStyle);
        //fetch
    }

    const changeToRadar = () => {
        globalStyle = { "background-color": "#0B0A0A" };
        radarStyle = { "background-color": "#c8651b" };
        leaderboardRadarStyle = { "visibility": "visible"};
        leaderboardGlobalStyle = { "visibility": "hidden"};
        setGlobalBGStyle(globalStyle);
        setRadarBGStyle(radarStyle);
        setGlobalVisStyle(leaderboardGlobalStyle);
        setRadarVisStyle(leaderboardRadarStyle);
    }

    const radarRowClassName = (index) => {
        const base = "radarRow" + (index + 1);
        return base;
    }

    const swapYears = (id) => {
        var temp = document.getElementById("yearButton").innerHTML
        document.getElementById("yearButton").innerHTML = document.getElementById(id).innerHTML;
        document.getElementById(id).innerHTML = temp;
    }

    return (
        <div>
            <div className='leaderboardGlobal' style = {globalVisStyle}>
                <div className="leaderboardButtonDiv">
                    <button className="leaderboardButton" style = {regSeasonBGStyle} onClick = {() => changeToRegSeason()}>Regular Season</button>
                    <button className="leaderboardButton" style = {playOffBGStyle} onClick = {() => changeToPlayOff()}>Playoff</button>
                    <div className="yearButtonDiv">
                        <button className="yearButton">2020</button>
                            <div className="yearOptions">
                                <button className="yearOptionsButton">2019</button>
                                <button className="yearOptionsButton">2018</button>
                                <button className="yearOptionsButton">2017</button>
                                <button className="yearOptionsButton">2016</button>
                                <button className="yearOptionsButton">2015</button>
                            </div>
                    </div>
                    <div className='centerSpace'></div>
                    <button className="leaderboardButton" style = {globalBGStyle}>Global</button>
                    <button className="leaderboardButton" style = {radarBGStyle}  onClick = {() => changeToRadar()}>Radar</button>
                </div>
            
                <div className='Leaderboard'>
                    <GlobalHeaderRow></GlobalHeaderRow>
                    {givenUsers.map((data, index) => {
                        if(index % 2 == 0) {
                            //<GlobalRow color='#0B0A0A' rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                            return (
                                <GlobalRow rank={index+1} division={'Division ' + (index+1)} color='#0B0A0A'></GlobalRow>
                            )
                        }
                        //<GlobalRow rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                        return (
                            <GlobalRow rank={index+1} division={'Division ' + (index+1)}></GlobalRow>
                        )
                    })}
                </div>
            </div> 
            <div className='leaderboardRadar' style = {radarVisStyle}>
                <div className="leaderboardButtonDiv">
                    <button className="leaderboardButton" style = {regSeasonBGStyle}  onClick = {() => changeToRegSeason()}>Regular Season</button>
                    <button className="leaderboardButton" style = {playOffBGStyle}  onClick = {() => changeToPlayOff()}>Playoff</button>
                    <div className="yearButtonDiv">
                        <button className="yearButton" id="yearButton">2020</button>
                            <div className="yearOptions">
                                <button className="yearOptionsButton" id="yearOption1" onClick={() => swapYears("yearOption1")}>2019</button>
                                <button className="yearOptionsButton" id="yearOption2" onClick={() => swapYears("yearOption2")}>2018</button>
                                <button className="yearOptionsButton" id="yearOption3" onClick={() => swapYears("yearOption3")}>2017</button>
                                <button className="yearOptionsButton" id="yearOption4" onClick={() => swapYears("yearOption4")}>2016</button>
                                <button className="yearOptionsButton" id="yearOption5" onClick={() => swapYears("yearOption5")}>2015</button>
                            </div>
                    </div>
                    <div className='centerSpace'></div>
                    <button className="leaderboardButton" style = {globalBGStyle} onClick = {() => changeToGlobal()}>Global</button>
                    <button className="leaderboardButton" style = {radarBGStyle}>Radar</button>
                </div>
                <div className='Leaderboard'>
                    <RadarHeaderRow></RadarHeaderRow>
                    {givenUsers.map((data, index) => {
                        if(index % 2 == 0) {
                            //<RadarRow color='#0B0A0A' rank='1' name='andy' points='23'></RadarRow>
                            return (
                                <RadarRow rank={index+1} color='#0B0A0A'></RadarRow>
                            )
                        }
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
    
    const numOfPlayersID = (rank) => {
        const id = "numOfPlayers" + (rank);
        return id;
    }

    const percentOfPlayersID = (rank) => {
        const id = "percentOfPlayers" + (rank);
        return id;
    }

    const pointsNeededID = (rank) => {
        const id = "pointsNeeded" + (rank);
        return id;
    }
    
    var backgroundStyle = { "background-color": backgroundColor };

    return (
        <div className='Leaderboard-row' style={backgroundStyle}>
            <label className='L-col-Global'>{rank}</label>
            <label className='L-col-Global'>{division}</label>
            <label className='L-col-Global' id={numOfPlayersID(rank)}>{numberOfPlayers}</label>
            <label className='L-col-Global' id={percentOfPlayersID(rank)}>{percentOfPlayers}</label>
            <label className='L-col-Global' id={pointsNeededID(rank)}>{pointsNeeded}</label>
        </div>
    )
}

function RadarRow(props) {
    const rank = "rank" in props ? props.rank : 0;
    const name = "name" in props ? props.name : "-";
    const points = "points" in props ? props.points : "-";
    const profilePic = "profilePIc" in props ? props.profile : "https://cdn.onlinewebfonts.com/svg/img_258083.png"
    const backgroundColor = "color" in props ? props.color : "1b1a18"

    const profilePicID = (rank) => {
        const id = "pfp" + (rank);
        return id;
    }

    const nameID = (rank) => {
        const id = "name" + (rank);
        return id;
    }

    const pointsNeededID = (rank) => {
        const id = "points" + (rank);
        return id;
    }

    var backgroundStyle = { "background-color": backgroundColor };

    return (
        <div className='Leaderboard-row' style={backgroundStyle}>
            <label className='L-col-Radar'>{rank}</label>
            <img className='L-col-Radar-Image' src={profilePic} id={profilePicID(rank)}></img>
            <label className='L-col-Radar' id={nameID(rank)}>{name}</label>
            <label className='L-col-Radar' id={pointsNeededID(rank)}>{points}</label>
        </div>
    )
}


  