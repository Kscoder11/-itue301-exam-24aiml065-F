import express from 'express';
import Event from '../models/Event.js';

const eventRouter = express.Router();

// GET /api/v1/events (public)
eventRouter.get('/', async (req, res, next) => {
  try {
    const allEvents = await Event.find().sort({ date: 1 });
    res.json(allEvents);
  } catch (error) {
    next(error);
  }
});

export default eventRouter;
