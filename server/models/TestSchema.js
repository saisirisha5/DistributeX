import mongoose from 'mongoose';
const { Schema } = mongoose;

const slotSchema = new Schema({
  startTime: String,
  endTime: String,
  limit: Number,
  enrolled: {
    type: Number,
    default: 0,
  },
});

const dateSlotSchema = new Schema({
  date: Date,
  slots: [slotSchema],
});

const placeSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: Number },  
  lng: { type: Number },
});

const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  threshold: {
    type: Number,
    required: true,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  dateSlots: [dateSlotSchema],
  places: [placeSchema],
}, { timestamps: true });

export default mongoose.model('Test', TestSchema);
