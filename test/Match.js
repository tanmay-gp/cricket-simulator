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

  var AGGRESSION_MODE = 2;

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

    if (ball.count % 6 === 0 && ball.count < (50 - 1) * 6 + 1) {
      startAnOver();
    }

    if (ball.count < (50 * 6)) {
      bowlABall();
    }

    return;
  }

  function start(team, call) {
    var tossWonBy = toss(team, call);
    viewModel.updateTossInfo(tossWonBy);
    tossAction(tossWonBy, BATTING);

    viewModel.enablePlayField();
    viewModel.enablePlayButton();
    viewModel.bindKeys(play);
    viewModel.bindModeSelect(setAggressionMode);
  }

  function selectBowler() {
    var selection = Math.ceil(Math.random(0,1) * 5) + 6;
    if (selection === previousBowler) {
      selectBowler();
    }

    // check if can bowl more overs
    var selectedBowler = teamBowling.players[selection - 1];
    if (selectedBowler.canBowlMore()) {
      ball.bowler = selectedBowler;
      viewModel.updatePlayingPlayersInfo(ball, teamBatting, teamBowling);
      return;
    } else {
      selectBowler();
    }
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

  function setAggressionMode(aggressionMode) {
    if (aggressionMode > -1 && aggressionMode < 5) {
      AGGRESSION_MODE = aggressionMode;
    }
  }

  function bowlABall() {
    ball.count++;
    ball.bowler.matchState.ballsBowled++;
    teamBatting.matchState.ballsBowled++;

    var result = getAResultForBall(AGGRESSION_MODE, ball.batsman1.batting, ball.bowler.bowling);
    
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

  function getAResultForBall(aggressionMode, batsmanSkills, bowlerSkills) {
    var EXTRA_DEFENSIVE = 0;
    var DEFENSIVE = 1;
    var NORMAL = 2;
    var AGGRESSIVE = 3;
    var ALL_OUT_ATTACK = 4;

    var results = new Array(5);

    var possibleOutcomes = [0, 1, 2, 3, 4, 6, 7];
    // probabilistic frequency of result in order [0, 1, 2, 3, 4, 6, W]
    // TODO: Still experimental
    results[EXTRA_DEFENSIVE]  = [10, 10, 8, 4, 2, 1, 1];
    results[DEFENSIVE]        = [8, 8, 8, 4, 2, 1, 1];
    results[NORMAL]           = [35, 51, 5, 1, 6, 2, 2];
    results[AGGRESSIVE]       = [33, 40, 5, 2, 8, 2, 2.2];
    results[ALL_OUT_ATTACK]   = [15, 6, 8, 10, 8, 10, 10];

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

    function normalizeAdjustment(adjustment) {
      if (adjustment < 0) {
        adjustment = Math.abs(adjustment) > 50 ? 100 - Math.abs(adjustment) : Math.abs(adjustment);
      }

      return adjustment;
    }

    var adjustedWeights = [ ];
    results[aggressionMode].forEach(function(weight, index){
      var adjustment = (batsmanSkills.skill + batsmanSkills.aggression - bowlerSkills.skill);
      adjustment = normalizeAdjustment(adjustment);
      switch(index) {
        case 0:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression * 2 - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 1:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 2:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 3:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression * 1.1 - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 4:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression * 1.5 - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 5:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression * 2 - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
        case 6:
          adjustment = (batsmanSkills.skill + batsmanSkills.aggression * 1.25 - bowlerSkills.skill);
          adjustment = normalizeAdjustment(adjustment);
          adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
          break;
      }
      //adjustedWeights[index] = parseFloat((weight * (adjustment / 1)).toFixed(2));
    });
    //console.log(adjustedWeights);

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