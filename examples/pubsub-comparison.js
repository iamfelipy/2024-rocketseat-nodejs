// Comparison of different pub/sub approaches

// 1. IN-MEMORY PUB/SUB (Good for small projects)
class InMemoryPubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// 2. REDIS PUB/SUB (Good for multiple processes)
class RedisPubSub {
  constructor() {
    // This would require redis client
    console.log('Redis Pub/Sub would be used here');
  }

  subscribe(event, callback) {
    console.log(`Subscribing to Redis channel: ${event}`);
  }

  publish(event, data) {
    console.log(`Publishing to Redis channel: ${event}`, data);
  }
}

// 3. MESSAGE QUEUE (Good for reliability)
class MessageQueuePubSub {
  constructor() {
    // This would require RabbitMQ, Kafka, etc.
    console.log('Message Queue Pub/Sub would be used here');
  }

  subscribe(event, callback) {
    console.log(`Subscribing to queue: ${event}`);
  }

  publish(event, data) {
    console.log(`Publishing to queue: ${event}`, data);
  }
}

// Usage examples
console.log('=== Pub/Sub Comparison ===\n');

// Scenario 1: Single process application
console.log('1. SINGLE PROCESS (In-Memory is perfect)');
const inMemoryBus = new InMemoryPubSub();

inMemoryBus.subscribe('user.created', (user) => {
  console.log('  📧 Send welcome email');
  console.log('  📊 Update analytics');
  console.log('  🔔 Send notification');
});

inMemoryBus.publish('user.created', { name: 'John', email: 'john@example.com' });

// Scenario 2: Multiple processes (need Redis)
console.log('\n2. MULTIPLE PROCESSES (Need Redis)');
const redisBus = new RedisPubSub();
redisBus.subscribe('user.created', (user) => {
  console.log('  📧 Send welcome email (Process A)');
});
redisBus.publish('user.created', { name: 'Jane', email: 'jane@example.com' });

// Scenario 3: High reliability (need Message Queue)
console.log('\n3. HIGH RELIABILITY (Need Message Queue)');
const queueBus = new MessageQueuePubSub();
queueBus.subscribe('order.placed', (order) => {
  console.log('  💳 Process payment');
  console.log('  📦 Update inventory');
  console.log('  📧 Send confirmation');
});
queueBus.publish('order.placed', { id: 123, amount: 99.99 });

// Decision matrix
console.log('\n=== DECISION MATRIX ===');
console.log('| Scenario                    | In-Memory | Redis | Message Queue |');
console.log('|----------------------------|-----------|-------|---------------|');
console.log('| Single process             | ✅ Perfect| ❌ Overkill | ❌ Overkill |');
console.log('| Multiple processes         | ❌ Won\'t work | ✅ Good | ✅ Good |');
console.log('| High reliability needed    | ❌ No persistence | ⚠️ Limited | ✅ Perfect |');
console.log('| Real-time communication    | ✅ Fast | ✅ Fast | ⚠️ Latency |');
console.log('| Event replay needed        | ❌ No | ⚠️ Limited | ✅ Perfect |');
console.log('| Simple setup               | ✅ Easiest | ⚠️ Medium | ❌ Complex |');

// Migration path
console.log('\n=== MIGRATION PATH ===');
console.log('1. Start with In-Memory for small projects');
console.log('2. Migrate to Redis when you need multiple processes');
console.log('3. Migrate to Message Queue when you need reliability');
console.log('4. Consider Event Sourcing for complex event-driven architectures'); 