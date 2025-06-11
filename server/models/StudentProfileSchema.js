import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  grade: String,
  institution: String,
  rollNo: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('StudentProfile', StudentProfileSchema);