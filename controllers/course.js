const Course = require("../schemas/Course");
const User = require("../schemas/User");

// Create
const createCourse = async (req, res, next) => {
    const courseData = req.body;
    const currentUserId = req.query.userId; // Get the User's ID


    try {
        const existingCourse = await Course.findOne({
          uniqueIdentifier: courseData.uniqueIdentifier,
        });
    
        if (!existingCourse) {
          const newCourse = new Course(courseData);
    
          await newCourse.save();
    
          // Get the user's document to fit transaction right in
          const user = await User.findById(currentUserId);
          // console.log("newCourse: ", newCourse);
    
          // Store the just created newCourse in the User's Document
          user?.courses.push(newCourse); // Now the newCourse has been added to it's specific User
          await user.save();
    
          return res.status(201).json({
            message: "Success",
            status: 201,
            detail: "Course successfully created",
          });
        } else {
          return res
            .status(200)
            .json({ existingData: existingCourse.uniqueIdentifier });
        }
      } catch (error) {
        next(error);
      }
}

// Update
const updateCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const updatedCourse = req.body;
    const currentUserId = req.query.userId; // Get the User's ID
  
    try {
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res.status(404).json({ message: "User Not Found", status: 404 });
      }
  
      // Find the course within the user's document
      const courseIndx = currentUser.courses.findIndex(
        (course) => course._id.toString() === courseId
      );
  
      if (courseIndx === -1) {
        return res
          .status(404)
          .json({ message: "Course Not Found", status: 404 });
      }
      // Updated the course data
      currentUser.courses[courseIndx] = {
        ...currentUser.courses[courseIndx],
        ...updatedCourse,
      };
  
      await currentUser.save();
  
      res.status(200).json(currentUser.courses[courseIndx]);
    } catch (error) {
      next(error);
    }
} 

// Delete
const deleteCourse = async (req, res, next) => {
  const currentUserId = req.query.userId;
  const courseId = req.params.courseId;

  try {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // We'd get the index of the transaction
    const courseIndex = currentUser.courses.findIndex((trans) =>
      trans._id.toString() === courseId
    );
    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ message: "Transaction Not Found", status: 404 });
    }

    await currentUser.courses.splice(courseIndex, 1);
    await Course.findByIdAndDelete(courseId);
    currentUser.save();

    res.status(200).json({
      message: "Success",
      status: 200,
      detail: "Course Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}

// Get all
const getAllCourses = async (req, res, next) => {
    const currentUserId = req.query.userId; // Getting the user's ID

    try {
        // Finding current User
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
        return res.status(404).json({ message: "User Not Found", status: 404 });
        }

        // Access the transactions list from the user
        const courses = currentUser.courses;
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
}

// Get single course
const getCourse = async (req, res, next) => {
    const currentUserId = req.query.userId;
    const courseId = req.params.courseId;
  
    try {
      // Find the currentUser based on Id
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res.status(404).json({ message: "User Not Found", status: 404 });
      }
  
  
      // Find the course within the user's course array by it's id
      const course = currentUser.transactions.find((course) => course._id.toString() === courseId);
  
  
      if (!course) {
        return res
          .status(404)
          .json({ message: "Course Not Found", status: 404 });
      }
  
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
}


module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
}