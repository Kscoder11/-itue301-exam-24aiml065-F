import 'dotenv/config';
import mongoose from 'mongoose';
import Event from './models/Event.js';

const sampleEvents = [
  { title: 'React Summit', category: 'Tech', date: new Date('2026-09-10'), venue: 'CSPIT Auditorium', ticketsAvailable: 50 },
  { title: 'Jazz Night', category: 'Music', date: new Date('2026-09-15'), venue: 'City Arena', ticketsAvailable: 20 },
  { title: 'Startup Pitch Day', category: 'Business', date: new Date('2026-10-01'), venue: 'Innovation Hub', ticketsAvailable: 0 },
  { title: 'Cricket Finals', category: 'Sports', date: new Date('2026-10-12'), venue: 'National Stadium', ticketsAvailable: 100 },
];

await mongoose.connect(process.env.MONGO_URI);
await Event.deleteMany({});
await Event.insertMany(sampleEvents);
console.log('Seeded sample events');
await mongoose.disconnect();
