import React, {useState,  useEffect} from "react"
import '../styling/Leaderboard.css'

export default function Leaderboard(props) {
    const [users, setUsers] = useState([]);
    var mode = props.mode;
//     const givenUsers = props.users;
//    console.log(givenUsers);

    useEffect(() => {
        //fetch and setUsers
    }, [])

    if (mode === "Global") {
        return (
            <div className='all'>
                <div className='Leaderboard'>
                    <GlobalHeaderRow></GlobalHeaderRow>
                    {users.map((data, index) => {
                        console.log(data);
                        if(index % 2 == 0) {
                            //<GlobalRow color='#0B0A0A' rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                            return (
                                <GlobalRow color='#0B0A0A'></GlobalRow>
                            )
                        }
                        //<GlobalRow rank='1' numofplayers='20' percentofplayers='20' division='x' points='2' ></GlobalRow>
                        return (
                            <GlobalRow></GlobalRow>
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
                {users.map((data, index) => {
                    console.log(data);
                    if(index % 2 == 0) {
                        //<RadarRow color='#0B0A0A' rank='1' name='andy' points='23'></RadarRow>
                        return (
                            <RadarRow color='#0B0A0A'></RadarRow>
                        )
                    }
                    //<RadarRow color='#0B0A0A'></RadarRow>
                    return (
                        <RadarRow></RadarRow>
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
    const [rank, setRank] = useState();
    const [division, setDivision] = useState();
    const [numberOfPlayers, setNumberOfPlayers] = useState();
    const [percentOfPlayers, setPercentOfPlayers] = useState();
    const [pointsNeeded, setPointsNeeded] = useState();

    useEffect(() => {
        setRank(props.rank);
        setDivision(props.division);
        setNumberOfPlayers(props.numofplayers);
        setPercentOfPlayers(props.percentofplayers)
        setPointsNeeded(props.points);
    })

    var backgroundColor = props.color;
    if(backgroundColor == null) {
        backgroundColor = '#1b1a18';
    }
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
    const [rank, setRank] = useState();
    const [name, setName] = useState();
    const [points, setPoints] = useState();

    useEffect(() => {
        setRank(props.rank);
        setName(props.name);
        setPoints(props.points);
    })

    var backgroundColor = props.color;
    if(backgroundColor == null) {
        backgroundColor = '#1b1a18';
    }
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


  