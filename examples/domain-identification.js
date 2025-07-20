// Domain Identification and Modeling

// ========================================
// IDENTIFYING DOMAINS IN A REAL APPLICATION
// ========================================

// Imagine we're building a "Smart City Management System"
// Let's identify the different domains:

// 1. TRANSPORTATION DOMAIN
class TransportationDomain {
  constructor() {
    this.vehicles = [];
    this.routes = [];
    this.schedules = [];
  }

  // Domain concepts
  addVehicle(vehicle) {
    this.vehicles.push(vehicle);
  }

  createRoute(start, end, stops) {
    const route = new Route(start, end, stops);
    this.routes.push(route);
    return route;
  }

  scheduleTrip(vehicle, route, time) {
    const schedule = new Schedule(vehicle, route, time);
    this.schedules.push(schedule);
    return schedule;
  }
}

class Vehicle {
  constructor(id, type, capacity) {
    this.id = id;
    this.type = type; // bus, train, subway
    this.capacity = capacity;
    this.currentLocation = null;
  }

  moveTo(location) {
    this.currentLocation = location;
  }
}

class Route {
  constructor(start, end, stops) {
    this.start = start;
    this.end = end;
    this.stops = stops;
  }

  calculateDistance() {
    // Domain logic for calculating route distance
    return this.stops.length * 2; // Simplified
  }
}

// 2. ENERGY DOMAIN
class EnergyDomain {
  constructor() {
    this.powerPlants = [];
    this.consumers = [];
    this.grid = new PowerGrid();
  }

  addPowerPlant(plant) {
    this.powerPlants.push(plant);
    this.grid.connectPlant(plant);
  }

  addConsumer(consumer) {
    this.consumers.push(consumer);
    this.grid.connectConsumer(consumer);
  }

  calculateDemand() {
    return this.consumers.reduce((total, consumer) => {
      return total + consumer.currentConsumption;
    }, 0);
  }
}

class PowerPlant {
  constructor(id, type, capacity) {
    this.id = id;
    this.type = type; // solar, wind, nuclear
    this.capacity = capacity;
    this.currentOutput = 0;
  }

  generatePower(amount) {
    if (amount <= this.capacity) {
      this.currentOutput = amount;
      return amount;
    }
    return 0;
  }
}

// 3. WASTE MANAGEMENT DOMAIN
class WasteManagementDomain {
  constructor() {
    this.collectionPoints = [];
    this.trucks = [];
    this.recyclingCenters = [];
  }

  addCollectionPoint(location, type) {
    const point = new CollectionPoint(location, type);
    this.collectionPoints.push(point);
    return point;
  }

  scheduleCollection(point, truck, time) {
    const collection = new Collection(point, truck, time);
    return collection;
  }
}

class CollectionPoint {
  constructor(location, type) {
    this.location = location;
    this.type = type; // organic, recyclable, hazardous
    this.currentLevel = 0;
    this.capacity = 100;
  }

  addWaste(amount) {
    if (this.currentLevel + amount <= this.capacity) {
      this.currentLevel += amount;
      return true;
    }
    return false;
  }

  needsCollection() {
    return this.currentLevel > 80; // 80% full
  }
}

// ========================================
// DOMAIN BOUNDARIES AND INTERACTIONS
// ========================================

// How domains interact with each other
class SmartCityCoordinator {
  constructor() {
    this.transportation = new TransportationDomain();
    this.energy = new EnergyDomain();
    this.waste = new WasteManagementDomain();
  }

  // Cross-domain operations
  optimizeCityOperations() {
    // Transportation affects energy consumption
    const vehicleCount = this.transportation.vehicles.length;
    const energyDemand = this.energy.calculateDemand();
    
    // Waste collection affects transportation
    const collectionPoints = this.waste.collectionPoints.filter(
      point => point.needsCollection()
    );
    
    return {
      vehicleCount,
      energyDemand,
      pendingCollections: collectionPoints.length
    };
  }
}

// ========================================
// DOMAIN EVENTS (Cross-domain communication)
// ========================================

class DomainEvent {
  constructor(type, data, timestamp = new Date()) {
    this.type = type;
    this.data = data;
    this.timestamp = timestamp;
  }
}

class EventBus {
  constructor() {
    this.listeners = {};
  }

  publish(event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach(listener => {
        listener(event);
      });
    }
  }

  subscribe(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }
}

// ========================================
// USAGE EXAMPLE
// ========================================

console.log('=== DOMAIN IDENTIFICATION EXAMPLE ===\n');

// Create city coordinator
const city = new SmartCityCoordinator();

// Transportation domain
console.log('1. TRANSPORTATION DOMAIN:');
const bus = new Vehicle('BUS001', 'bus', 50);
const route = city.transportation.createRoute('Downtown', 'Airport', ['Station A', 'Station B']);
city.transportation.addVehicle(bus);
console.log(`Added ${bus.type} with capacity ${bus.capacity}`);

// Energy domain
console.log('\n2. ENERGY DOMAIN:');
const solarPlant = new PowerPlant('SOLAR001', 'solar', 1000);
city.energy.addPowerPlant(solarPlant);
console.log(`Added ${solarPlant.type} power plant with capacity ${solarPlant.capacity}MW`);

// Waste management domain
console.log('\n3. WASTE MANAGEMENT DOMAIN:');
const collectionPoint = city.waste.addCollectionPoint('Downtown Park', 'organic');
collectionPoint.addWaste(85);
console.log(`Collection point at ${collectionPoint.location} is ${collectionPoint.currentLevel}% full`);
console.log(`Needs collection: ${collectionPoint.needsCollection()}`);

// Cross-domain optimization
console.log('\n4. CROSS-DOMAIN COORDINATION:');
const optimization = city.optimizeCityOperations();
console.log('City optimization report:');
console.log(`- Vehicles: ${optimization.vehicleCount}`);
console.log(`- Energy demand: ${optimization.energyDemand}MW`);
console.log(`- Pending collections: ${optimization.pendingCollections}`);

console.log('\n=== DOMAIN CHARACTERISTICS ===');
console.log('✅ Each domain has its own concepts and rules');
console.log('✅ Domains can interact but remain independent');
console.log('✅ Business logic is contained within domains');
console.log('✅ Clear boundaries between different areas of expertise');
console.log('✅ Focus on what each domain does, not how it does it'); 