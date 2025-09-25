const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

// Test endpoint to check captain connectivity
router.get('/test-captains',
    authMiddleware.authUser,
    rideController.testCaptains
)

// Debug endpoint to check ride data
router.get('/debug-ride/:rideId',
    authMiddleware.authCaptain,
    async (req, res) => {
        try {
            const rideModel = require('../models/ride.model');
            const ride = await rideModel.findById(req.params.rideId).populate('user').populate('captain');
            
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found' });
            }
            
            return res.status(200).json({
                message: 'Ride data retrieved successfully',
                ride: ride,
                hasDistance: !!ride.distance,
                hasDuration: !!ride.duration,
                distanceMeters: ride.distance,
                distanceKm: ride.distance ? (ride.distance / 1000).toFixed(1) : 'N/A'
            });
        } catch (error) {
            console.error('Debug ride error:', error);
            return res.status(500).json({ message: error.message });
        }
    }
)

module.exports = router;
