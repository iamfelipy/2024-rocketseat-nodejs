// Different types of communication patterns

// 1. SYNCHRONOUS COMMUNICATION (Direct function calls)
class UserService {
  constructor() {
    this.emailService = new EmailService();
    this.analyticsService = new AnalyticsService();
  }

  createUser(userData) {
    // Synchronous - waits for each step to complete
    const user = this.validateUser(userData);
    this.emailService.sendWelcomeEmail(user);  // Blocks here
    this.analyticsService.trackUserCreation(user);  // Blocks here
    return user;
  }

  validateUser(userData) {
    return { id: 1, ...userData };
  }
}

// 2. ASYNCHRONOUS COMMUNICATION (Event-driven)
class UserServiceAsync {
  constructor() {
    this.events = {};
  }

  createUser(userData) {
    const user = this.validateUser(userData);
    
    // Asynchronous - doesn't wait
    this.emit('user.created', user);
    
    return user;
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        // Execute asynchronously
        setImmediate(() => callback(data));
      });
    }
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  validateUser(userData) {
    return { id: 1, ...userData };
  }
}

// Supporting services
class EmailService {
  sendWelcomeEmail(user) {
    console.log(`📧 Sending welcome email to ${user.email} (SYNC)`);
  }
}

class AnalyticsService {
  trackUserCreation(user) {
    console.log(`📊 Tracking user creation for ${user.name} (SYNC)`);
  }
}

// Event-driven services
class EmailServiceAsync {
  constructor(userService) {
    userService.on('user.created', (user) => {
      console.log(`📧 Sending welcome email to ${user.email} (ASYNC)`);
    });
  }
}

class AnalyticsServiceAsync {
  constructor(userService) {
    userService.on('user.created', (user) => {
      console.log(`📊 Tracking user creation for ${user.name} (ASYNC)`);
    });
  }
}

// 3. CALLBACK-BASED COMMUNICATION
class UserServiceCallback {
  createUser(userData, callback) {
    const user = this.validateUser(userData);
    
    // Callback pattern
    this.emailService.sendWelcomeEmail(user, (error) => {
      if (error) {
        return callback(error);
      }
      
      this.analyticsService.trackUserCreation(user, (error) => {
        if (error) {
          return callback(error);
        }
        
        callback(null, user);
      });
    });
  }

  validateUser(userData) {
    return { id: 1, ...userData };
  }
}

// 4. PROMISE-BASED COMMUNICATION
class UserServicePromise {
  async createUser(userData) {
    const user = this.validateUser(userData);
    
    try {
      await this.emailService.sendWelcomeEmail(user);
      await this.analyticsService.trackUserCreation(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  validateUser(userData) {
    return { id: 1, ...userData };
  }
}

// Demo
console.log('=== Communication Types Demo ===\n');

// Synchronous
console.log('1. SYNCHRONOUS COMMUNICATION:');
const userService = new UserService();
userService.createUser({ name: 'John', email: 'john@example.com' });

// Asynchronous (Event-driven)
console.log('\n2. ASYNCHRONOUS COMMUNICATION (Event-driven):');
const userServiceAsync = new UserServiceAsync();
new EmailServiceAsync(userServiceAsync);
new AnalyticsServiceAsync(userServiceAsync);
userServiceAsync.createUser({ name: 'Jane', email: 'jane@example.com' });

// Comparison
console.log('\n=== COMMUNICATION COMPARISON ===');
console.log('| Type           | Coupling | Performance | Complexity |');
console.log('|----------------|----------|-------------|------------|');
console.log('| Synchronous    | High     | Slower      | Low        |');
console.log('| Event-driven   | Low      | Faster      | Medium     |');
console.log('| Callbacks      | Medium   | Medium      | High       |');
console.log('| Promises       | Medium   | Medium      | Medium     |');

console.log('\n=== WHEN TO USE EACH ===');
console.log('✅ Synchronous: Simple operations, need immediate result');
console.log('✅ Event-driven: Loose coupling, multiple listeners');
console.log('✅ Callbacks: Legacy code, simple async operations');
console.log('✅ Promises: Modern async/await, error handling'); 