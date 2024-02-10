import { useEffect, useState } from "react";
import leagueInterface from "./interfaces/LeagueInterface";
import League from "./components/League";

const App = () => {
  const [lvbetData, setLvbetData] = useState<leagueInterface[] | undefined>();
  const [content, setContent] = useState<string>("Wszystko zostało załadowane");

  useEffect(() => {
    fetch("/api/lvbet")
      .then((resonse) => resonse.json())
      .then((data) => {
        setLvbetData(data);
      });
  }, []);

  const fetchLvbetApi = async (data: any): Promise<void> => {
    setContent("Pobieranie api z lvbet...");

    await fetch("/api/lvbet/update")
      .then((resonse) => resonse.json())
      .then((data) => {
        setLvbetData(data);
      });

    setContent("Api zostało załadowane");
  };

  const fetch888sportsApi = async (data: any): Promise<void> => {
    setContent("Pobieranie api z 888sports");

    await fetch("/api/888sports/update")
      .then((resonse) => resonse.json())
      .then((data) => console.log(data));
    // .then((data) => {
    //   setBackendData(data);
    // });

    setContent("Api zostało załadowane");
  };

  return (
    <div className="bg-black min-h-screen p-2 text-white">
      <div className="flex">
        <div
          className="bg-gray-800 m-2 p-2 rounded w-fit cursor-pointer"
          onClick={fetchLvbetApi}
        >
          Fetch Lvbet Api
        </div>
        <div
          className="bg-gray-800 m-2 p-2 rounded w-fit cursor-pointer"
          onClick={fetch888sportsApi}
        >
          Fetch 888sports Api
        </div>
      </div>
      <div className="bg-blue-700 m-2 p-2 rounded w-fit">{content}</div>
      <div className="flex flex-row">
        <div className="w-1/3">
          <div className="bg-blue-950 m-2 p-2 text-center rounded">LVBET</div>
          {lvbetData
            ? lvbetData.map((league, index) => (
                <League {...league} key={index} />
              ))
            : "Data not found"}
        </div>
        <div className="w-1/3">
          <div className="bg-blue-950 m-2 p-2 text-center rounded">
            888sports
          </div>
          {/* {lvbetData
            ? lvbetData.map((league, index) => (
                <League {...league} key={index} />
              ))
            : "Data not found"} */}
        </div>
        <div className="w-1/3">
          <div className="bg-blue-950 m-2 p-2 text-center rounded">...</div>
          {/* {lvbetData
            ? lvbetData.map((league, index) => (
                <League {...league} key={index} />
              ))
            : "Data not found"} */}
        </div>
      </div>
    </div>
  );
};

export default App;
