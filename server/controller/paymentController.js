import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import TestAttempt from '../models/TestAttemptSchema.js';
import Test from '../models/TestSchema.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

//console.log('Keyid:', process.env.RAZORPAY_KEY_ID);


export const createOrder = async (req, res) => {
  const { testId } = req.body;
  const studentId = req.user.id;

  try {

    // Prevent duplicate paid orders
    const existingAttempt = await TestAttempt.findOne({
      student: studentId,
      test: testId,
      paymentStatus: 'paid'
    });

    if (existingAttempt) {
      return res.status(400).json({ message: 'Already enrolled and paid for this test' });
    }

    // Check for existing payment
    const existingPayment = await Payment.findOne({
      student: studentId,
      test: testId,
      status: { $in: ['created', 'pending'] }
    });

    if (existingPayment) {
      return res.status(200).json({
        id: existingPayment.razorpayOrderId,
        amount: existingPayment.amount,
        currency: existingPayment.currency
      });
    }

    const options = {
      amount: 50000, //fixed Rs. 500.00 (Razorpay expects amount in paise)
      currency: 'INR',
      receipt: `r_${testId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      student: studentId,
      test: testId,
      amount: options.amount,
      currency: options.currency,
      razorpayOrderId: order.id,
      receipt: order.receipt,
      status: 'created'
    });

    res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};


export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, testId, selectedDate, selectedSlot, selectedPlace } = req.body;
  const studentId = req.user.id;

  try {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
      
    // console.log('Generated Signature:', generatedSignature);
    // console.log('Received Signature:', razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ message: 'Verification failed' });
    }

    // Mark payment as paid
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      }
    );

    // Check test & validate selected data
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });

     const selectedDateStr = new Date(selectedDate).toISOString().split('T')[0];
      const dateSlot = test.dateSlots.find(ds => 
        new Date(ds.date).toISOString().split('T')[0] === selectedDateStr
      );

    const slot = dateSlot?.slots.find(s => s.startTime === selectedSlot.startTime && s.endTime === selectedSlot.endTime);
    const location = test.places.find(p => p.name === selectedPlace.name);


        if (!dateSlot) return res.status(400).json({ message: 'Invalid date selected' });
        if (!slot) return res.status(400).json({ message: 'Invalid slot selected' });
        if (!location) return res.status(400).json({ message: 'Invalid location selected' });
        if (slot.enrolled >= slot.limit) return res.status(400).json({ message: 'Slot is full' });


    // Update slot count
    slot.enrolled += 1;
    test.enrolledCount += 1;
    await test.save();
    

    // console.log('selectedDateStr:', selectedDateStr);
    // console.log('Matched dateSlot:', dateSlot);
    // console.log('Matched slot:', slot);
    // console.log('Matched location:', location);

        // Don't duplicate attempts
        const existingAttempt = await TestAttempt.findOne({
          student: studentId,
          test: testId,
          paymentStatus: 'paid'
        });

        if (existingAttempt) {
          return res.status(200).json({ message: 'Already enrolled', testAttemptId: existingAttempt._id });
        }

    // Create TestAttempt now
    const attempt = await TestAttempt.create({
      student: studentId,
      test: testId,
      selectedDate,
      selectedSlot,
      selectedPlace,
      paymentStatus: 'paid'
    });

    return res.status(200).json({ message: 'Payment verified and enrolled!', testAttemptId: attempt._id });

  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
