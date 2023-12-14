const bcrypt = require('bcrypt');
const membershipModel = require('../models/membershipModel')
const feedbackModel = require('../models/feedbackModel')
const userModel = require('../models/userModels')
const Inventory = require('../models/inventoryModel')
const Order = require('../models/orderModel');
const ClientRecord = require('../models/clientRecordsModel');

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

const getAdminInfoController = async (req, res) => {
    try {
        const admin = await userModel.findOne({ _id: req.body.userId });
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: 'Admin not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Admin Data Fetch Success',
            data: admin,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching Admin Details',
        });
    }
};


const updateProfileController = async (req, res) => {
    try {
        const admin = await userModel.findOneAndUpdate({ _id: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: 'Admin Profile Updated',
            data: admin,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Admin Profile Update Issue',
            error,
        });
    }
};


const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).send({
            success: true,
            message: 'Users Data List',
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while fetching users data',
            error
        })
    }
}

const getAllMembersController = async (req, res) => {
    try {
        const members = await membershipModel.find({})
        res.status(200).send({
            success: true,
            message: 'Members Data List',
            data: members,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while fetching members data',
            error,
        })
    }
}

//Member account status
const changeAccountStatusController = async (req, res) => {
    try {
        const {memberId, status} = req.body
        const member = await membershipModel.findByIdAndUpdate(memberId,{status})
        const user = await userModel.findOne({_id:member.userId})
        const notification = user.notification
        notification.push({
            type: 'member-account-request-updated',
            message: `Your Membership Account Request Has ${status}`,
            onClickPath:'/notification'
        })
        user.isMember = status === 'Approved' ? true : false;
        await user.save();
        res.status(201).send({
            success: true,
            message: 'Account Status Updated',
            data: member,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Account Status',
            error
        })
    }
}

const getAllUserFeedbackController = async(req, res) => {
    try {
        const userfeedbacks = await feedbackModel.find(); // Fetch all feedback entries
        res.status(200).send({
            success: true,
            data: userfeedbacks,
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

const viewInventoryController = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || ''; // Retrieve the search query from the query parameters
        const products = await Inventory.find({
            productName: { $regex: new RegExp(searchQuery, 'i') }, // Case-insensitive search on productName
        });

        res.status(200).send({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving products',
            error,
        });
    }
};


const searchProductController = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || ''; // Retrieve the search query from the query parameters

        // Find a single product that matches the search query based on productName
        const product = await Inventory.findOne({
            productName: { $regex: new RegExp(searchQuery, 'i') }, // Case-insensitive search on productName
        });

        if (product) {
            res.status(200).send({
                success: true,
                message: 'Product retrieved successfully',
                data: product,
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Product not found',
                data: null,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving product',
            error,
        });
    }
};

const addProductController = async (req, res) => {
    try {
        const {
            productCategory,
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productImage, // Updated to get the image path
        } = req.body;


        const stocksLeft = productQuantity;

        // Save the product data to the database (you'll need to adapt this to your database setup)
        // Example using Mongoose:
        const product = new Inventory({
            productCategory,
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productImage,
            stocksLeft,
        });

        await product.save();

        res.status(201).send({
            success: true,
            message: 'Product added successfully',
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in adding a product',
            error,
        });
    }
};

const getProductByIdController = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Fetch the product by its ID
        const product = await Inventory.findById(productId);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product retrieved successfully',
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving product',
            error,
        });
    }
};

const editProductController = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductData = req.body;

        // Fetch the product by its ID
        const product = await Inventory.findById(productId);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }

        // Calculate the difference between old and new quantities
        const updatedQuantity = parseInt(updatedProductData.productQuantity);
        const quantityDifference = updatedQuantity - product.productQuantity;

        // Calculate the updated stocksLeft
        const updatedStocksLeft = product.stocksLeft + quantityDifference;

        // Update the product data
        product.productCategory = updatedProductData.productCategory;
        product.productName = updatedProductData.productName;
        product.productDescription = updatedProductData.productDescription;
        product.productPrice = updatedProductData.productPrice;
        product.productQuantity = updatedQuantity; // Update quantity
        product.stocksLeft = updatedStocksLeft; // Update stocksLeft

        // Save the updated product data
        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating the product',
            error,
        });
    }
};

const deleteProductController = async(req, res) => {
    try {
        const productId = req.params.productId;

        // Use Mongoose to find and remove the appointment by its ID
        const deletedProduct = await Inventory.findByIdAndRemove(productId);

        if (!deletedProduct) {
            return res.status(404).send({
                success: false,
                message: 'Product not found or could not be deleted',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting the product',
            error,
        });
    }
};

const createOrderController = async (req, res) => {
    try {
        const { products, totalAmount, amountReceived, change, customerName } = req.body; 
        const currentDate = new Date();
        const order = new Order({
            products: products, 
            totalAmount: totalAmount,
            amountReceived: amountReceived,
            change: change,
            customerName: customerName,
            orderDate: currentDate,

        });

        await order.save();
        for (const product of products) {
            const productId = product.product._id; 
            const quantity = product.quantity; 

            const inventory = await Inventory.findById(productId);

            if (inventory) {
                const updatedStocksLeft = inventory.stocksLeft - quantity;
                const updatedStocksOut = (inventory.stocksOut || 0) + quantity;
                inventory.stocksLeft = updatedStocksLeft;
                inventory.stocksOut = updatedStocksOut;
                await inventory.save();
            }
        }

        res.status(201).send({
            success: true,
            message: 'Order created successfully',
            data: order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while creating the order',
            error: error.message,
        });
    }
};



//View Order Controller
const viewOrderController = async (req, res) => {
    try {
        let query = {};

        // Check if there is a date filter
        if (req.query.date) {
            const startDate = new Date(req.query.date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);

            query = {
                orderDate: {
                    $gte: startDate,
                    $lt: endDate,
                },
            };
        }

        const orders = await Order.find(query);

        res.status(200).send({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while fetching orders',
            error: error.message,
        });
    }
};


const deleteOrderController = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Find the order by ID and remove it
        const deletedOrder = await Order.findByIdAndRemove(orderId);

        if (deletedOrder) {
            res.status(200).send({
                success: true,
                message: 'Order deleted successfully',
                data: deletedOrder,
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Order not found',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting the order',
            error,
        });
    }
};

const viewClientRecordsController = async (req, res) => {
    try {
        const clientRecords = await ClientRecord.find();
        res.status(200).json({
            success: true,
            message: 'Client records retrieved successfully',
            data: clientRecords,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving client records',
            error,
        });
    }
};

const createClientRecordsController = async (req, res) => {
    try {
        const {
            fullName,
            address,
            contact,
            nameOfPet,
            species,
            petsBreed,
            petsSex,
            petsBirthdate,
        } = req.body;

        const clientRecordData = {
            fullName,
            address,
            contact,
            nameOfPet,
            species,
            petsBreed,
            petsSex,
            petsBirthdate,
        };

        const clientRecord = new ClientRecord(clientRecordData);

        await clientRecord.save();

        res.status(201).send({
            success: true,
            message: 'Client records added successfully',
            data: clientRecord,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in adding client records',
            error,
        });
    }
};

const editClientRecordsController = async (req, res) => {
    try {
        const recordId = req.params.recordId;
        const updatedClientData = req.body;

        // Fetch the client records by its ID
        const clientRecord = await ClientRecord.findById(recordId);

        if (!clientRecord) {
            return res.status(404).send({
                success: false,
                message: 'Client Records not found',
            });
        }

        // Update the client records data
        clientRecord.fullName = updatedClientData.fullName;
        clientRecord.address = updatedClientData.address;
        clientRecord.contact = updatedClientData.contact;
        clientRecord.nameOfPet = updatedClientData.nameOfPet;
        clientRecord.species = updatedClientData.species;
        clientRecord.petsBreed = updatedClientData.petsBreed;
        clientRecord.petsSex = updatedClientData.petsSex;
        clientRecord.petsBirthdate = updatedClientData.petsBirthdate;

        // Add more fields based on your client records model

        // Save the updated client records data
        await clientRecord.save();

        res.status(200).send({
            success: true,
            message: 'Client Records updated successfully',
            data: clientRecord,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating client records',
            error,
        });
    }
};

const getClientRecordsByIdController = async (req, res) => {
    try {
        const recordId = req.params.recordId;

        // Fetch the client records by its ID
        const clientRecords = await ClientRecord.findById(recordId);

        if (!clientRecords) {
            return res.status(404).send({
                success: false,
                message: 'Client records not found',
            });
        }

        res.status(200).send({
            success: true,
            data: clientRecords,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting client records',
            error,
        });
    }
};

const deleteClientRecordsController = async (req, res) => {
    try {
        const recordId = req.params.recordId;

        // Find and delete the client record by ID
        const deletedRecord = await ClientRecord.findByIdAndRemove(recordId);

        if (!deletedRecord) {
            return res.status(404).send({
                success: false,
                message: 'Client record not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Client record deleted successfully',
            data: deletedRecord,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting the client record',
            error,
        });
    }
};

const viewRecordDetailsController = async (req, res) => {
    try {
      const recordId = req.params.recordId;
  
      // Fetch client record
      const clientRecord = await ClientRecord.findById(recordId);
  
      if (!clientRecord) {
        return res.status(404).json({
          success: false,
          message: 'Client record not found',
        });
      }
  
      const { petsHistory, historyDate, petsMedication, medicationDate } = clientRecord;
  
      res.status(200).json({
        success: true,
        data: {
          petsHistory,
          historyDate,
          petsMedication,
          medicationDate,
        },
      });
    } catch (error) {
      console.error('Error fetching record details:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const addHistoryController = async (req, res) => {
    const recordId = req.params.recordId;
    const { historyDate, petsHistory } = req.body;
  
    try {
      const record = await ClientRecord.findById(recordId);
  
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
  
      // Add the new entry without limiting the number of entries
      record.historyDate.push(historyDate);
      record.petsHistory.push(petsHistory);
  
      await record.save();
  
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      console.error('Error adding history entry:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  const addMedicationController = async (req, res) => {
    const recordId = req.params.recordId;
    const { medicationDate, petsMedication } = req.body;
  
    try {
      const record = await ClientRecord.findById(recordId);
  
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
  
      // Add the new entry without limiting the number of entries
      record.medicationDate.push(medicationDate);
      record.petsMedication.push(petsMedication);
  
      await record.save();
  
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      console.error('Error adding medication entry:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  const viewFullDetailsController = async(req, res) => {
    try {
        const recordId = req.params.recordId;
    
        // Fetch client record
        const clientRecords = await ClientRecord.findById(recordId);
    
        if (!clientRecords) {
          return res.status(404).json({
            success: false,
            message: 'Client record not found',
          });
        }
    
        const { petsHistory, historyDate, petsMedication, medicationDate } = clientRecords;
    
        res.status(200).json({
          success: true,
          data: {
            petsHistory,
            historyDate,
            petsMedication,
            medicationDate,
          },
        });
      } catch (error) {
        console.error('Error fetching record details:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    };
  

  
module.exports = { 
    getAllMembersController, 
    getAllUsersController, 
    changeAccountStatusController, 
    getAllUserFeedbackController, 
    viewInventoryController,
    addProductController,
    editProductController,
    deleteProductController,
    createOrderController,
    searchProductController,
    getAdminInfoController,
    updateProfileController,
    changePasswordController,
    viewOrderController,
    deleteOrderController,
    viewClientRecordsController,
    createClientRecordsController,
    editClientRecordsController,
    getClientRecordsByIdController,
    deleteClientRecordsController,
    viewRecordDetailsController,
    addHistoryController,
    addMedicationController,
    getProductByIdController,
    viewFullDetailsController,
 }