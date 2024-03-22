const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const membershipModel = require('../models/membershipModel')
const appointmentModel = require('../models/appointmentModel')
const feedbackModel = require('../models/feedbackModel')
const moment = require('moment')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'panaliganjericho05@gmail.com',
      pass: 'enaa ddsy slfy qrkw',
    },
  });
  
  const forgotPasswordController = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(200).send({ Status: 'User not found.' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      const resetUrl = `http://localhost:3000/reset-password/${user._id}/${token}`;
  
      const mailOptions = {
        from: 'panaliganjericho05@gmail.com',
        to: user.email,
        subject: 'Reset Password Link',
        text: resetUrl,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send({ Status: 'Error sending email.' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({ Status: 'Success' });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ Status: 'Error sending email.' });
    }
  };


  const resetPasswordController = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).send({ success: false, message: 'Invalid or expired token.' });
            }

            // Fetch user using the decoded ID
            const user = await userModel.findById(id);

            if (!user) {
                return res.status(400).send({ success: false, message: 'Invalid user.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Update user's password and reset token-related fields
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).send({ success: true, message: 'Password reset successfully.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error resetting password.' });
    }
};



//register callback
const registerController = async(req, res) => {
    try {
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser) {
            return res.status(200).send({ message: 'User Already Exist', success:false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Registered Successfully", success:true });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success:false, message: `Register Controller ${error.message}`, });
    }
}

//login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not Found', success: false });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: `Invalid Email or Password`, success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Include isAdmin field in the response
        res.status(200).send({
            message: `Login Success`,
            success: true,
            token,
            data: { isAdmin: user.isAdmin, isDoctor: user.isDoctor },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login Controller ${error.message}` });
    }
};


const authController = async (req, res) => {
    try {
        const user = await userModel.findById({_id:req.body.userId})
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'User Not Found',
                success: false,
            });
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        })
    }
};

const changePasswordController = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        // Check if the current password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Adjust the saltRounds as needed

        // Update the user's password with the hashed new password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error changing password',
            error,
        });
    }
};

const getUserInfoController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'User Data Fetch Success',
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching User Details',
        });
    }
};


const updateProfileController = async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({ _id: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: 'User Profile Updated',
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'User Profile Update Issue',
            error,
        });
    }
};

//Apply Membership Controller
const applyMembershipController = async (req, res) => {
    try {
        const newMembership = await membershipModel({...req.body, status: 'pending'})
        await newMembership.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const notification = adminUser.notification
        notification.push({
            type: 'apply-membership-request',
            message: `${newMembership.ownersName} Pet's Name: ${newMembership.petsName} Has applied for Membership Account`,
            data: {
                memberId: newMembership._id,
                name: newMembership.ownersName + " " + newMembership.petsName,
                onClickPath: '/admin/members'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: 'Membership Account Applied Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while applying a membership'
        })
    }
}

//Notification Controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: 'All Notification marked as read',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'Error in Notification',
            success: false,
            error
        })
    }
}

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seennotification = []
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notifications Deleted Successfully",
            data: updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Unable to delete all notifications',
            error
        })
    }
}

// GET Alll Doctors
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await userModel.find({ isDoctor: true })
        res.status(200).send({
            success: true,
            message: "Doctor List Fetched Successfully",
            data: doctors,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Fetching Doctors'
        })
    }
}

//Book Appointment
const bookAppointmentController = async (req, res) => {
    try {
        // Use the date and time values directly from the request body
        req.body.status = "Pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: 'New-appointment-request',
            message: `A new appointment request from ${req.body.userInfo.name}`,
            onClickPath: '/doctor-appointments',
        });

        await user.save();

        res.status(200).send({
            success: true,
            message: 'Appointment Booked Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Booking an Appointment',
        });
    }
};

// Booking Availability Controller
const bookingAvailabilityController = async (req, res) => {
    try {
        const { dates, doctorId } = req.body;

        // If no dates provided, use the next 7 days
        const targetDates = dates || Array.from({ length: 7 }, (_, index) =>
            moment().add(index, 'days').format('YYYY-MM-DD')
        );

        const availableDates = await Promise.all(
            targetDates.map(async (date) => {
                const approvedAppointmentsCount = await appointmentModel.countDocuments({
                    doctorId,
                    date,
                    status: 'Approved',
                });

                // Maximum booking limit is 5
                const isAvailable = approvedAppointmentsCount < 5;

                return {
                    date,
                    isAvailable,
                };
            })
        );

        res.status(200).send({
            success: true,
            message: 'Availability checked successfully',
            availableDates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Booking',
        });
    }
};

const userAppointmentController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({userId:req.body.userId})
        res.status(200).send({
            success: true,
            message: 'Users Appointments Fetched Successfully',
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching User Appointment List',
        })
    }
}

const editAppointmentController = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const { date, time, status, ...otherFields } = req.body; // Extract date, time, status, and other fields

        // Use Mongoose to fetch the appointment
        const existingAppointment = await appointmentModel.findById(appointmentId);

        if (!existingAppointment) {
            res.status(404).send({
                success: false,
                message: 'Appointment not found or could not be updated',
            });
        }

        // Check if the appointment status is "Approved," and if so, do not allow editing
        if (existingAppointment.status === 'Approved') {
            res.status(403).send({
                success: false,
                message: 'Editing an approved appointment is not allowed',
            });
        }

        // If the status is "Rejected," update the date, time, and set the status back to "Pending"
        if (status === 'Rejected') {
            existingAppointment.date = date;
            existingAppointment.time = time;
            existingAppointment.status = 'Pending';
        }

        // Use Mongoose to update the appointment by its ID
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(appointmentId, existingAppointment, { new: true });

        res.status(200).send({
            success: true,
            message: 'Appointment updated successfully',
            data: updatedAppointment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating the appointment',
            error,
        });
    }
};


const deleteAppointmentController = async(req, res) => {
    try {
        const appointmentId = req.params.appointmentId;

        // Use Mongoose to find and remove the appointment by its ID
        const deletedAppointment = await appointmentModel.findByIdAndRemove(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).send({
                success: false,
                message: 'Appointment not found or could not be deleted',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Appointment deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting the appointment',
            error,
        });
    }
};

const createFeedbackController = async (req, res) => {
    try {
        const { category, feedback, ratings } = req.body;

        // Validate the category
        const allowedCategories = ["Vaccination", "Medication", "Check-up"];
        if (!allowedCategories.includes(category)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid category',
            });
        }

        // Validate the ratings
        if (isNaN(ratings) || ratings < 1 || ratings > 5) {
            return res.status(400).send({
                success: false,
                message: 'Ratings must be between 1 and 5',
            });
        }

        // Create a new feedback entry
        const newFeedback = new feedbackModel({
            category,
            feedback,
            ratings,
        });

        // Save the feedback to the database
        await newFeedback.save();

        // Create a new notification for the admin
        const notificationData = {
            type: 'create-feedback-request',
            message: 'New Feedback from a user',
            data: newFeedback,
            onClickPath: '/admin/user-feedbacks',
        };

        // Update the admin's notification in the database
        const adminUser = await userModel.findOne({ isAdmin: true });
        adminUser.notification.push(notificationData);
        await adminUser.save();

        res.status(201).send({
            success: true,
            message: 'Feedback created successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Error while creating feedback: ${error.message}`,
            error,
        });
    }
};


const userFeedbackController = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.find(); // Fetch all feedback entries
        res.status(200).send({
            success: true,
            data: feedbacks,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching feedbacks',
            error,
        });
    }
};




module.exports = { 
    loginController, 
    registerController, 
    authController, 
    applyMembershipController, 
    getAllNotificationController, 
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentController,
    editAppointmentController,
    deleteAppointmentController,
    createFeedbackController,
    userFeedbackController,
    changePasswordController,
    getUserInfoController,
    updateProfileController,
    forgotPasswordController,
    resetPasswordController,
};