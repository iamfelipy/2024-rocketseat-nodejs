// Domain-Driven Design (DDD) - Domain Concepts

// ========================================
// DOMAIN: E-COMMERCE
// ========================================

// Domain Entities (Entidades do Domínio)
class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  // Domain Logic (Lógica de Negócio)
  isAvailable() {
    return this.stock > 0;
  }

  reserveStock(quantity) {
    if (this.stock >= quantity) {
      this.stock -= quantity;
      return true;
    }
    return false;
  }

  calculatePriceWithTax(taxRate) {
    return this.price * (1 + taxRate);
  }
}

class Order {
  constructor(id, customerId, items = []) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  // Domain Logic
  addItem(product, quantity) {
    if (!product.isAvailable()) {
      throw new Error('Product not available');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    this.items.push({ product, quantity });
    product.reserveStock(quantity);
  }

  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  canBeCancelled() {
    return this.status === 'pending' || this.status === 'confirmed';
  }

  cancel() {
    if (!this.canBeCancelled()) {
      throw new Error('Order cannot be cancelled');
    }
    this.status = 'cancelled';
  }
}

// ========================================
// DOMAIN: BANKING
// ========================================

class BankAccount {
  constructor(accountNumber, balance = 0) {
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.transactions = [];
  }

  // Domain Logic
  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    this.balance += amount;
    this.transactions.push({
      type: 'deposit',
      amount,
      date: new Date()
    });
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }

    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }

    this.balance -= amount;
    this.transactions.push({
      type: 'withdrawal',
      amount,
      date: new Date()
    });
  }

  transfer(amount, targetAccount) {
    this.withdraw(amount);
    targetAccount.deposit(amount);
  }
}

// ========================================
// DOMAIN SERVICES (Serviços do Domínio)
// ========================================

class OrderService {
  constructor(inventoryService, paymentService) {
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
  }

  // Domain Logic that coordinates multiple entities
  processOrder(order, paymentMethod) {
    // Validate order
    if (order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    // Check inventory
    const hasStock = order.items.every(item => 
      item.product.stock >= item.quantity
    );

    if (!hasStock) {
      throw new Error('Some items are out of stock');
    }

    // Process payment
    const total = order.calculateTotal();
    const paymentResult = this.paymentService.processPayment(total, paymentMethod);

    if (paymentResult.success) {
      order.status = 'confirmed';
      this.inventoryService.updateStock(order);
      return { success: true, orderId: order.id };
    } else {
      throw new Error('Payment failed');
    }
  }
}

// ========================================
// VALUE OBJECTS (Objetos de Valor)
// ========================================

class Money {
  constructor(amount, currency = 'USD') {
    this.amount = amount;
    this.currency = currency;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor) {
    return new Money(this.amount * factor, this.currency);
  }
}

class Email {
  constructor(value) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
    this.value = value;
  }

  isValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ========================================
// USAGE EXAMPLES
// ========================================

console.log('=== DOMAIN CONCEPTS IN DDD ===\n');

// E-commerce Domain Example
console.log('1. E-COMMERCE DOMAIN:');
const product = new Product(1, 'iPhone 15', 999.99, 10);
const order = new Order(1, 'customer-123');

order.addItem(product, 2);
console.log(`Order total: $${order.calculateTotal()}`);
console.log(`Product stock after order: ${product.stock}`);

// Banking Domain Example
console.log('\n2. BANKING DOMAIN:');
const account1 = new BankAccount('12345', 1000);
const account2 = new BankAccount('67890', 500);

account1.transfer(300, account2);
console.log(`Account 1 balance: $${account1.balance}`);
console.log(`Account 2 balance: $${account2.balance}`);

// Value Objects Example
console.log('\n3. VALUE OBJECTS:');
const price1 = new Money(100, 'USD');
const price2 = new Money(50, 'USD');
const totalPrice = price1.add(price2);
console.log(`Total price: $${totalPrice.amount} ${totalPrice.currency}`);

const email = new Email('user@example.com');
console.log(`Valid email: ${email.value}`);

console.log('\n=== DOMAIN CHARACTERISTICS ===');
console.log('✅ Contains business logic and rules');
console.log('✅ Independent of infrastructure');
console.log('✅ Represents real-world concepts');
console.log('✅ Has clear boundaries and responsibilities');
console.log('✅ Focuses on what the business does, not how'); 