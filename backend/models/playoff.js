const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const playoffSchema = new Schema({

  year: {
    type: String,
    required: true,
  },

  westernConference: {
    quarterfinals: [{
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }],
    semifinals: [{
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }],
    finals: {
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }
  },

  finals: {
    westernTeam: {
      type: String,
    },
    easternTeam: {
      type: String,
    },
    games: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'game',
    }

  },

  easternConference: {
    quarterfinals: [{
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }],
    semifinals: [{
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }],
    finals: {
      team1: {
        type: String,
      },
      team2: {
        type: String,
      },
      games: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'game',
      },
    }
  }

  }, {
    timestamps: true,
  });
const playoff = mongoose.model('playoff', playoffSchema);
module.exports = playoff;