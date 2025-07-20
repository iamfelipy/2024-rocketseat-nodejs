// Simple in-memory pub/sub implementation
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // Unsubscribe from an event
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    const index = this.events[eventName].indexOf(callback);
    if (index > -1) {
      this.events[eventName].splice(index, 1);
    }
  }

  // Emit an event
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });
  }

  // Remove all listeners for an event
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

// Usage example
const eventBus = new EventEmitter();

// Subscriber 1
eventBus.on('user.created', (userData) => {
  console.log('Subscriber 1: User created:', userData);
});

// Subscriber 2
eventBus.on('user.created', (userData) => {
  console.log('Subscriber 2: Sending welcome email to:', userData.email);
});

// Subscriber 3 (different event)
eventBus.on('user.deleted', (userData) => {
  console.log('Subscriber 3: User deleted:', userData);
});

// Publisher
console.log('Publishing user.created event...');
eventBus.emit('user.created', { id: 1, name: 'John Doe', email: 'john@example.com' });

console.log('\nPublishing user.deleted event...');
eventBus.emit('user.deleted', { id: 1, name: 'John Doe' });

// Remove specific listener
const welcomeEmailHandler = (userData) => {
  console.log('Subscriber 2: Sending welcome email to:', userData.email);
};

eventBus.off('user.created', welcomeEmailHandler);

console.log('\nAfter removing welcome email handler...');
eventBus.emit('user.created', { id: 2, name: 'Jane Smith', email: 'jane@example.com' }); 