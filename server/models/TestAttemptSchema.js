import mongoose from 'mongoose';

const TestAttemptSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['enrolled', 'approved', 'completed'], default: 'enrolled' },
  score: Number,
  passed: Boolean,
  certificateUrl: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'not_required'], default: 'not_required' }
}, { timestamps: true });

export default mongoose.model('TestAttempt', TestAttemptSchema);