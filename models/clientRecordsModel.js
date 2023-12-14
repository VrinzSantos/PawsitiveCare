const mongoose = require('mongoose');

const clientRecordsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  nameOfPet: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  petsBreed: {
    type: String,
    required: true,
  },
  petsSex: {
    type: String,
    required: true,
  },
  petsBirthdate: {
    type: Date,
    required: true,
  },
  petsHistory: {
      type: Array,
      required: false,
    },
  historyDate: {
    type: Array,
    required: false,
  },
  petsMedication: {
      type: Array ,
      required: false,
    },
  medicationDate: {
      type: Array,
      required: false,
    },
  nextVisit: {
    type: Date,
  },
});

const ClientRecord = mongoose.model('ClientRecord', clientRecordsSchema);

module.exports = ClientRecord;