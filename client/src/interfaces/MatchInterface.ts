import playerInterface from "./PlayerInterface";

export default interface matchInterface {
  matchName: string;
  matchDate: string;
  matchTime: string;
  players: playerInterface[];
}
