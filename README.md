# Ecommerce Project
...Ecommerece PERN app in process of building/completion. Will update later...
# PERN-Ecommerce-Store-project
This is **Portfolio Project #5** for my Full-stack web development course on Codecademy. This app is an Ecommerce store, names ***Reef Budz***,  where aquarists can browse and purchase saltwater creatures and coral fragments for their own saltwater reef tanks. Built using PERN (*PostgreSQL*, *Express*, *React*, *Node*) stack, this web app is a fully-functioning Ecommerce store with features common in most real-world Ecommerce stores.

**Read more to learn the technology behind the app, the app's features, and how the app operates via simulated workflow example!**

---

## I. Project Overview

- **What is this app?**
  It's a full-fledged Ecommerce site that sells Saltwater creatures and coral reef fragments for saltwater reef tanks. Users can browse the site, add products to cart, order products at    checkout, and view order details and history. 

- **What does it do?**
  It lets users browse products (tank creatures and coral frags), register/login account, purhcase products via checkout, view order history and details, etc.

- **Who is it for?**
  Anyone who wants a piece of the ocean with their own saltwater reef tank.

- <ins>**KEY Features<ins>:**
  - Public Features/Pages (available to all visitors):   
    - Products display
    - Product details page (to show details for a specific product)
    - Products search bar
    - Shopping cart
    - User login/registration page
  - Private Feature/Pages (**only** available after registing/logging-in)
    - User profile page
    - Checkout page for order
    - Order history to record all user's orders
    - Order details for each individual order
---

## II. Tech Stack

- **Vite**            — Main Web app development and build tool. Enables dividing the code between **React** frontend and **Node**/**Express** backend.
- **React**           — Frontend library for building user interfaces and their components.
- **Node**            — Provides a JavaScript runtime environment to run server-side scripts on backend.
- **Express**         — Backend framework used to define API endpoints that interact with database. Also used to setup a web server for handling HTTP/HTTPS request from React frontend/client-side.
- **PostgreSQL**      — Database of choice for app. Used to store product data, user accounts, and order history and details of users.
- **Render.com**      — Cloud platform used to host the **React** frontend/client-side as well as the **Node**/**Express** backend.
- **Neon.com**        — Cloud platform used to host web app's ***PostgreSQL*** database. Database interfaces with the app hosted on **Render.com**.
- **CSS**             — used for styling purposes.
- **React packages**  — imported packages for both frontend/client-side (**React**) as well as backend/server-side (**Node**/**Express**):

<ins>Main **'/Client'** packages for frontend/client-side *package.json* file:</ins>
| Package | Description |
| --- | --- |
| `vite`                  | Frontend build tool with a faster development server with hot module/code replacement.                      |
| `@vitejs/plugin-react`  | Plugin that adds *React* features and functionality on top of ***Vite***.                                   |
| `@fortawesome/...`      | Set of dependencies for using **Font Awesome** icons in the app.                                            |
| `@reduxjs/toolkit`      | Simplifies Redux logic with built-in methods like `createSlice()`, `configureStore()`, etc.                 |
| `@stripe/...`           | Set of dependencies for enabling ***Stripe*** payment processing during product checkout.                   |
| `@tanstack/react-table` | React library for building customizable tables, with features like sorting and filtering.                   |
| `axios`                 | Handles HTTP requests to fetch subreddit and post data from Reddit’s JSON API.                              |
| `dotenv`                | Loads environment variables from `.env` file to **process.env**, keeping sensitive configuration from code. |
| `react-dom`             | Renders React components into the browser's Document Object Model (DOM).                                    |
| `react-hot-toast`       | Library for creating and renderting success and failure notification messages ("toasts").                   |
| `react-redux`           | Connects React components to the Redux store using `useSelector`, `useDispatch`, etc.                       |
| `react-router-dom`      | Manages navigation and routing in the app using `Routes`, `BrowserRouter`, and `Link`.                      |

<ins>Main **'/Server'** packages for backend/server-side *package.json* file:</ins>
| Package | Description |
| --- | --- |
| `bcrypt`                 | Used to securely hash and compare user passwords for authentication.                                        |
| `cookie-parser`          | Parses cookies attached to client requests, helpful for managing sessions and storing non-sensitive data.   |
| `cors`                   | Enables Cross-Origin Resource Sharing so frontend (on different domain/port) can access backend APIs.       |
| `dotenv`                 | Loads environment variables from `.env` file to **process.env**, keeping sensitive configuration from code. |
| `express`                | Main web framework for building REST APIs and handling HTTP requests/responses.                             | 
| `express-session`        | Manages user sessions on the backend, useful for login state and tracking user activity.                    |
| `jsonwebtoken`           | Implements JWT functionalities, allowing for secure, stateless authentication and authorization.            |
| `passport`               | Provides a modular authentication middleware to support various login strategies (local, OAuth, etc.).      |
| `passport-google-oauth20`| Passport strategy for authenticating users via Google OAuth 2.0, enabling Google login.                     |
| `passport-local`         | Passport strategy for authenticating users with a username and password (local login).                      |
| `pg`                     | Node.js library for interfacing with PostgreSQL, enabling database queries and operations.                  |
| `stripe`                 | Enables backend integration with ***Stripe** payment gateway for processing payments and transactions.      |
| `swagger-jsdoc`          | Generates Swagger (OpenAPI) documentation from JSDoc comments in your codebase.                             |
| `swagger-ui-express`     | Serves the Swagger UI so user and others can interactively explore and test the API endpoints.              |

---

## III. Live Site Demo Walkthrough & Screenshots

--- 🔗 **Live Site:** [https://store.bpwisdom.com/](https://store.bpwisdom.com/)
