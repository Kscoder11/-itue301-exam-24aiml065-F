import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true, min: [1, 'quantity must be at least 1'] },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'used'],
    default: 'booked',
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
