import { useEffect, useState } from "react";
import leagueInterface from "./interfaces/LeagueInterface";
import League from "./components/League";

const App = () => {
  const [backendData, setBackendData] = useState<
    leagueInterface[] | undefined
  >();
  const [content, setContent] = useState<string>("Wszystko zostało załadowane");

  useEffect(() => {
    fetch("/api/lvbet")
      .then((resonse) => resonse.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  const getNewApi = async (data: any): Promise<void> => {
    setContent("Ładowanie...");

    await fetch("/updateApi")
      .then((resonse) => resonse.json())
      .then((data) => {
        setBackendData(data);
      });

    setContent("Wszystko zostało załadowane");
  };

  return (
    <div className="bg-black min-h-screen p-2 text-white">
      <div className="flex">
        <div
          className="bg-gray-800 m-2 p-2 rounded w-fit cursor-pointer"
          onClick={getNewApi}
        >
          Fetch api lvbet
        </div>
        <div
          className="bg-gray-800 m-2 p-2 rounded w-fit cursor-pointer"
          onClick={getNewApi}
        >
          fetch new api
        </div>
      </div>
      <div className="bg-blue-700 m-2 p-2 rounded w-fit">{content}</div>
      {backendData
        ? backendData.map((league, index) => <League {...league} key={index} />)
        : "Data not found"}
    </div>
  );
};

export default App;
