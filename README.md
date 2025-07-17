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
- **Hostinger.com**   — Hosting site used to obtain a domain name since authnetication cookies won't properly be sent from app to browser otherwise.
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
| `stripe`                 | Enables backend integration with ***Stripe*** payment gateway for processing payments and transactions.      |
| `swagger-jsdoc`          | Generates Swagger (OpenAPI) documentation from JSDoc comments in your codebase.                             |
| `swagger-ui-express`     | Serves the Swagger UI so user and others can interactively explore and test the API endpoints.              |

---

## III. Live Site Demo Walkthrough & Screenshots

🔗 **Live Site:** [store.bpwisdom.com](https://store.livedemoapp.com/)

<ins>**NOTE**</ins>: The above site link's domain may change, but the workflow and url routes should stay the same.

### 1. Home Page 
The homepage—*whose url routes end with '../products/all'*—is the default page for the app. Here the user can browse through a variety of products. On the top, there's a header menu with several buttons and a search bar. The buttons left of the search bar are ***category*** buttons that display products based on selected category—*button highlighted dark blue*—when selected; only the ***all*** button shows all products. At the bottom of the products display is the pagination page button(s) which is used to browse products.
<img src="https://github.com/user-attachments/assets/de1219da-ea33-47e4-866c-811f9d4b0a71" width="800" alt="image-of-home-page"/>

### 2. Product Details Page
Wheneven a user clicks on a product card, a product details page opens explains the clicked-on product in-depth.  Also, like in the product card, the user can click to add to cart as well as see the product stock and price. The below screenshot (partly zoomed out) is an example of a product details page.  
<img src="https://github.com/user-attachments/assets/6f4aed3c-58d2-4d9c-a1ae-6b4977f8b9aa" width="800" alt="example-image-of-product-details-page"/>

### 3. Product Search Bar
Besides filtering products via **"Category"** buttons, products can also be filtered via search box in header menu. The user can type a search query and then click on the "Magnifying glass" icon to submit search (or press ENTER). Then the filtered products will be returned, OR a message will be returned stating that no matching products exist. Also, when filtered products are returned, the matching text portion of the Product titles will be highlighted **yellow** to match the search query for visual user friendliness (see screenshot below). Finally, the cross **✕** in the search bar can be click on to clear the search and return all products. 
<img src="https://github.com/user-attachments/assets/f969da19-f56e-44d5-b47f-4f6236baa284" width="800" alt="image-of-search-results" />

### 4. Cart Slider
When ever the user clicks on an **Add to Cart** button on a product card, a product of the quanity of one is added to the cart Slider. The user can click on the cart button on the top-right to open the Cart Slider; then the user can click the **Close** button to close the slider. When a product has been added to the cart, a cart item card is created for that product; the user can adjust the cart item quantity—*up to 10 or less if product is stocked under 10*—as well as view the total and subtotal of costs. The user can even drop products from cart via 'X' button.

Lastly, the **Proceed to Checkout** button leads the user to the checkout page, but the checkout page is only accessible if user is logged in AND has at least 1 product in cart. Here's a screen shot of the cart slider (opened):
<img src="https://github.com/user-attachments/assets/b9ca2868-c385-4d92-9d9e-509fae9d846b" width="800" alt="image-of-cart-slider"/>

### 5. Login (and Register) Pages
When the user needs to login, the user can click on the header menu button with the login icon; this leads to the login page as shown in below screenshot. If the user needs to register first, the user needs to click on the **"New User? Sign Up here"** link to access the Registration page to fill out. <ins>Here's what the Login page looks like</ins>:  
<img src="https://github.com/user-attachments/assets/23be8e60-a813-45a3-bbb0-21e72dd913a9" width="800"  alt="image-of-login-page" />

<ins>Here's what the Account Registration page looks like (with a link to the Login page as well)</ins>:
<img src="https://github.com/user-attachments/assets/002b43c5-b102-4058-b4d4-ea854b9a61f4" width="800" alt="image-of-register-page" />


### 6. Profile Page
After logging in, the user gets redirected to their account profile page. On the header menu, it should visible that the ***login icon*** button is now replaced with a ***profile icon*** to indicate that the user has been logged in. Also, the user can click on the Profile icon to show a small menu that shows the user's *username* as well as links to the Profile and Order History pages and even a Logout button. 

Regarding the Profile page itself (seen below), the user can edit their profile fields by clicking the **'edit'** button next to each field and then click the changs using the **Save All Changes** button. These profile field values can later be called to help *"auto-fill"* the checkout page. 
<img src="https://github.com/user-attachments/assets/d1ebd2b2-f600-4a70-982f-97a478933719" width="800" alt="image-of-profile-page" />

### 7. Checkout Page
After logging in and adding at least 1 item to cart Slider (see **#4. Cart Slider** section from earlier), the user can the click on the **Proceed to Checkout** button to redirect to the checkout page. The checkout page is a single page with 4 sections. Each of the sections are explained below:

### 8. Order Details Page


### 9. Order History Page

---
## IV. Limitations of App
- Due to using free hosting for the app on ***Render.com*** and the database on ***Neon.com***, the app from the live demo link (https://store.livedemoapp.com/) might have slow performance. Initially, you might have to wait 15-20 seconds for a page to fully render. After page caching takes place, the app should run notable faster. *In the future*, I'll consider dedicated hosting options to speed up performance.
- On the order history page, I haven't added any type of order tracking for the orders. Due to this being a demo E-commerce store, there's no actual business infrastructure available to constantly keep track of orders; hence order tracking is irrelevant here.
---
## V. Steps to use App locally
---
## VI. Future Improvements and Considerations
---
## VII. Image Attributions
Numerous images were obtained during the creation of this fake E-commerce store app. Listed below are all the images obtained and used so far and with proper attribution practices.
<details>
  <summary>Image Attributions List</summary>
  <li>App Background Image: ...</li>
  <li>About Page images
    <ul>
      <li>Item Z1</li>
      <li>Item Z2</li>
    </ul>
  </li>
  <ul>
    <li>"Fishes" product card images
        <ul>
          <li>Item A1.1</li>
          <li>Item A1.2</li>
        </ul>
    </li>
    <li>"Invertebrates" product card images
      <ul>
        <li>Item B1</li>
        <li>Item B2</li>
      </ul>
    </li>
    <li>"Corals & Anemones" product card images
      <ul>
        <li>Item B1</li>
        <li>Item B2</li>
      </ul>
    </li>
  </ul>
  <li>Checkout Page images
    <ul>
      <li>Item X1</li>
      <li>Item X2</li>
    </ul>
  </li>
</details>
