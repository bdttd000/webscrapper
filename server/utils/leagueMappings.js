const leagueMappings = {
    // sports888
    'English Premier League': 'EPL',
    'Spanish La Liga': 'LaLiga',
};

export const normalizeLeagueName = (leagueName) => {
    return leagueMappings[leagueName] || leagueName;
}