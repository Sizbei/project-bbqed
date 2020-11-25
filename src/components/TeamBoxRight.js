import React, {useState,  useEffect} from "react"
import '../styling/TeamBox.css'

/*
<TeamBoxRight name="Atlanta Hawks" color='black'></TeamBoxRight>
<TeamBoxRight name="Boston Celtics" color='#008248'></TeamBoxRight>
<TeamBoxRight name="Brooklyn Nets" color='#FF6E00'></TeamBoxRight>
<TeamBoxRight name="Charlotte Hornets" color='#00788C'></TeamBoxRight>
<TeamBoxRight name="Chicago Bulls" color='#C4001E'></TeamBoxRight>
<TeamBoxRight name="Cleveland Chandeliers" color='#6F2633'></TeamBoxRight>
<TeamBoxRight name="Dallas Mavericks" color='#007DC5'></TeamBoxRight>
<TeamBoxRight name="Denver Nuggets" color='#001E3E'></TeamBoxRight>
<TeamBoxRight name="Detroit Pistons" color='#1D428A'></TeamBoxRight>
<TeamBoxRight name="Golden State Warriors" color='#FDB927'></TeamBoxRight>
<TeamBoxRight name="Houston Rockets" color='#F00840'></TeamBoxRight>
<TeamBoxRight name="Indiana Pacers" color='#002D62'></TeamBoxRight>
<TeamBoxRight name="Los Angeles Lakers" color='#552583'></TeamBoxRight>
<TeamBoxRight name="Los Angeles Clippers" color='#5B91F2'></TeamBoxRight>
<TeamBoxRight name="Memphis Grizzles" color='#305168'></TeamBoxRight>
<TeamBoxRight name="Miami Heat" color='#D00000'></TeamBoxRight>
<TeamBoxRight name="Milwaukee Bucks" color='#00471B'></TeamBoxRight>
<TeamBoxRight name="Minnesota Timberwolves" color='#78BE20'></TeamBoxRight>
<TeamBoxRight name="New Orleans Pelicans" color='#E31837'></TeamBoxRight>
<TeamBoxRight name="New York Knicks" color='#006BB6'></TeamBoxRight>
<TeamBoxRight name="OKC City Thunder" color='#FDBB30'></TeamBoxRight>
<TeamBoxRight name="Utah Jazz" color='#00471B'></TeamBoxRight>
<TeamBoxRight name="Orlando Magic" color='#0B77BD'></TeamBoxRight>
<TeamBoxRight name="Phoenix Suns" color='#D75F06'></TeamBoxRight>
<TeamBoxRight name="Portland Trail Blazers" color='black'></TeamBoxRight>     
<TeamBoxRight name="Sacramento Kings" color='#5A2D80'></TeamBoxRight>     
<TeamBoxRight name="San Antonio Spurs" color='#181A21'></TeamBoxRight>     
<TeamBoxRight name="Toronto Raptors" color='black'></TeamBoxRight>     
<TeamBoxRight name="Washington Wizards" color='#004C9E'></TeamBoxRight> 
*/

export default function TeamBoxRight(props) {
    var givenTeamName = props.name;
    var backgroundColor = props.color;
    const [teamImage, setTeamImage] = useState('');
    var height = props.height;
    var fontSize;
    var width;
    const scaleFactor = 3;
    const fontFactor = 5;

    if(backgroundColor == null) {
        backgroundColor = 'black';
    }

    if(height == null) {
        height = 5;
        
    }
    width = height * scaleFactor;
    fontSize = height / fontFactor;

    var TeamBoxStyle = { 
        "background-color": backgroundColor,
        "height": height + "vw",
        "width": width + "vw" 
    };

    var FontStyle = {
        "font-size": fontSize + "vw"
    }

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
        <div className='TeamBox' style={TeamBoxStyle}>
            <div className='TB-teamName-right'>
                <label className='TB-name-right' style={FontStyle}>{givenTeamName}</label>
            </div>
            <div className='TB-teamImage'>
                <img src={teamImage} className='TB-image'/>
            </div>
        </div>
    );
}

  