import Teacher from '../models/Teacher.js';
import TestAttempt from '../models/TestAttemptSchema.js';
import StudentProfile from '../models/StudentProfileSchema.js';
import Test from '../models/TestSchema.js';
//  Submit a teacher/mentor application
export const applyForTeacher = async (req, res) => {
  try {
    const { qualifications, subjects, bio } = req.body;

    // Check if already applied
    const existing = await Teacher.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Application already submitted.' });
    }

    const teacher = new Teacher({
      user: req.user.id,
      qualifications,
      subjects,
      bio,
    });

    await teacher.save();

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Teacher apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get current teacher application status
export const getTeacherApplication = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(200).json({ applied: false });
    }

    res.status(200).json({
      applied: true,
      status: teacher.status,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      bio: teacher.bio,
    });
  } catch (err) {
    console.error('Get teacher application error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTestEnrolledDetails = async (req, res) => {
  try {
    const testId = req.params.id;

    // Verify test exists and belongs to the teacher
    const test = await Test.findById(testId).populate('teacher');
    if (!test) return res.status(404).json({ message: 'Test not found.' });

    if (test.teacher.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    // Get all test attempts (enrollments)
    const attempts = await TestAttempt.find({ test: testId })
      .populate('student', 'name email role') // User model (basic)
      .sort({ createdAt: -1 });

    // Pull student profile data (batch for performance)
    const studentUserIds = attempts.map((a) => a.student._id);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });

    // Map profiles for quick lookup
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    // Compose response
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
    console.error('Error fetching enrolled student details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};