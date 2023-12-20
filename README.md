# Payment Confirmation Server with Socket.IO

This Node.js server implements real-time communication using Socket.IO to manage payment confirmations across different tabs or clients.

### Technologies Used:

- **Node.js**: Runtime environment for the server.
- **Express**: Web framework used for routing.
- **Socket.IO**: Library for real-time bidirectional event-based communication.

### Features:

- **Cross-Origin Resource Sharing (CORS)**: Configured to handle cross-origin requests.
- **Socket.IO Server Setup**: Utilizes Socket.IO to manage WebSocket connections.
- **Socket Events**:
  - `connection`: Logs when a client connects and assigns a room ID.
  - `paymentPageConnected`: Handles connections from payment pages, emits payment alerts to all clients.
  - `join_success_room`: Allows sockets to join a specific room for the success page.
  - `clicked` and `canceled`: Manage confirmation and cancellation of payments, emit success or failure messages to specific tab IDs.
- **Server Listening**: Runs on port 3009.

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Make sure that the server is runnning on specified port.

### Deployemnt

this server is deployed on render.com.
