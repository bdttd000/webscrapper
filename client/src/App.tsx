import React, {useEffect, useState} from 'react'

interface User {
  users: string[];
}

const App = () => {
  const [backendData, setBackendData] = useState<User>({users: []})

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
        {(typeof backendData.users === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.users.map((user, i) => 
            <p key={i}>{user}</p>
        ))}
    </div>
  )
}

export default App