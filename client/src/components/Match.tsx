import matchInterface from '../interfaces/MatchInterface'
import Player from './Player'

const Match = ({matchName, matchDate, matchTime, players}: matchInterface) => {
  return (
    <div>
        <p>{matchName} {matchDate} {matchTime}</p>
        {players.map(player => <Player {...player}/>)}
    </div>
  )
}

export default Match