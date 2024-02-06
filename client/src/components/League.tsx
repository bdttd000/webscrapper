import React, { useState } from "react";
import leagueInterface from "../interfaces/LeagueInterface";
import Match from "./Match";

const League = ({ _id, leagueName, matches }: leagueInterface) => {
  const [isShown, setIsShown] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsShown((current) => !current);
  };

  return (
    <div className="bg-gray-800 m-2 p-2 rounded">
      <p onClick={handleClick} className="cursor-pointer">
        {leagueName}
      </p>
      <div style={{ display: isShown ? "block" : "none" }}>
        {matches.map((match, index) => (
          <Match {...match} key={index} />
        ))}
      </div>
    </div>
  );
};

export default League;
