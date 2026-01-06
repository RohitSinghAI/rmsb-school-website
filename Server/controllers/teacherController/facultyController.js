const facultyModel = require("../../models/teacher/faculty");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class facultyController {
 
    static createFaculty = async (req, res) => {
        try {
            const {
                name,
                department,
                subject,
                experience,
                bio,
                courses,
                email
            } = req.body;

            // ✅ Correct validation
            if (!name || !department || !subject || !experience || !bio || !email) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(
                file.tempFilePath, {
                folder: 'faculty'
            })

            const faculty = await facultyModel.create({
                name,
                department,
                subject,
                experience,
                bio,
                courses: courses ? courses.split(",") : [],
                email,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            });

            res.status(201).json({
                success: true,
                message: "Faculty created successfully",
                data: faculty
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    /* ================= GET ALL FACULTY ================= */
    static getAllFaculty = async (req, res) => {
        try {
            const faculty = await facultyModel.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                total: faculty.length,
                data: faculty
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    /* ================= GET SINGLE FACULTY ================= */
    static getFacultyById = async (req, res) => {
        try {
            const faculty = await facultyModel.findById(req.params.id);

            if (!faculty) {
                return res.status(404).json({
                    success: false,
                    message: "Faculty not found"
                });
            }

            res.status(200).json({
                success: true,
                data: faculty
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    /* ================= UPDATE FACULTY ================= */
    static updateFaculty = async (req, res) => {
        try {
            const faculty = await facultyModel.findById(req.params.id);

            if (!faculty) {
                return res.status(404).json({
                    success: false,
                    message: "Faculty not found"
                });
            }

            // ✅ If new image uploaded
            // if (req.file) {
            //     await cloudinary.uploader.destroy(faculty.image.public_id);

            //     const imageUpload = await cloudinary.uploader.upload(
            //         req.file.path,
            //         { folder: "faculty" }
            //     );

            //     faculty.image = {
            //         public_id: imageUpload.public_id,
            //         url: imageUpload.secure_url
            //     };
            // }
            if (req.files && req.files.image) {
                const file = req.files.image;
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'course',
                });

                faculty.image = {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url,
                };
            }

            faculty.name = req.body.name || faculty.name;
            faculty.department = req.body.department || faculty.department;
            faculty.subject = req.body.subject || faculty.subject;
            faculty.experience = req.body.experience || faculty.experience;
            faculty.bio = req.body.bio || faculty.bio;
            faculty.email = req.body.email || faculty.email;
            faculty.courses = req.body.courses
                ? req.body.courses.split(",")
                : faculty.courses;

            await faculty.save();

            res.status(200).json({
                success: true,
                message: "Faculty updated successfully",
                data: faculty
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    /* ================= DELETE FACULTY ================= */
    static deleteFaculty = async (req, res) => {
        try {
            const faculty = await facultyModel.findById(req.params.id);

            if (!faculty) {
                return res.status(404).json({
                    success: false,
                    message: "Faculty not found"
                });
            }

            await cloudinary.uploader.destroy(faculty.image.public_id);
            await faculty.deleteOne();

            res.status(200).json({
                success: true,
                message: "Faculty deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = facultyController;
