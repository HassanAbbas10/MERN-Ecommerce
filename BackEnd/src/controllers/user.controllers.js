import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { Order } from "../models/orders.models.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userRegister = asyncHandler(async (req, res) => {
  //1:get user details from frontend'
  //2:validation - not empty
  //3:check if user already exist
  //4:check for images & check for avatar
  //5:upload them to cloudinary , avatar
  //6:create user object , Entry in the DB
  //7:Remove password and refresh field token from the response
  //8:checkfor user creation
  //9:return response

  // 1

  const { fullName, email, password, username } = req.body;

  // 2
  if (
    [fullName, email, password, username].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  // 3
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // 4
  if (existedUser) {
    throw new ApiError(409, "User is already existed in the database");
  }
  //5
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  
  console.log("Avatar path:", avatarLocalPath);
  console.log("Files:", req.files);

  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }

  //6
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log(user);
  //findingg thee user

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created .Something went wrong 🎃");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Succesfully 🚀"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

const userLogin = asyncHandler(async (req, res) => {
  // 1. Get email/username and password from req body
  // 2. Find user by email or username
  // 3. Check password
  // 4. Generate access and refresh token
  // 5. Send cookies

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// Get all customers with their order statistics
const getAllCustomers = asyncHandler(async (req, res) => {
  const { search, status, limit = 50, page = 1 } = req.query;

  // Build filter criteria
  let filter = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  // Get customers with aggregated order data
  const customers = await User.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders"
      }
    },
    {
      $addFields: {
        totalOrders: { $size: "$orders" },
        totalSpent: {
          $sum: "$orders.totalAmount"
        },
        lastOrderDate: {
          $max: "$orders.createdAt"
        },
        // Get phone number from the most recent order
        phone: {
          $let: {
            vars: {
              latestOrder: {
                $arrayElemAt: [
                  {
                    $sortArray: {
                      input: "$orders",
                      sortBy: { createdAt: -1 }
                    }
                  },
                  0
                ]
              }
            },
            in: "$$latestOrder.shippingAddress.phone"
          }
        },
        status: {
          $cond: {
            if: { $gte: [{ $size: "$orders" }, 1] },
            then: "Active",
            else: "Inactive"
          }
        }
      }
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        orders: 0
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  // Get total count for pagination
  const totalCustomers = await User.countDocuments(filter);

  return res.status(200).json(new ApiResponse(200, {
    customers,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCustomers / limit),
      totalCustomers,
      hasNextPage: skip + customers.length < totalCustomers,
      hasPrevPage: page > 1
    }
  }, "Customers fetched successfully"));
});

// Get customer analytics for the dashboard
const getCustomerAnalytics = asyncHandler(async (req, res) => {
  const totalCustomers = await User.countDocuments({});
  
  // Get customers with order statistics and status classification
  const customersWithStats = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders"
      }
    },
    {
      $addFields: {
        totalOrders: { $size: "$orders" },
        totalSpent: { $sum: "$orders.totalAmount" },
        status: {
          $cond: {
            if: { $gte: [{ $sum: "$orders.totalAmount" }, 1000] },
            then: "VIP",
            else: {
              $cond: {
                if: { $gte: [{ $size: "$orders" }, 1] },
                then: "Active",
                else: "Inactive"
              }
            }
          }
        }
      }
    }
  ]);

  // Count customers by status
  const statusCounts = customersWithStats.reduce((acc, customer) => {
    acc[customer.status] = (acc[customer.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate average order value
  const avgOrderValue = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders"
      }
    },
    {
      $unwind: "$orders"
    },
    {
      $group: {
        _id: null,
        avgOrderValue: { $avg: "$orders.totalAmount" }
      }
    }
  ]);

  // Get new customers this month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const newCustomersThisMonth = await User.countDocuments({
    createdAt: { $gte: currentMonth }
  });

  // Get last month count for comparison
  const lastMonth = new Date(currentMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthCustomers = await User.countDocuments({
    createdAt: { 
      $gte: lastMonth,
      $lt: currentMonth
    }
  });

  const customerGrowth = lastMonthCustomers > 0 
    ? ((newCustomersThisMonth - lastMonthCustomers) / lastMonthCustomers) * 100
    : 0;

  // Process analytics
  const analytics = {
    totalCustomers,
    activeCustomers: statusCounts.Active || 0,
    inactiveCustomers: statusCounts.Inactive || 0,
    avgOrderValue: avgOrderValue[0]?.avgOrderValue || 0,
    newCustomersThisMonth,
    customerGrowth
  };

  return res.status(200).json(new ApiResponse(200, analytics, "Customer analytics fetched successfully"));
});

export { userRegister, userLogin, userLogout, getCurrentUser, getAllCustomers, getCustomerAnalytics };

export default userRegister;
