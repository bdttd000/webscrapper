import {useEffect, useState} from 'react'
import leagueInterface from './interfaces/LeagueInterface'
import League from './components/League';

const App = () => {
  const [backendData, setBackendData] = useState<leagueInterface[] | undefined>();

  useEffect(() => {
    fetch("/api").then(
      resonse => resonse.json()
    ).then(
      data => {
        setBackendData(data);
      }
    )
  }, [])

  return (
    <div>
      {backendData ? backendData.map((league) => 
        <League 
        {...league}
        />
      ) : 'Data not found'}
    </div>
  )
}

export default App