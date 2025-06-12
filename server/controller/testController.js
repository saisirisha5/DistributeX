import TestSchema from '../models/TestSchema.js';
import Teacher from '../models/Teacher.js';

export const createTest = async (req, res) => {
  try {
    const { name, isPremium, threshold, dateSlots, places } = req.body;

    // Find teacher record for this user
    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher || teacher.status !== 'accepted') {
      return res.status(403).json({ message: 'Only accepted teachers can create tests.' });
    }

    const test = new TestSchema({
      name,
      teacher: teacher._id,
      isPremium,
      threshold,
      dateSlots,
      places,
    });

    await test.save();

    res.status(201).json({ message: 'Test created successfully.', test });
  } catch (err) {
    console.error('Create test error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getMyTests = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher || teacher.status !== 'accepted') {
      return res.status(403).json({ message: 'Only accepted teachers can view tests.' });
    }

    const tests = await TestSchema.find({ teacher: teacher._id });

    res.status(200).json({ tests });
  } catch (err) {
    console.error('Get my tests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTestDetails = async (req, res) => {
  try {
    const test = await TestSchema.findById(req.params.id).populate('teacher');

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ test });
  } catch (err) {
    console.error('Get test details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};