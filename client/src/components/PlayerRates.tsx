import playerRatesInterface from '../interfaces/PlayerRatesInterface'

const PlayerRates = (rates: playerRatesInterface) => {
  return (
    <div className='bg-gray-500 m-2 p-2 rounded'>
      {Object.entries(rates).map(([key, value]) => <div key={key}>{key}: {value}</div>)}
    </div>
  )
}

export default PlayerRates