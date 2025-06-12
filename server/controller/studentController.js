import StudentProfile from '../models/StudentProfileSchema.js';
import User from '../models/User.js';

export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      hasProfile: !!profile,
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateStudentProfile = async (req, res) => {
  const { grade, institution, rollNo } = req.body;
  const userId = req.user.id;

  try {
    let profile = await StudentProfile.findOne({ user: userId });

    if (profile) {
      profile.grade = grade;
      profile.institution = institution;
      profile.rollNo = rollNo;
      await profile.save();
    } else {
      profile = new StudentProfile({ user: userId, grade, institution, rollNo });
      await profile.save();
    }

    const user = await User.findById(userId).select("-password");

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

