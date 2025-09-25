const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const rideModel = require('../models/ride.model');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.getCaptainStats = async (req, res, next) => {
    try {
        const captainId = req.captain._id;

        // Get completed rides for this captain
        const completedRides = await rideModel.find({
            captain: captainId,
            status: 'completed'
        });

        // Calculate total earnings
        const totalEarnings = completedRides.reduce((sum, ride) => sum + ride.fare, 0);

        // Calculate total trips
        const totalTrips = completedRides.length;

        // Calculate hours online (simplified - based on ride durations)
        // This could be enhanced with actual online time tracking
        const totalDurationMinutes = completedRides.reduce((sum, ride) => sum + (ride.duration / 60), 0);
        const hoursOnline = totalDurationMinutes / 60;

        res.status(200).json({
            stats: {
                totalEarnings,
                hoursOnline,
                totalTrips
            }
        });
    } catch (error) {
        console.error('Error fetching captain stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}
