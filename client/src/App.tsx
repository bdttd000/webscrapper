import { useEffect, useState } from "react";
import leagueInterface from "./interfaces/LeagueInterface";
import League from "./components/League";

const App = () => {
  const [lvbetData, setLvbetData] = useState<leagueInterface[] | undefined>();
  const [sports888Data, setSports888Data] = useState<
    leagueInterface[] | undefined
  >();
  // const [comparedData, setComparedData] = useState<
  //   leagueInterface[] | undefined
  // >();
  const [content, setContent] = useState<string>("Wszystko zostało załadowane");

  useEffect(() => {
    fetch("/api/lvbet")
      .then((resonse) => resonse.json())
      .then((data) => {
        setLvbetData(data);
      });

    fetch("/api/sports888")
      .then((resonse) => resonse.json())
      .then((data) => {
        setSports888Data(data);
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

  const fetchSports888Api = async (data: any): Promise<void> => {
    setContent("Pobieranie api z sports888");

    await fetch("/api/sports888/update")
      .then((resonse) => resonse.json())
      .then((data) => {
        setSports888Data(data);
      });

    setContent("Api zostało załadowane");
  };

  const fetchComparedData = async (data: any): Promise<void> => {
    setContent("Pobieranie porównanych danych");

    await fetch("/api/compare");
    // .then((resonse) => resonse.json())
    // .then((data) => {
    //   setComparedData(data);
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
          onClick={fetchSports888Api}
        >
          Fetch 888sports Api
        </div>
        <div
          className="bg-gray-800 m-2 p-2 rounded w-fit cursor-pointer"
          onClick={fetchComparedData}
        >
          Porównaj dane
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
            sports888
          </div>
          {sports888Data
            ? sports888Data.map((league, index) => (
                <League {...league} key={index} />
              ))
            : "Data not found"}
        </div>
        <div className="w-1/3">
          <div className="bg-blue-950 m-2 p-2 text-center rounded">...</div>
          {/* {comparedData
            ? comparedData.map((league, index) => (
                <League {...league} key={index} />
              ))
            : "Data not found"} */}
        </div>
      </div>
    </div>
  );
};

export default App;
