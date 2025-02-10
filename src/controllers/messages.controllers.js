const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');

exports.findAll = async (req, res) => {
  try {
    // const { page, size, from, to, sortby, sortdir, searchvalue } = req.query;
    const { page, size } = req.query;
    const { limit } = getPagination(page, size);
    const data = await db.messages.findAndCountAll({});
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
};
