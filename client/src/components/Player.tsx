import { useState } from 'react'
import playerInterface from '../interfaces/PlayerInterface'
import PlayerRates from './PlayerRates'

const Player = ({playerName, rates}: playerInterface) => {
  const [isShown, setIsShown] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsShown(current => !current);
  }

  return (
    <div className='bg-gray-600 m-2 p-2 rounded'>
        <p onClick={handleClick} className='cursor-pointer'>{playerName}</p>
        <div style={{display: isShown ? 'block' : 'none'}}>
          <PlayerRates {...rates}/>
        </div>
    </div>
  )
}

export default Player