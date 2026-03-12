module.exports = function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-branch-queue', (branchId) => {
      socket.join(`queue-${branchId}`);
      console.log(`Socket ${socket.id} joined queue-${branchId}`);
    });

    socket.on('leave-branch-queue', (branchId) => {
      socket.leave(`queue-${branchId}`);
      console.log(`Socket ${socket.id} left queue-${branchId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
