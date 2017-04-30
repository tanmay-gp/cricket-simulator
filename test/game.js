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