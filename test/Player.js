function Player(args) {
  var id = args.id;
  var name = args.name;

  var batting = args.batting;
  var bowling = args.bowling;
  var fielding = args.fielding;

  var OUT = 0, ON_CREASE = 1, YET_TO_BAT = 2;

  var matchState = {
    status: YET_TO_BAT,
    isOnStrike: false,
    runs: 0,
    bowls: 0,
    fours: 0,
    sixes: 0,
    isBowling: false,
    ballsBowled: 0,
    overs: 0,
    wickets: 0,
    maidens: 0,
    economy: 0,
    noBalls: 0,
    wides: 0,
    legByes: 0
  };

  function isOut() {
    return matchState.status === OUT;
  }

  function giveOut() {
    matchState.status = OUT;
  }

  function isOnCrease() {
    return matchState.status === ON_CREASE;
  }

  function setOnCrease() {
    matchState.status = ON_CREASE;
  }

  function isYetToBat() {
    return matchState.status === YET_TO_BAT;
  }

  function isOnStrike() {
    return matchState.isOnStrike;
  }

  function setStrike(strike) {
    matchState.isOnStrike = strike;
  }

  function getStrikeRate() {
    return ((matchState.runs / matchState.bowls) * 100).toFixed(2);
  }

  function isBowling() {
    return matchState.isBowling;
  }

  function setAsBowling() {
    matchState.isBowling = true;
  }

  function setAsBowlingOver() {
    matchState.isBowling = false;
  }

  function getEconomy() {
    return (matchState.runs / (Math.floor(matchState.ballsBowled / 6))).toFixed(2);   // incomplete formula
  }

  function canBowlMore() {
    return matchState.ballsBowled < 55;   // one-day match, can bowl max of 10 overs
  }

  function getPrintableBatsmanStats() {
    var printableStats = name +
                          (isOnStrike() ? "* " : " ") +
                          matchState.runs + "(" + matchState.bowls + ") " +
                          "4s: " + matchState.fours + " " +
                          "6s: " + matchState.sixes + " " +
                          "SR: " + getStrikeRate();

    return printableStats;

  }

  function getPrintableBowlerStats() {
    var printableStats = name +
                          (isBowling() ? "* " : " ") +
                          Math.floor(matchState.ballsBowled / 6) + "." + (matchState.ballsBowled % 6 !== 0 ? matchState.ballsBowled % 6 : 0) + "-" +
                          matchState.maidens + "-" +
                          matchState.runs + "-" +
                          matchState.wickets + "-" + " " +
                          "Econ. " + getEconomy();

    return printableStats;
  }

  return {
    id: id,
    name: name,
    batting: batting,
    bowling: bowling,
    fielding: fielding,
    matchState: matchState,
    isOut: isOut,
    giveOut: giveOut,
    isOnCrease: isOnCrease,
    setOnCrease: setOnCrease,
    isYetToBat: isYetToBat,
    isOnStrike: isOnStrike,
    setStrike: setStrike,
    canBowlMore: canBowlMore,
    getPrintableBatsmanStats: getPrintableBatsmanStats,
    getPrintableBowlerStats: getPrintableBowlerStats
  };

}