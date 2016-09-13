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
    getPrintableBatsmanStats: getPrintableBatsmanStats,
    getPrintableBowlerStats: getPrintableBowlerStats
  };

}

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

function Match(ground, team1, team2) {
  var HEADS = 0;
  var TAILS = 1;

  var BATTING = 0;
  var FIELDING = 1;

  var ground = ground;

  var team1 = team1;
  var team2 = team2;

  var teamBatting = null;
  var teamBowling = null;

  var innings = 1;  // values 1 & 2

  var overs = new Array(50);  // 2-d store of balls
  for (var i = 0; i < 50; i++) {
    overs[i] = new Array(6);
  };

  var ball = {
    batsman1: null,
    batsman2: null,
    bowler: null,
    count: 0,
    runs: 0,
    isWicket: false
  };

  var previousBowler = null;

  var viewModel = new ViewModel();

  function toss(team, call) {
    var winningCall = Math.random(0,1) < 0.5 ? HEADS : TAILS;

    return winningCall === call ? (team.id === team1.id ? team1 : team2) : (team.id === team1.id ? team2 : team1);
  }

  function tossAction(team, action) {
    if (action === BATTING) {
      teamBatting = (team.id === team1.id ? team1 : team2);
      teamBowling = (team.id === team1.id ? team2 : team1);
    } else {
      teamBowling = (team.id === team1.id ? team1 : team2);
      teamBatting = (team.id === team1.id ? team2 : team1);
    }
  }

  function play() {
    if (ball.count === 0) {
      selectBatsmen();
    }
    if (ball.count % 6 === 0) {
      startAnOver();
    }

    bowlABall();
  }

  function start(team, call) {
    var tossWonBy = toss(team, call);
    viewModel.updateTossInfo(tossWonBy);
    tossAction(tossWonBy, BATTING);

    viewModel.enablePlayField();
    viewModel.enablePlayButton();
    viewModel.bindKeys(play);
  }

  function selectBowler() {
    var selection = Math.ceil(Math.random(0,1) * 5) + 6;
    if (selection === previousBowler) {
      selectBowler();
    }

    ball.bowler = teamBowling.players[selection - 1];
    viewModel.updatePlayingPlayersInfo(ball, teamBatting, teamBowling);
  }

  function selectBatsmen() {
    if (!ball.batsman1 && !ball.batsman2) {
      assignOpeners();
    } else if (!ball.batsman1) {
      ball.batsman1 = selectNextBatsman(ball.batsman2);
      ball.batsman1.setOnCrease();
    } else {
      ball.batsman2 = selectNextBatsman(ball.batsman1);
      ball.batsman2.setOnCrease();
    }
  }

  function assignOpeners() {
    ball.batsman1 = teamBatting.players[0];
    ball.batsman1.setOnCrease();
    ball.batsman1.setStrike(true);

    ball.batsman2 = teamBatting.players[1];
    ball.batsman2.setOnCrease();
  }

  function selectNextBatsman(batsmanOnCrease) {
    var nextBatsman = null;

    teamBatting.players.some(function(player) {
      if (!player.isOut() && !player.isOnCrease()) {
        nextBatsman = player;
        return true;
      }

      return false;
    });

    return nextBatsman;
  }

  function changeStrike() {
    var temp = ball.batsman1;
    ball.batsman1 = ball.batsman2;
    ball.batsman2 = temp;

    ball.batsman1.setStrike(true);
    ball.batsman2.setStrike(false);

    viewModel.updatePlayingPlayersInfo(ball, teamBatting, teamBowling);
  }

  function startAnOver() {
    selectBowler();
  }

  function bowlABall() {
    ball.count++;
    ball.bowler.matchState.ballsBowled++;
    teamBatting.matchState.ballsBowled++;

    var result = getAResultForBall(2, ball.batsman1.batting.aggression);
    
    if (result !== 7) {
      ball.runs = result;
      ball.bowler.matchState.runs += result;
      teamBatting.matchState.runs += result;
    } else {
      ball.runs = 0;
      ball.isWicket = true;
      ball.batsman1.giveOut();

      ball.bowler.matchState.runs += 0;
      ball.bowler.matchState.wickets += 1;

      // update team's score
      teamBatting.matchState.runs += 0;
      teamBatting.matchState.wickets += 1;
    }

    ball.batsman1.matchState.runs += ball.runs;
    ball.batsman1.matchState.bowls++;

    if (ball.runs !== 0 && ball.runs % 4 === 0) {
      ball.batsman1.matchState.fours++;
    }

    if (ball.runs !== 0 &&  ball.runs % 6 === 0) {
      ball.batsman1.matchState.sixes++;
    }

    overs[Math.ceil(ball.count / 6) - 1][ball.count % 6 !== 0 ? ball.count % 6 : 6] = Object.assign({}, ball);

    viewModel.printBall(ball);
    viewModel.updatePlayingPlayersInfo(ball, teamBatting, teamBowling);

    if (ball.runs % 2 !== 0) {
      changeStrike();
    }

    if (ball.isWicket) {
      selectBatsmen();
      ball.isWicket = false;
    }

  }

  function getAResultForBall(aggressionMode, aggressionBatsman) {
    var EXTRA_DEFENSIVE = 0;
    var DEFENSIVE = 1;
    var NORMAL = 2;
    var AGGRESSIVE = 3;
    var ALL_OUT_ATTACK = 4;

    var results = new Array(5);

    var possibleOutcomes = [0, 1, 2, 3, 4, 6, 7];
    // probabilistic frequency of result in order [0, 1, 2, 3, 4, 6, W]
    results[EXTRA_DEFENSIVE]  = [10, 10, 8, 4, 2, 1, 1];
    results[DEFENSIVE]        = [8, 8, 8, 4, 2, 1, 1];
    results[NORMAL]           = [35, 51, 5, 1, 6, 2, 2];
    results[AGGRESSIVE]       = [5, 8, 10, 9, 14, 15, 2];
    results[ALL_OUT_ATTACK]   = [2, 6, 8, 10, 15, 18, 3];

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomItem(list, weight) {
      var totalWeight = weight.reduce(function (prev, cur, i, arr) {
        return prev + cur;
      });
       
      var randomNumber = rand(0, totalWeight);
      var weightSum = 0;
       
      for (var i = 0; i < list.length; i++) {
        weightSum += weight[i];
        weightSum = +weightSum.toFixed(2);
         
        if (randomNumber <= weightSum) {
          return list[i];
        }
      }
       
      // end of function
    }

    var adjustedWeights = [ ];
    results[aggressionMode].forEach(function(weight, index){
      adjustedWeights[index] = parseFloat((weight * 100 / aggressionBatsman).toFixed(2));
    });
    console.log(adjustedWeights);

    var result = getRandomItem(possibleOutcomes, adjustedWeights);
     
    return result;
  }

  return {
    toss: toss,
    tossAction: tossAction,
    play: play,
    start: start,
    selectBowler: selectBowler
  };
}

function Ball() {

}

function ViewModel() {
  function updateTossInfo(winningTeam) {
    document.getElementById("cs-toss-info").innerText = winningTeam.name + " has won the toss. They are batting first";
  }

  function enablePlayField() {
    document.getElementById("cs-playfield").style.display = "block";
  }

  function enablePlayButton() {
    document.getElementById("cs-play").style.display = "block";
  }

  function bindKeys(callback) {
    document.onkeypress = function(event) {
      if (event.keyCode === 32) {
        callback();
      }
    };
  }

  function updatePlayingPlayersInfo(ball, teamBatting, teamBowling) {
    document.getElementById("cs-playfield-scorecard").innerHTML = "<h3>Score: </h3> <br/>" + 
                                                                  teamBatting.name + " " +
                                                                  teamBatting.getPrintableScore();

    var bowlerPrintable = "<h3>Bowlers:</h3> <br/>";

    for (var i = 0; i < 5; i++) {
      bowlerPrintable += teamBowling.players[i + 6].getPrintableBowlerStats() + "<br/>";
    }

    document.getElementById("cs-playfield-bowler-details").innerHTML = bowlerPrintable;

    document.getElementById("cs-playfield-batsmen-details").innerHTML = "<h3>Batsmen:</h3> <br/>" +
                                                                        ball.batsman1.getPrintableBatsmanStats() + "<br/>" +
                                                                        ball.batsman2.getPrintableBatsmanStats();
  }

  function printBall(ball) {
    var playfield = document.getElementById("cs-playfield-over-details");

    var ballNode = document.createElement("span");
    ballNode.innerHTML = (ball.isWicket ? "W" : ball.runs) + "&nbsp;&nbsp";

    playfield.appendChild(ballNode);

    var breakLineNode = document.createElement("br");

    if (ball.count !== 0 && (ball.count % 6) === 0) {
      playfield.appendChild(breakLineNode);
    }
  }

  return {
    updateTossInfo: updateTossInfo,
    enablePlayField: enablePlayField,
    enablePlayButton: enablePlayButton,
    bindKeys: bindKeys,
    updatePlayingPlayersInfo: updatePlayingPlayersInfo,
    printBall: printBall
  };
}


/**
 * Data
 */
var players_india = [
  {
    id: 1,
    name: "Shikhar Dhawan",
    batting: {
      skill: 83,
      aggression: 87,
      defense: 79
    },
    bowling: {
      skill: 10
    },
    fielding: {
      skill: 78
    }
  },
  {
    id: 2,
    name: "Rohit Sharma",
    batting: {
      skill: 92,
      aggression: 88,
      defense: 89
    },
    bowling: {
      skill: 25
    },
    fielding: {
      skill: 84
    }
  },
  {
    id: 3,
    name: "Virat Kohli",
    batting: {
      skill: 93,
      aggression: 89,
      defense: 95
    },
    bowling: {
      skill: 28
    },
    fielding: {
      skill: 91
    }
  },
  {
    id: 4,
    name: "Ajinkya Rahane",
    batting: {
      skill: 88,
      aggression: 80,
      defense: 95
    },
    bowling: {
      skill: 5
    },
    fielding: {
      skill: 89
    }
  },
  {
    id: 5,
    name: "Manish Pandey",
    batting: {
      skill: 84,
      aggression: 88,
      defense: 81
    },
    bowling: {
      skill: 3
    },
    fielding: {
      skill: 90
    }
  },
  {
    id: 6,
    name: "M. S. Dhoni",
    batting: {
      skill: 84,
      aggression: 94,
      defense: 80
    },
    bowling: {
      skill: 5
    },
    fielding: {
      skill: 90
    }
  },
  {
    id: 7,
    name: "R. Ashwin",
    batting: {
      skill: 70,
      aggression: 71,
      defense: 72
    },
    bowling: {
      skill: 93
    },
    fielding: {
      skill: 70
    }
  },
  {
    id: 8,
    name: "Ravindra Jadeja",
    batting: {
      skill: 65,
      aggression: 86,
      defense: 74
    },
    bowling: {
      skill: 79
    },
    fielding: {
      skill: 95
    }
  },
  {
    id: 9,
    name: "Bhuvaneshwar Kumar",
    batting: {
      skill: 62,
      aggression: 65,
      defense: 70
    },
    bowling: {
      skill: 85
    },
    fielding: {
      skill: 80
    }
  },
  {
    id: 10,
    name: "Mohammad Shami",
    batting: {
      skill: 30,
      aggression: 90,
      defense: 31
    },
    bowling: {
      skill: 89
    },
    fielding: {
      skill: 75
    }
  },
  {
    id: 11,
    name: "Jasprit Bumrah",
    batting: {
      skill: 24,
      aggression: 50,
      defense: 23
    },
    bowling: {
      skill: 85
    },
    fielding: {
      skill: 74
    }
  }
];

var players_sa = [
  {
    id: 12,
    name: "Hashim Amla",
    batting: {
      skill: 92,
      aggression: 86,
      defense: 95
    },
    bowling: {
      skill: 3
    },
    fielding: {
      skill: 82
    }
  },
  {
    id: 13,
    name: "Quinton De Kock",
    batting: {
      skill: 86,
      aggression: 91,
      defense: 84
    },
    bowling: {
      skill: 3
    },
    fielding: {
      skill: 87
    }
  },
  {
    id: 14,
    name: "FaF Du Plessis",
    batting: {
      skill: 87,
      aggression: 86,
      defense: 87
    },
    bowling: {
      skill: 30
    },
    fielding: {
      skill: 90
    }
  },
  {
    id: 15,
    name: "A B DeVilliers",
    batting: {
      skill: 93,
      aggression: 92,
      defense: 94
    },
    bowling: {
      skill: 25
    },
    fielding: {
      skill: 93
    }
  },
  {
    id: 16,
    name: "Jean Paul Duminy",
    batting: {
      skill: 83,
      aggression: 85,
      defense: 84
    },
    bowling: {
      skill: 65
    },
    fielding: {
      skill: 84
    }
  },
  {
    id: 17,
    name: "David Miller",
    batting: {
      skill: 75,
      aggression: 95,
      defense: 73
    },
    bowling: {
      skill: 29
    },
    fielding: {
      skill: 85
    }
  },
  {
    id: 18,
    name: "Chris Morris",
    batting: {
      skill: 69,
      aggression: 86,
      defense: 68
    },
    bowling: {
      skill: 81
    },
    fielding: {
      skill: 75
    }
  },
  {
    id: 19,
    name: "Dale Steyn",
    batting: {
      skill: 48,
      aggression: 80,
      defense: 49
    },
    bowling: {
      skill: 93
    },
    fielding: {
      skill: 86
    }
  },
  {
    id: 20,
    name: "Kagiso Rabada",
    batting: {
      skill: 37,
      aggression: 54,
      defense: 42
    },
    bowling: {
      skill: 89
    },
    fielding: {
      skill: 84
    }
  },
  {
    id: 21,
    name: "Morne Morkel",
    batting: {
      skill: 21,
      aggression: 50,
      defense: 20
    },
    bowling: {
      skill: 86
    },
    fielding: {
      skill: 82
    }
  },
  {
    id: 22,
    name: "Imran Tahir",
    batting: {
      skill: 18,
      aggression: 73,
      defense: 18
    },
    bowling: {
      skill: 84
    },
    fielding: {
      skill: 74
    }
  }
];

/**
 * Simulation
 */
var team_india = new Team(1, "INDIA", players_india);
var team_sa = new Team(2, "SOUTH AFRICA", players_sa);

var match = new Match("Wankhede", team_india, team_sa);