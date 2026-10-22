import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Attendee name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Attendee email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, trim: true },
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;
