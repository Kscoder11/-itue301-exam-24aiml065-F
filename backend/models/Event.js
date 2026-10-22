import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Event title is required'], trim: true },
  category: { type: String, trim: true },
  date: { type: Date, required: [true, 'Event date is required'] },
  venue: { type: String, required: [true, 'Event venue is required'], trim: true },
  ticketsAvailable: {
    type: Number,
    required: [true, 'ticketsAvailable is required'],
    min: [0, 'ticketsAvailable cannot be negative'],
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
