function Team(id, name, playersArray) {
  var id = id;
  var name = name;
  var players = [ ];

  playersArray.forEach(function(player) {
    players.push(new Player(player));
  });

  var matchState = {
    runs: 0,
    wickets: 0,
    ballsBowled: 0
  };

  function setRuns(runs) {
    matchState.runs = runs;
  }

  function getRuns() {
    return matchState.runs;
  }

  function setWickets(wickets) {
    matchState.wickets = wickets;
  }

  function getWickets() {
    return matchState.wickets;
  }

  function setBallsBowled(balls) {
    matchState.ballsBowled = balls;
  }

  function getOvers() {
    return Math.floor(matchState.ballsBowled / 6) + "." + (matchState.ballsBowled % 6);
  }

  function getRunRate() {
    return (getRuns() / parseFloat(getOvers())).toFixed(2);
  }

  function getPrintableScore() {
    return getRuns() + " / " + getWickets() + "    Overs: " + getOvers() + "    RR: " + getRunRate();
  }

  return {
    id: id,
    name: name,
    players: players,
    matchState: matchState,
    setRuns: setRuns,
    getRuns: getRuns,
    setWickets: setWickets,
    getWickets: getWickets,
    getPrintableScore: getPrintableScore
  };
}