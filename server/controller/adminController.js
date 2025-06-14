import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import Test from '../models/TestSchema.js';

//  Get all teacher applications
export const getAllTeacherApplications = async (req, res) => {
  try {
    const applications = await Teacher.find()
      .populate('user', 'name email role');

    res.status(200).json(applications);
  } catch (err) {
    console.error('Get teachers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Approve or reject a teacher application
export const updateTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Teacher.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: `Teacher ${status}`, teacher: updated });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalTests = await Test.countDocuments();

    res.status(200).json({
      students: totalStudents,
      teachers: totalTeachers,
      tests: totalTests
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllTestsWithTeacher = async (req, res) => {
  try {
    const tests = await Test.find().populate('teacher').populate({
      path: 'teacher',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

    res.status(200).json(tests);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAdminTestDetails = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ test });
  } catch (err) {
    console.error('Admin test details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
