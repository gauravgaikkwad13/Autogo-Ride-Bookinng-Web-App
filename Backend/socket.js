const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} joined with socket ${socket.id}`);
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'active'
                });
                console.log(`Captain ${userId} joined with socket ${socket.id} and set to active`);
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            console.log(`Updating captain ${userId} location:`, location);

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    lat: location.lat,
                    lng: location.lng
                }
            });
        });

        socket.on('test-captain-connection', (data) => {
            console.log('Test captain connection received:', data);
            socket.emit('test-response', { 
                message: 'Socket connection working!', 
                received: data 
            });
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            // Set captain to inactive when they disconnect
            await captainModel.findOneAndUpdate(
                { socketId: socket.id },
                { status: 'inactive', socketId: null }
            );
            
            // Clear user socketId as well
            await userModel.findOneAndUpdate(
                { socketId: socket.id },
                { socketId: null }
            );
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Attempting to send message:');
    console.log('- Socket ID:', socketId);
    console.log('- Event:', messageObject.event);
    console.log('- Data:', JSON.stringify(messageObject.data, null, 2));

    if (io) {
        if (socketId) {
            io.to(socketId).emit(messageObject.event, messageObject.data);
            console.log('Message sent successfully to socket:', socketId);
        } else {
            console.log('No socket ID provided, cannot send message');
        }
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };