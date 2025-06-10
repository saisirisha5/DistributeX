import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'teacher', 'student'],
    lowercase: true,
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);