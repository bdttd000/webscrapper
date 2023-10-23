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
    <div className='bg-black min-h-screen p-2 text-white'>
      {backendData ? backendData.map((league, index) => 
        <League {...league} key={index}/>
      ) : 'Data not found'}
    </div>
  )
}

export default App