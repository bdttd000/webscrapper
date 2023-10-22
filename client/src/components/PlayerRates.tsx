import playerRatesInterface from '../interfaces/PlayerRatesInterface'

const PlayerRates = (rates: playerRatesInterface) => {
  return (
    <span>
      {Object.entries(rates).map(([key, value]) => <div>{key}: {value}</div>)}
    </span>
  )
}

export default PlayerRates