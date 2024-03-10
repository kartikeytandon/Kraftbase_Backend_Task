const User = require('../models/user')

exports.register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body

        let user = await User.findOne({ email })
        if(user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        user = await User.create({
            name,
            email,
            password,
            address,
        })

        res.status(200).json({
            success: true,
            message: `User created successfully`
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exists'
            })
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        const token = await user.generateToken()

        res.status(201).cookie("token", token, { 
            expires: new Date(Date.now()+10*24*60*60*1000), 
            httpOnly: true
        }).
        json({
            success: true,
            user,
            token,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res
        .status(200)
        .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
        .json({
            success: true, 
            message: "Logged Out"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}