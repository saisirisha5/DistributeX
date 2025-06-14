import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import Test from '../models/TestSchema.js';
import TestAttempt from '../models/TestAttemptSchema.js';
import StudentProfile from '../models/StudentProfileSchema.js';

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


// ✅ GET: /admin/test/:id/enrollments
export const getAdminTestEnrolledDetails = async (req, res) => {
  try {
    const testId = req.params.id;

    const test = await Test.findById(testId).populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email' },
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const attempts = await TestAttempt.find({ test: testId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    const studentUserIds = attempts.map((a) => a.student._id);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });

    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const enrolledData = attempts.map((attempt) => {
      const student = attempt.student;
      const profile = profileMap[student._id.toString()] || {};

      return {
        student: {
          name: student.name,
          email: student.email,
          rollNo: profile.rollNo || 'N/A',
          grade: profile.grade || 'N/A',
          institution: profile.institution || 'N/A',
        },
        status: attempt.status,
        enrolledAt: attempt.createdAt,
        selectedDate: attempt.selectedDate,
        selectedSlot: attempt.selectedSlot,
        selectedPlace: attempt.selectedPlace,
        paymentStatus: attempt.paymentStatus,
      };
    });

    const remainingSlots = test.threshold - test.enrolledCount;

    res.status(200).json({
      testName: test.name,
      enrolledCount: enrolledData.length,
      remainingSlots,
      enrollments: enrolledData,
    });

  } catch (err) {
    console.error('Admin enrollment fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
