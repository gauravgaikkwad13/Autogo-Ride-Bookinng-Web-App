const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log('Pickup coordinates:', pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2000);
        console.log('Captains found in radius:', captainsInRadius.length);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        console.log('Created ride with user:', rideWithUser._id);
        console.log('User data in ride:', rideWithUser.user);

        console.log(`Broadcasting ride to ${captainsInRadius.length} captains`);
        captainsInRadius.map(captain => {
            console.log(`Sending ride to captain ${captain._id} with socketId: ${captain.socketId}`);
            
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
            } else {
                console.log(`Captain ${captain._id} has no socketId, skipping`);
            }
        });
        
        console.log('Ride creation and broadcast complete');

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });
        console.log('Ride confirmed:', ride._id);
        console.log('Sending ride-confirmed event to user:', ride.user._id);
        
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.testCaptains = async (req, res) => {
    try {
        const mapService = require('../services/maps.service');
        
        // Test with Pune coordinates to match captain location
        const testLat = 18.5204;
        const testLng = 73.8567;
        const testRadius = 10;
        
        console.log('Testing captain search...');
        const captains = await mapService.getCaptainsInTheRadius(testLat, testLng, testRadius);
        
        return res.status(200).json({
            message: 'Captain search test completed',
            coordinates: { lat: testLat, lng: testLng, radius: testRadius },
            captainsFound: captains.length,
            captains: captains.map(c => ({
                id: c._id,
                name: `${c.fullname?.firstname} ${c.fullname?.lastname}`,
                socketId: c.socketId,
                status: c.status,
                location: c.location
            }))
        });
    } catch (error) {
        console.error('Test captains error:', error);
        return res.status(500).json({ message: error.message });
    }
}
