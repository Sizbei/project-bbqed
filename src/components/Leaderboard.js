import React, {useState,  useEffect} from "react"
import '../styling/Leaderboard.css'

export default function Leaderboard(props) {
    const [users, setUsers] = useState([]);
    var mode = props.mode;
     const givenUsers = props.users;

    useEffect(() => {
        //fetch and setUsers
    }, [])
    
// /prediction/leaderboard
// /prediction/regularseason/global
// /prediction/playoff

    if (mode === "Global") {
        return (
            <div className='all'>
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
        );
    } 
    else if (mode === "Radar") {
        return (
            <div className='all'>

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
        );
    }
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
    const backgroundColor = "color" in props ? props.color : "1b1a18"

    useEffect(() => {
    })
    var backgroundStyle = { "background-color": backgroundColor };

    return (
        <div className='Leaderboard-row' style={backgroundStyle}>
            <div className='L-col-Image'></div>
            <label className='L-col-Radar'>{rank}</label>
            <label className='L-col-Radar'>{name}</label>
            <label className='L-col-Radar'>{points}</label>
        </div>
    )
}


  