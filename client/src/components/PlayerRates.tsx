import playerRatesInterface from '../interfaces/PlayerRatesInterface'

const PlayerRates = (rates: playerRatesInterface) => {
  return (
    <div className='bg-yellow-400'>
      {Object.entries(rates).map(([key, value]) => <div key={key}>{key}: {value}</div>)}
    </div>
  )
}

export default PlayerRates