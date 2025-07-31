import asynHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/apiResponse.js"
const userRegister = asynHandler(async (req, res) => {
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
  try {
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
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (
    //   req.files &&
    //   Array.isArray(req.files.coverImage) &&
    //   req.files.coverImage.length > 0
    // ) {
    //   coverImageLocalPath = req.files.coverImage[0].path;
    // }
    console.log(avatarLocalPath, coverImageLocalPath);
    console.log(req.files);

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file not found");
    }

    //6

    const user = await User.create({
      fullName,
      avatar: avatar.url || "",
      coverImage: coverImage.url || "",
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
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

export default userRegister;
