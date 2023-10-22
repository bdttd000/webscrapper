import { useState } from 'react';
import matchInterface from '../interfaces/MatchInterface'
import Player from './Player'

const Match = ({matchName, matchDate, matchTime, players}: matchInterface) => {
  const [isShown, setIsShown] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsShown(current => !current);
  }

  return (
    <div className='bg-blue-400'>
        <p onClick={handleClick} className='cursor-pointer'>{matchName} {matchDate} {matchTime}</p>
        <div style={{display: isShown ? 'block' : 'none'}}>
          {players.map((player, index) => <Player {...player} key={index}/>)}
        </div>
    </div>
  )
}

export default Match