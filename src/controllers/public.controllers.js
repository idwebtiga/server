const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');

exports.version = async (req, res) => {
  try {
    return res.status(200).send({
      version: '1.0.0'
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
};
