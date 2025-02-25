const User = require('../model/usermodel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


//-----------------------------user registration----------------------------------

exports.usersignup = async (req, res, next) => {
    const { email, password,username } = req.body;
    // .
    // const avtar = req.file ? req.file.filename : null; // Ensure file exists, and get filename



    try {
        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" }); // Conflict status
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with the provided avatar (if any)
        const newUser = new User({
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        return res.status(201).json({ message: "User successfully signed up" }); // 201 for created
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Server error while creating user" });
    }
};





//-----------------------------user login----------------------------------

exports.userlogin = async (req, res) => {
    try {

        const { email, password } = req.body

        // console.log(email,password)
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        console.log(isMatch, "test")
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        const token = jwt.sign({ id: user.id,role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

        return res.cookie('token', token, {
            httpOnly: true,
            path: "/", // cookie path
            //   Domain: ".onrender.com", // domain for the cookie
            secure: true, // accessible through HTTP
            // httpOnly: true, // only server can access the cookie
            sameSite: "none", // enforcement type
            // partitioned: false,
        }).status(200).json({ message: "Login successful" })
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


//--------------------------------------get profile-------------------------------------

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username email role')
       return res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



//----------------------------------user logout------------------------------

exports.userlogout = (req, res, next) => {
    console.log(req.body,"logout");
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Uncomment for production
        sameSite: 'none',
        path: '/' // Ensure the path matches the one used when setting the cookie
    });
  return res.status(200).json({ message: "Logout successful" });
}
