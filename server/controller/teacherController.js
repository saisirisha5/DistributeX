import Teacher from '../models/Teacher.js';

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
