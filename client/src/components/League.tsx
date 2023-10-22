import leagueInterface from '../interfaces/LeagueInterface'
import Match from './Match'

const League = ({_id, leagueName, matches}: leagueInterface) => {
  return (
    <div>
          {leagueName}
          {matches.map(match => <Match {...match}/> )}
    </div>
  )
}

export default League