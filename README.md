# Touchscreen POS Kiosk

A touchscreen Point-of-Sale (POS) kiosk developed for the IT415 Practical Examination.

The application allows customers to select products, review their order, choose a payment method, complete a simulated payment, and view a digital receipt.

## Main Features

- Touch-friendly product selection
- Product quantity management
- Order review
- Cash payment
- Simulated QR payment
- Simulated Credit/Debit Card payment
- Automatic cash change calculation
- Transaction reference generation
- Digital receipt
- New transaction/reset functionality
- Responsive laptop and mobile interface

## Technologies Used

- **HTML5** - Provides the structure of the POS kiosk interface.
- **CSS3** - Provides the responsive layout, styling, animations, and touchscreen-friendly design.
- **Vanilla JavaScript** - Handles product selection, cart management, calculations, payment simulation, transaction processing, and receipt generation.
- **Git** - Used for version control and development history.
- **GitHub** - Used for repository hosting, branches, commits, pull requests, and collaboration.

## Dependencies

The POS Kiosk does not require external JavaScript frameworks or package dependencies.

### Required

- A modern web browser such as Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Optional Development Tools

- Git
- Visual Studio Code or another code editor

No `npm install` or package installation is required.

## Setup

### 1. Clone the Repository

Open a terminal and run:

git clone https://github.com/kkey-byte/midterm-pos-kiosk.git

### 2. Enter the Project Directory

cd midterm-pos-kiosk

### 3. Verify the Project Files

The project should contain the main HTML, CSS, JavaScript, assets, and documentation files.

No additional dependency installation is required.

## Running the Application

### Method 1: Open Directly

1. Open the project folder.
2. Locate `index.html`.
3. Double-click `index.html` or open it using a modern web browser.
4. The POS Kiosk should open on the Order screen.

### Method 2: Using VS Code

1. Open the project folder in Visual Studio Code.
2. Locate `index.html`.
3. Open the file in your browser.
4. The POS Kiosk should display the Order screen.

## How to Use the POS Kiosk

1. **Order**
   - Select a product to add it to the cart.
   - Increase or decrease product quantities.
   - Remove products if necessary.

2. **Review**
   - Review the selected products.
   - Verify quantities, prices, subtotals, and total amount.
   - Select Continue to Payment.

3. **Payment**
   - Select Cash, QR Payment, or Credit/Debit Card.
   - Complete the simulated payment process.

4. **Receipt**
   - View the completed transaction information.
   - View or print the digital receipt.
   - Select New Transaction to begin another order.

   ## Data Storage

The POS Kiosk is a frontend-only application and does not use a backend server or database.

### Product Data

Product information such as product name and price is defined locally in the JavaScript source code.

### Transaction Data

During a transaction, JavaScript manages the current application state in memory, including:

- Selected products
- Product quantities
- Unit prices
- Subtotals
- Total amount
- Selected payment method
- Amount paid
- Change
- Transaction reference
- Receipt information

### Data Persistence

Transaction information is not permanently stored in a database.

When a new transaction is started, the previous transaction state is cleared and the kiosk returns to the Order screen.

## Project Structure

midterm-pos-kiosk/
│
├── index.html          # Main application interface
├── style.css           # Application styling and responsive design
├── script.js           # POS functionality and transaction logic
│
├── assets/
│   └── products/       # Product images
│
├── docs/               # Project documentation
│
└── README.md           # Project setup and documentation

