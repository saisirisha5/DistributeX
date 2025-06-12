import mongoose from 'mongoose';
const { Schema } = mongoose;

const Teacher = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  qualifications: {
    type: String,
    required: true,
  },
  subjects: [{
    type: String,
    required: true,
  }],
  bio: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Teacher', Teacher);
