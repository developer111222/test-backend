const Razorpay = require("razorpay");
const Order = require("../model/ordermodel");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { name,email,phone,city,state,amount } = req.body;
    console.log(req.body)

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const receipt = `receipt_${Date.now()}`;
    const options = {
      amount: amount * 100 , // Convert to paise
      currency: "INR",
      receipt,
    
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order details in the database
    const newOrder = new Order({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      email,
      data:{ name, phone, city, state, }
    });
    await newOrder.save(); 
 
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Server error. Try again." });
  }
};

// ✅ Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } =
      req.body;

      console.log(req.body,"verify payment")
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment details",
      });
    }

    const order = await Order.findOne({ razorpayOrderId: orderId });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Verify payment signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      order.status = "paid";
      order.paymentId = paymentId;
      order.signature = signature;
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: "Server error. Try again." });
  }
};


//-----------------------------get payment---------------------


exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Order.find().sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found"
      });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Unable to fetch payments."
    });
  }
};

