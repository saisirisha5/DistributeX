import Test from '../models/TestSchema.js';
import TestAttempt from "../models/TestAttemptSchema.js";

//to get all tests for students
export const getAllTests = async (req, res) => {
  try {
      const tests = await Test.find()
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .select('name teacher isPremium dateSlots places threshold enrolledCount');

    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tests", error: err.message });
  }
};


//to get a specific test by id (search bar) 
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("teacher", "name email");

    if (!test) return res.status(404).json({ message: "Test not found" });

    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
};


//after student enrolls in a test, it creates a TestAttempt
export const enrollInTest = async (req, res) => {
  const studentId = req.user.id;
  const { testId, selectedDate, selectedSlot, selectedPlace } = req.body;

  try {
    //to check if already enrolled in the test
    const existing = await TestAttempt.findOne({ student: studentId, test: testId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });
    
    //to check if the test exists
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Validate slot limit
    const dateSlot = test.dateSlots.find(ds => new Date(ds.date).toISOString() === new Date(selectedDate).toISOString());
    if (!dateSlot) return res.status(400).json({ message: "Invalid date" });

    const slot = dateSlot.slots.find(s => s.startTime === selectedSlot.startTime && s.endTime === selectedSlot.endTime);
    if (!slot) return res.status(400).json({ message: "Invalid time slot" });

    if (slot.enrolled >= slot.limit) {
      return res.status(400).json({ message: "Slot is full" });
    }

    // Validate location
    const location = test.places.find(p => p.name === selectedPlace.name);
    if (!location) return res.status(400).json({ message: "Invalid location" });

    // Update slot
    test.enrolledCount += 1;

    const attempt = new TestAttempt({
      student: studentId,
      test: testId,
      selectedDate,
      selectedSlot,
      selectedPlace,
      paymentStatus: test.isPremium ? "pending" : "not_required",
    });

    await attempt.save();
    await test.save();

    res.status(201).json({ message: "Enrolled successfully", attempt });
  } catch (err) {
    res.status(500).json({ message: "Error enrolling", error: err.message });
  }
};


export const getEnrolledTests = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attempts = await TestAttempt.find({ 
        student: studentId, 
        status: 'enrolled' 
      })
      .populate('test')  
      .lean();

    res.status(200).json(attempts);
  } catch (error) {
    console.error('Error fetching enrolled tests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};