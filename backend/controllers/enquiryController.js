const Enquiry = require('../models/Enquiry');
const { sendEmail } = require('../utils/email');

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subject = `New Enquiry for ${req.body.car}`;
      const text = `
        New Enquiry Received:
        User: ${req.body.user}
        Car: ${req.body.car}
        Message: ${req.body.message}
        Email: ${req.body.email}
        Phone: ${req.body.phone}
        Date: ${req.body.date}
      `;
      const html = `
        <h2>New Enquiry Received</h2>
        <p><strong>User:</strong> ${req.body.user}</p>
        <p><strong>Car:</strong> ${req.body.car}</p>
        <p><strong>Message:</strong> ${req.body.message}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.phone}</p>
        <p><strong>Date:</strong> ${req.body.date}</p>
      `;

      try {
        await sendEmail({
          to: adminEmail,
          subject,
          text,
          html,
        });
      } catch (mailErr) {
        console.warn('Could not send notification email:', mailErr.message);
      }
    }

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      enquiry,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(400).json({
      message: 'Error submitting enquiry',
      error: error.message,
    });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
