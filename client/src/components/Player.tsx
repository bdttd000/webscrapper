import playerInterface from '../interfaces/PlayerInterface'
import PlayerRates from './PlayerRates'

const Player = ({playerName, rates}: playerInterface) => {
  return (
    <span>
        {playerName}
        <PlayerRates {...rates}/>
        <br></br>
    </span>
  )
}

export default Player