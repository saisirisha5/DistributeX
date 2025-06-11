import StudentProfile from '../models/StudentProfileSchema.js';
import User from '../models/User.js';
export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
    name: user.name,
    email: user.email,
    role: user.role,
    isProfileComplete: user.isProfileComplete,
    grade: profile.grade,
    institution: profile.institution,
    rollNo: profile.rollNo
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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isProfileComplete: true },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: 'Profile updated successfully',
      profile,
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
