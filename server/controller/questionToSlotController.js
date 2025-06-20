import Test from '../models/TestSchema.js';
import Question from '../models/QuestionSchema.js';

export const addQuestionToSlot = async (req, res) => {
  try {
    const { testId, dateIndex, slotIndex } = req.params;
    const { type, questionText, options, correctAnswer, marks } = req.body;

    // Step 1: Validate
    if (!['mcq', 'short', 'blank'].includes(type)) {
      return res.status(400).json({ message: 'Invalid question type.' });
    }

    // Step 2: Find test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found.' });

    // Step 3: Create question
    const question = new Question({
      test: testId,
      type,
      questionText,
      options: type === 'mcq' ? options : [],
      correctAnswer,
      marks: marks || 1,
      isAI: false,
    });

    await question.save();

    // Step 4: Push to slot
    test.dateSlots[dateIndex].slots[slotIndex].questions.push(question._id);
    await test.save();

    return res.status(201).json({ message: 'Question added successfully.', question });
  } catch (err) {
    console.error('Error adding question to slot:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    await Question.findByIdAndDelete(questionId);
    res.status(200).json({ message: 'Question deleted.' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTestQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const questions = await Question.find({ test: testId });
    res.status(200).json({ questions });
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
