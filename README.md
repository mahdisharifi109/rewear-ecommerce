# Rewear - Second Hand Fashion Marketplace

Rewear is a modern C2C (Consumer-to-Consumer) fashion marketplace application built with **React**, **Tailwind CSS**, **Node.js**, and **MySQL**. It features a clean, responsive UI inspired by platforms like Vinted, with AI-powered features for product listing.

## Features

- 🛍️ **Browse & Search**: Advanced filtering by category, size, price, and sorting.
- 💾 **State Persistence**: Search filters and user preferences are saved automatically so you don't lose your place.
- 🤖 **AI-Assisted Selling**: Uses Google Gemini API to auto-generate product descriptions based on item details.
- 📱 **Responsive Design**: Fully mobile-optimized interface with a drawer menu.
- ⚡ **Performance**: Built with React and optimized for fast interactions.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Local State & URL Parameters
- **AI Integration**: Google GenAI SDK

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/components`: Reusable UI components (Header, ProductCard, etc.)
- `/src/pages`: Main view components (Home, Search, ProductDetails, etc.)
- `/src/features`: Feature-specific logic (products, actions, etc.)
- `/src/lib`: Utilities and configuration

## License

MIT
