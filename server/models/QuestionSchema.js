import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  test: {
    type: Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'short', 'blank'],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [String], // for MCQs
  correctAnswer: String,
  marks: {
    type: Number,
    default: 1,
  },
  isAI: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
