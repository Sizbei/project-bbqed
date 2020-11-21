import React, {useState,  useEffect} from "react"
import '../styling/TeamBox.css'
 
/* 
<TeamBoxLeft name="Atlanta Hawks" color='black'></TeamBoxLeft>
<TeamBoxLeft name="Boston Celtics" color='#008248'></TeamBoxLeft>
<TeamBoxLeft name="Brooklyn Nets" color='#FF6E00'></TeamBoxLeft>
<TeamBoxLeft name="Charlotte Hornets" color='#00788C'></TeamBoxLeft>
<TeamBoxLeft name="Chicago Bulls" color='#C4001E'></TeamBoxLeft>
<TeamBoxLeft name="Cleveland Chandeliers" color='#6F2633'></TeamBoxLeft>
<TeamBoxLeft name="Dallas Mavericks" color='#007DC5'></TeamBoxLeft>
<TeamBoxLeft name="Denver Nuggets" color='#001E3E'></TeamBoxLeft>
<TeamBoxLeft name="Detroit Pistons" color='#1D428A'></TeamBoxLeft>
<TeamBoxLeft name="Golden State Warriors" color='#FDB927'></TeamBoxLeft>
<TeamBoxLeft name="Houston Rockets" color='#F00840'></TeamBoxLeft>
<TeamBoxLeft name="Indiana Pacers" color='#002D62'></TeamBoxLeft>
<TeamBoxLeft name="Los Angeles Lakers" color='#552583'></TeamBoxLeft>
<TeamBoxLeft name="Los Angeles Clippers" color='#5B91F2'></TeamBoxLeft>
<TeamBoxLeft name="Memphis Grizzles" color='#305168'></TeamBoxLeft>
<TeamBoxLeft name="Miami Heat" color='#D00000'></TeamBoxLeft>
<TeamBoxLeft name="Milwaukee Bucks" color='#00471B'></TeamBoxLeft>
<TeamBoxLeft name="Minnesota Timberwolves" color='#78BE20'></TeamBoxLeft>
<TeamBoxLeft name="New Orleans Pelicans" color='#E31837'></TeamBoxLeft>
<TeamBoxLeft name="New York Knicks" color='#006BB6'></TeamBoxLeft>
<TeamBoxLeft name="OKC City Thunder" color='#FDBB30'></TeamBoxLeft>
<TeamBoxLeft name="Utah Jazz" color='#00471B'></TeamBoxLeft>
<TeamBoxLeft name="Orlando Magic" color='#0B77BD'></TeamBoxLeft>
<TeamBoxLeft name="Phoenix Suns" color='#D75F06'></TeamBoxLeft>
<TeamBoxLeft name="Portland Trail Blazers" color='black'></TeamBoxLeft>     
<TeamBoxLeft name="Sacramento Kings" color='#5A2D80'></TeamBoxLeft>     
<TeamBoxLeft name="San Antonio Spurs" color='#181A21'></TeamBoxLeft>     
<TeamBoxLeft name="Toronto Raptors" color='black'></TeamBoxLeft>     
<TeamBoxLeft name="Washington Wizards" color='#004C9E'></TeamBoxLeft> 
*/ 

export default function TeamBoxLeft(props) {
    var givenTeamName = props.name;
    var backgroundColor = props.color;
    const [teamImage, setTeamImage] = useState('');
    if(backgroundColor == null) {
        backgroundColor = 'black';
    }
    var backgroundStyle = { "background-color": backgroundColor };

    useEffect(() => {
        fetch('/teams').then(res => res.json())
            .then(data => {
            data.forEach(function(team) { 
                if(team.name === givenTeamName.replace(/\s/g, "")) {
                    setTeamImage(team.image);
                }
            }); 
            })
            .catch(err => { console.log('ERROR') }) ; 
    }, [])

    return (
        <div className='TeamBox' style={backgroundStyle}>
            <div className='TB-teamImage'>
                <img src={teamImage} className='TB-image'/>
            </div>
            <div className='TB-teamName-left'>
                <label className='TB-name-left'>{givenTeamName}</label>
            </div>
        </div>
    );
}

  