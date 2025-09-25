const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    try {
        const distanceTime = await mapService.getDistanceTime(pickup, destination);
        console.log('Distance and time data:', distanceTime);

        // Enhanced pricing structure - more realistic rates
        const baseFare = {
            auto: 25,    // Base fare for auto-rickshaw
            car: 65,     // Base fare for car (higher for comfort)
            moto: 15     // Base fare for motorcycle (cheapest)
        };

        const perKmRate = {
            auto: 12,    // ₹12 per km for auto
            car: 18,     // ₹18 per km for car
            moto: 9      // ₹9 per km for moto
        };

        const perMinuteRate = {
            auto: 1.8,   // ₹1.8 per minute waiting/traffic time
            car: 2.5,    // ₹2.5 per minute for car
            moto: 1.2    // ₹1.2 per minute for moto
        };

        // Calculate distance in kilometers and duration in minutes
        const distanceKm = distanceTime.distance.value / 1000;
        const durationMinutes = distanceTime.duration.value / 60;

        console.log(`Distance: ${distanceKm.toFixed(2)} km, Duration: ${durationMinutes.toFixed(2)} minutes`);

        // Apply surge pricing based on current hour (simple implementation)
        const currentHour = new Date().getHours();
        let surgMultiplier = 1.0;

        // Peak hours surge pricing
        if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20)) {
            surgMultiplier = 1.3; // 30% surge during peak hours
            console.log('Peak hours detected - applying 30% surge pricing');
        }
        // Late night surge
        else if (currentHour >= 22 || currentHour <= 5) {
            surgMultiplier = 1.2; // 20% surge during late night
            console.log('Late night detected - applying 20% surge pricing');
        }

        // Calculate base fare for each vehicle type
        const calculateVehicleFare = (vehicleType) => {
            const base = baseFare[vehicleType];
            const distanceCost = distanceKm * perKmRate[vehicleType];
            const timeCost = durationMinutes * perMinuteRate[vehicleType];
            const subtotal = base + distanceCost + timeCost;
            
            // Apply surge multiplier
            const surgedFare = subtotal * surgMultiplier;
            
            // Apply minimum fare (to ensure drivers get decent compensation)
            const minimumFare = {
                auto: 40,
                car: 80,
                moto: 25
            };
            
            return Math.max(Math.round(surgedFare), minimumFare[vehicleType]);
        };

        const fare = {
            auto: calculateVehicleFare('auto'),
            car: calculateVehicleFare('car'),
            moto: calculateVehicleFare('moto')
        };

        // Add breakdown information for transparency
        const fareBreakdown = {
            auto: {
                baseFare: baseFare.auto,
                distanceFare: Math.round(distanceKm * perKmRate.auto),
                timeFare: Math.round(durationMinutes * perMinuteRate.auto),
                surgMultiplier: surgMultiplier,
                total: fare.auto
            },
            car: {
                baseFare: baseFare.car,
                distanceFare: Math.round(distanceKm * perKmRate.car),
                timeFare: Math.round(durationMinutes * perMinuteRate.car),
                surgMultiplier: surgMultiplier,
                total: fare.car
            },
            moto: {
                baseFare: baseFare.moto,
                distanceFare: Math.round(distanceKm * perKmRate.moto),
                timeFare: Math.round(durationMinutes * perMinuteRate.moto),
                surgMultiplier: surgMultiplier,
                total: fare.moto
            }
        };

        console.log('Calculated fares:', fare);
        console.log('Fare breakdown:', fareBreakdown);

        return {
            ...fare,
            breakdown: fareBreakdown,
            distance: distanceTime.distance.text,
            duration: distanceTime.duration.text,
            surgePricing: surgMultiplier > 1.0
        };
    } catch (error) {
        console.error('Error calculating fare:', error);
        throw new Error('Unable to calculate fare. Please try again.');
    }
}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    console.log('Creating ride with params:', { user, pickup, destination, vehicleType });
    
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    try {
        const fareData = await getFare(pickup, destination);
        console.log('Fare calculated:', fareData);

        // Extract distance and duration from fare calculation
        const distanceTime = await mapService.getDistanceTime(pickup, destination);

        const ride = await rideModel.create({
            user,
            pickup,
            destination,
            otp: getOtp(6),
            fare: fareData[vehicleType],
            distance: distanceTime.distance.value, // in meters
            duration: distanceTime.duration.value  // in seconds
        });
        
        console.log('Ride created successfully:', ride._id);
        console.log('Distance:', distanceTime.distance.text, 'Duration:', distanceTime.duration.text);
        return ride;
    } catch (error) {
        console.error('Error creating ride:', error);
        throw error;
    }
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

