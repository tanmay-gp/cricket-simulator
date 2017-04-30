function ViewModel() {
  function updateTossInfo(winningTeam) {
    document.getElementById("cs-toss-controls").style.display = "none";

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

  function bindModeSelect(callback) {
    document.getElementById("cs-select-mode").addEventListener("change", function(event) {
      callback(parseInt(event.currentTarget.value));
    });
  }

  function updatePlayingPlayersInfo(ball, teamBatting, teamBowling) {
    /**
     * Printable batsmen's stats block
     */
    var batsmanPrintable = "<h3>Scorecard:</h3> <br/>";

    for (var i = 0; i < 11; i++) {
      batsmanPrintable += teamBatting.players[i].getPrintableBatsmanStats() + "<br/>";
    }

    document.getElementById("cs-playfield-scorecard").innerHTML = batsmanPrintable + 
                                                                  "<h3>Score: </h3> <br/>" + 
                                                                  teamBatting.name + " " +
                                                                  teamBatting.getPrintableScore();


    /**
     * Printable bowlers' stats block
     */
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
    bindModeSelect: bindModeSelect,
    updatePlayingPlayersInfo: updatePlayingPlayersInfo,
    printBall: printBall
  };
}