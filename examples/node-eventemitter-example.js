const { EventEmitter } = require('events');

// Create a custom event emitter
class UserService extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  createUser(userData) {
    const user = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date()
    };
    
    this.users.push(user);
    
    // Emit event with user data
    this.emit('user.created', user);
    
    return user;
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = this.users[userIndex];
    this.users.splice(userIndex, 1);
    
    // Emit event with user data
    this.emit('user.deleted', user);
    
    return user;
  }

  updateUser(userId, updates) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, updates, { updatedAt: new Date() });
    
    // Emit event with user data
    this.emit('user.updated', user);
    
    return user;
  }
}

// Create service instance
const userService = new UserService();

// Email service subscriber
userService.on('user.created', (user) => {
  console.log(`📧 Sending welcome email to: ${user.email}`);
});

userService.on('user.deleted', (user) => {
  console.log(`📧 Sending goodbye email to: ${user.email}`);
});

// Analytics service subscriber
userService.on('user.created', (user) => {
  console.log(`📊 Analytics: New user registered - ${user.name}`);
});

userService.on('user.updated', (user) => {
  console.log(`📊 Analytics: User updated - ${user.name}`);
});

// Notification service subscriber
userService.on('user.created', (user) => {
  console.log(`🔔 Notification: Welcome ${user.name}!`);
});

// Database backup service (runs once)
userService.once('user.created', (user) => {
  console.log(`💾 Database backup: New user data backed up for ${user.name}`);
});

// Error handling
userService.on('error', (error) => {
  console.error('❌ User service error:', error.message);
});

// Usage
console.log('=== User Service Demo ===\n');

try {
  // Create users
  console.log('Creating users...');
  const user1 = userService.createUser({ name: 'John Doe', email: 'john@example.com' });
  const user2 = userService.createUser({ name: 'Jane Smith', email: 'jane@example.com' });
  
  console.log('\nUpdating user...');
  userService.updateUser(1, { name: 'John Updated' });
  
  console.log('\nDeleting user...');
  userService.deleteUser(2);
  
} catch (error) {
  console.error('Error:', error.message);
}

// Listener count
console.log(`\n📈 Total listeners for 'user.created': ${userService.listenerCount('user.created')}`);
console.log(`📈 Total listeners for 'user.updated': ${userService.listenerCount('user.updated')}`);
console.log(`📈 Total listeners for 'user.deleted': ${userService.listenerCount('user.deleted')}`); 