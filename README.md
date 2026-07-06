# TraceIt

<div align="center">
  <img src="public/traceitLogoColor.png" alt="TraceIt logo" width="140" />
  <h3>Modern tracking for money, insights, and everyday operations</h3>
  <p>TraceIt is a full-stack web application built with Laravel, React, and Inertia to help users monitor savings, spending, dashboards, and inventory-related workflows in a polished, modern experience.</p>
</div>

## 🌟 Overview

TraceIt brings together a clean user experience and a robust backend so people and small teams can:

- 💰 track savings and spendings with clear records
- 📊 view analytics for day, week, month, and year perspectives
- 🧾 manage bulk entries quickly without a clunky spreadsheet
- 📦 work with inventory-related data models and workflows for stock awareness

The application is designed to feel fast, responsive, and practical for real-world personal finance and operational tracking.

## ✨ Key Features

- 📈 Dashboard analytics with line and pie charts
- 💸 Savings and spending record management
- 🧠 Summary cards for balance, totals, categories, and today's activity
- 🔐 Authentication, profile, and settings flows
- ⚡ Fast frontend experience with React + Inertia
- 🧱 Inventory domain structure for stock and batch-oriented use cases

## 🛠️ Tech Stack

| Layer | Technology | Why it fits |
|---|---|---|
| Backend | Laravel 12 + PHP 8.2 | Secure, scalable, and ideal for business logic, validation, and database operations |
| Frontend | React 19 + Inertia.js | Combines the speed of a SPA with Laravel-friendly routing and server-driven data |
| Styling | Tailwind CSS 4 | Fast UI development with clean, maintainable design systems |
| Build Tool | Vite 6 | Excellent developer experience with quick hot reload and efficient builds |
| Testing | Pest | Modern, expressive testing for Laravel apps |
| Auth & Routing | Laravel Breeze-style flows + Ziggy | Smooth authentication and route handling across the app |

## 🧩 Architecture at a Glance

TraceIt follows a modern web-app architecture:

- Laravel handles requests, validation, persistence, and business rules
- Inertia bridges Laravel and React without needing a separate API layer
- React components render the interactive UI and charts
- Tailwind provides the visual structure and responsive layout

This approach is especially useful in real-world products because it reduces complexity while keeping the app feel fast and maintainable.

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Gaurav-mgr/TraceIt.git
cd TraceIt
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Run the app

```bash
npm run dev
```

Or start the Laravel server separately:

```bash
php artisan serve
```

## 💡 Example Code Snippets

### Laravel controller example

```php
public function index(Request $request): Response
{
    $records = $request->user()
        ->moneyRecords()
        ->orderBy('recorded_at')
        ->get();

    return Inertia::render('dashboard', [
        'summary' => [
            'savings' => (float) $records->where('type', MoneyRecord::TYPE_SAVING)->sum('amount'),
            'spendings' => (float) $records->where('type', MoneyRecord::TYPE_SPENDING)->sum('amount'),
        ],
    ]);
}
```

### React dashboard example

```tsx
const net = summary.todaySavings - summary.todaySpendings;

return (
  <div className="rounded-xl bg-white p-4 shadow-sm">
    <h2 className="text-lg font-semibold">Today's balance</h2>
    <p className="text-2xl font-bold">₹ {net.toFixed(2)}</p>
  </div>
);
```

## 🌍 Why This Stack Works in the Real World

This stack is a strong fit for practical applications because it balances speed, reliability, and developer productivity:

- 🛡️ Laravel offers a secure backend foundation with built-in authentication, validation, and ORM support
- ⚛️ React makes complex UIs interactive and maintainable
- 🔗 Inertia removes the friction of building a separate API for every screen
- 🎨 Tailwind makes it easy to ship polished, responsive UI quickly
- ⚙️ Vite keeps development and deployment efficient for modern web teams

For small businesses, personal finance tools, and internal productivity apps, this combination is dependable and scalable without becoming overly complex.

## 📁 Project Structure

```text
app/               # Laravel controllers, models, middleware
resources/js/     # React + Inertia pages and components
routes/            # Application routes
database/          # Migrations and seeders
public/            # Static assets and logos
```

## 🤝 Contributing

Contributions are welcome. If you would like to improve TraceIt, please open an issue or submit a pull request with a clear description of the change.

## 📄 License

This project is open-source and available under the MIT license.
