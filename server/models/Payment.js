// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  student: 
  { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true 
  },
  test: 
  { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Test', 
     required: true 
},
  testAttempt: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TestAttempt', 
    required: false 
  },
  amount: 
  { 
    type: Number, 
    required: true 
},
  currency: 
  { type: String, 
    default: 'INR' 
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  receipt: String,
  status: 
  { 
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created' 
  }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
