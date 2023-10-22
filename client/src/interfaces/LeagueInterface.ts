import matchInterface from "./MatchInterface";

export default interface leagueInterface {
  _id: string;
  leagueName: string;
  matches: matchInterface[];
}
