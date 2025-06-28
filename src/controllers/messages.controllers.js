const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');

exports.findAll = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { offset, limit } = getPagination(page, size);
    const data = await db.messages.findAndCountAll({ offset, limit });
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
};

// Create a new message
exports.create = async (req, res) => {
  try {
    const { message } = req.body; // Extract content from the request body

    // Validate the input
    if (!message) {
      throw new Error('message cannot be empty!');
    }

    // Create a new message in the database
    const newMessage = await db.messages.create({ message });

    // Return the created message
    return res.status(201).send(newMessage);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'An error occurred while creating the message.',
    });
  }
};
