import express from 'express';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import authGuard from '../middleware/authGuard.js';

const ticketRouter = express.Router();

const ALLOWED_TICKET_STATUSES = ['booked', 'cancelled', 'used'];

// Every endpoint in this file requires a valid JWT
ticketRouter.use(authGuard);

// POST /api/v1/tickets  -> book tickets
ticketRouter.post('/', async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const requestedQuantity = Number(req.body.quantity);

    if (!eventId) {
      return res.status(400).json({ success: false, error: 'Validation failed', message: 'eventId is required' });
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'quantity must be a whole number of at least 1',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.ticketsAvailable < requestedQuantity) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: `Requested ${requestedQuantity} tickets, but only ${event.ticketsAvailable} are available`,
        details: {
          requested: requestedQuantity,
          available: event.ticketsAvailable,
        },
      });
    }

    // Atomic decrement: the filter re-checks availability so the count can never go negative
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: event._id, ticketsAvailable: { $gte: requestedQuantity } },
      { $inc: { ticketsAvailable: -requestedQuantity } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Tickets were just sold out by another booking. Please refresh and try again',
      });
    }

    const newTicket = await Ticket.create({
      attendeeId: req.user.id,
      eventId: event._id,
      quantity: requestedQuantity,
    });

    res.status(201).json({ success: true, ticket: newTicket });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tickets/my -> tickets of the logged-in attendee
ticketRouter.get('/my', async (req, res, next) => {
  try {
    const myTickets = await Ticket.find({ attendeeId: req.user.id })
      .populate('attendeeId', 'name email')
      .populate('eventId', 'title date venue');

    res.json(myTickets);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/tickets/:id/status -> update ticket status
ticketRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_TICKET_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: `status must be one of: ${ALLOWED_TICKET_STATUSES.join(', ')}`,
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    const isOwner = ticket.attendeeId.toString() === req.user.id;
    const isOrganizer = req.user.role === 'organizer';

    if (!isOwner && !isOrganizer) {
      return res.status(403).json({ success: false, error: 'Forbidden: you cannot modify this ticket' });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
});

export default ticketRouter;
