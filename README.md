# PERN-Ecommerce-Store-project
This is **Portfolio Project #5** for my Full-stack web development course on Codecademy. This app is an Ecommerce store, named ***Reef Budz***,  where aquarists can browse and purchase saltwater creatures and coral fragments for their own saltwater reef tanks. Built using PERN (*PostgreSQL*, *Express*, *React*, *Node*) stack, this web app is a fully-functioning Ecommerce store with features common in most real-world Ecommerce stores.

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
- **Canva.com**       — Used for image editing, espcially for the product card and background images throughout the app.
- **Render.com**      — Cloud platform used to host the **React** frontend/client-side as well as the **Node**/**Express** backend.
- **Neon.com**        — Cloud platform used to host web app's ***PostgreSQL*** database. Database interfaces with the app hosted on **Render.com**.
- **Hostinger.com**   — Hosting site used to obtain a domain name since authnetication cookies won't properly be sent from app to browser otherwise.
- **CSS**             — used for styling purposes.
- **React packages**  — imported packages for both frontend/client-side (**React**) as well as backend/server-side (**Node**/**Express**):

<details>
<summary><ins>Main <strong>'/Client'</strong> packages for frontend/client-side <em>package.json</em> file:</ins></summary>

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

</details>


<details>
<summary><ins>Main <strong>'/Server'</strong> packages for backend/server-side <em>package.json</em> file:</ins></summary>

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

</details>

---

## III. Live Site Demo Walkthrough & Screenshots

🔗 **Live Site:** [store.livedemoapp.com](https://store.livedemoapp.com) *(Right-click to open in new tab for best experience)*


<ins>**NOTE**</ins>: The above site link's domain may change, but the workflow and url routes should stay the same. I'll go over the app's main pages in the order users would typically see in an E-commerce lifecycle workflow. 

### 1. Home Page 
The homepage—*whose url routes end with '../products/all'*—is the default page for the app. Here the user can browse through a variety of products. On the top, there's a header menu with several buttons and a search bar. The buttons left of the search bar are ***category*** buttons that display products based on selected category—*button highlighted dark blue*—when selected; only the ***all*** button shows all products. At the bottom of the products display is the pagination page button(s) which is used to browse products.
<img src="https://github.com/user-attachments/assets/de1219da-ea33-47e4-866c-811f9d4b0a71" width="800" alt="image-of-home-page"/>

### 2. Product Details Page
Wheneven a user clicks on a product card, a product details page opens explains the clicked-on product in-depth.  Also, like in the product card, the user can click to add to cart as well as see the product stock and price. The below screenshot (partly zoomed out) is an example of a product details page.  
<img src="https://github.com/user-attachments/assets/6f4aed3c-58d2-4d9c-a1ae-6b4977f8b9aa" width="800" alt="example-image-of-product-details-page"/>

### 3. Product Search Bar
Besides filtering products via **"Category"** buttons, products can also be filtered via search box in header menu. The user can type a search query and then click on the "Magnifying glass" icon to submit search (or press ENTER). Then the filtered products will be returned, OR a message will be returned stating that no matching products exist. Also, when filtered products are returned, the matching text portion of the Product titles will be highlighted **yellow** to match the search query for visual user friendliness (see screenshot below). Finally, the cross **✕** in the search bar can be click on to clear the search and return all products. 
<img src="https://github.com/user-attachments/assets/f969da19-f56e-44d5-b47f-4f6236baa284" width="800" alt="image-of-search-results" />

### 4. About Page
To help complete the feel of the fake E-commerce, I've included an ***About*** page explaining what the fake store is about. This ***About*** page can be accessed by clicking the green button—*with the "info" icon*—on the header menu.
<img src="https://github.com/user-attachments/assets/b30db503-7859-4374-b3ac-b5a7efbd9b2f" width="800" alt="image-of-about-page" />

### 5. Cart Slider
When ever the user clicks on an **Add to Cart** button on a product card, a product of the quanity of one is added to the cart Slider. The user can click on the cart button on the top-right to open the Cart Slider; then the user can click the **Close** button to close the slider. When a product has been added to the cart, a cart item card is created for that product; the user can adjust the cart item quantity—*up to 10 or less if product is stocked under 10*—as well as view the total and subtotal of costs. The user can even drop products from cart via 'X' button.

Lastly, the **Proceed to Checkout** button leads the user to the checkout page, but the checkout page is only accessible if user is logged in AND has at least 1 product in cart. Here's a screen shot of the cart slider (opened):
<img src="https://github.com/user-attachments/assets/b9ca2868-c385-4d92-9d9e-509fae9d846b" width="800" alt="image-of-cart-slider"/>

### 6. Login (and Register) Pages
When the user needs to login, the user can click on the header menu button with the login icon; this leads to the login page as shown in below screenshot. If the user needs to register first, the user needs to click on the **"New User? Sign Up here"** link to access the Registration page to fill out. <ins>Here's what the Login page looks like</ins>:  
<img src="https://github.com/user-attachments/assets/23be8e60-a813-45a3-bbb0-21e72dd913a9" width="800"  alt="image-of-login-page" />

<ins>Here's what the Account Registration page looks like (with a link to the Login page as well)</ins>:
<img src="https://github.com/user-attachments/assets/002b43c5-b102-4058-b4d4-ea854b9a61f4" width="800" alt="image-of-register-page" />


### 7. Profile Page
After logging in, the user gets redirected to their account profile page. On the header menu, it should visible that the ***login icon*** button is now replaced with a ***profile icon*** to indicate that the user has been logged in. Also, the user can click on the Profile icon to show a small menu that shows the user's *username* as well as links to the Profile and Order History pages and even a Logout button. 

Regarding the Profile page itself (seen below), the user can edit their profile fields by clicking the **'edit'** button next to each field and then click the changs using the **Save All Changes** button. These profile field values can later be called to help *"auto-fill"* the checkout page. 
<img src="https://github.com/user-attachments/assets/d1ebd2b2-f600-4a70-982f-97a478933719" width="800" alt="image-of-profile-page" />

### 8. Checkout Page
After logging in and adding at least 1 item to cart Slider (see **#4. Cart Slider** section from earlier), the user can the click on the **Proceed to Checkout** button to redirect to the checkout page. The checkout page is a single page with 4 sections. Each of the sections are shown and explained below:

#### 8.1: Final Cart in Checkout
This is where the user sees the final cart at checkout checkout. Whilst users can't add new products at this point, they can drop products and adjust item quantity. However, if user drops all items, the **Pay** button at bottom of the checkout page is disabled since there's nothing to buy:
<img src="https://github.com/user-attachments/assets/5655de9a-eb52-453c-923c-d8adc29b90cb" width="800" alt="checkout-page-final-cart"/>

#### 8.2 Delivery Address Form in Checkout
This form is where users type in their order information including user identity and address data. Mentioned earlier, the same field data can also be found in the Profile page if the user has filled that out. User can either fill out the form data themselves **OR** click the **"Upload Existing Data from Profile"** button to upload existing Profile data to form for convenience. Also, if the user wants to save the form data to their **Profile page**, they can click the checkbox at bottom of this form to update their Profile with the filled-in form field data.   
<img src="https://github.com/user-attachments/assets/15425b68-0a1d-45dd-8d10-8c993ccb3c0c" width="800" alt="checkout-page-delivery-info-form" />

#### 8.3 Order Summary and Payment Method
The order summary section shows the total costs of the ongoing order. This includes the subTotal (total cost of products and quantity), shipping costs (defined by which U.S. state and territory is selected in Delivery address form), and a fixed sales tax rate of 8.0%. Finally, there's payment method form where user can type in credit card number and other related data for the ***Stripe*** payment processing. However, since no real money is processed—*since associated **Stripe** payment gateway account is in testing/development mode*—you can safely test the payment processing using ***Stripe's*** provided test card number at this link (https://docs.stripe.com/testing#cards): 
<img src="https://github.com/user-attachments/assets/9c298ac3-4916-4fb2-a07a-4fe01cb813c3" width="800" alt="checkout-page-order-summary-payment" />

### 9. Order Details Page
After clicking the **Pay** button in the bottom of the Checkout Page, *after filling out all Checkout Page's forms*, the user gets redirected to an Order Details Page listing all details for their latest order. For a nice touch, *after user completes their purchase*, "confetti" is poured from the top of the page to congratulate user for their purchase! Later on, the user can revisit the same Order's Details via Order History Page in the Profile icon's menu.  
<img src="https://github.com/user-attachments/assets/e3850420-4450-44f1-84fd-c44ad1c79ba5" width="800" alt="image-of-order-details-page" />

### 10. Order History Page
Finally, The last major page is the Order History Page where the user can browse the Order Details of all past and completed Orders. This page is accessed aftering logging in and clicking the "Orders" link in the small menu after clicking the Profile icon button in header menu. Features of this page include: *pagination buttons to browse order*, *up/down toggle arrows in table columns for row ordering*, and a *drop-down menu to show number of rows rendered per order 'page' in* **Your Order history** *container*.
<img src="https://github.com/user-attachments/assets/6085a316-6024-4f94-9c64-7063e42c7e58" width="800" alt="image-of-order-history-page" />

---

## IV. Limitations of App
<details>
  <summary><strong>App Limitations (Click to Expand):</strong></summary>
  <ul>
    <li>Due to using free hosting for the app on <strong><ins>Render.com</ins></strong> and the database on <strong><ins>Neon.com</ins></strong>, the app from the live demo link (https://store.livedemoapp.com/) might have slow performance. Initially, you might have to wait 15-20 seconds for a page to fully render. After page caching takes place, the app should run notable faster. <em>In the future</em>, I'll consider dedicated hosting options to speed up performance.</li>
    <li>On the order history page, I haven't added any type of order tracking for the orders. Due to this being a demo E-commerce store, there's no actual business infrastructure available to constantly keep track of orders; hence order tracking is irrelevant here.</li>
  </ul>
</details>

---

## V. Steps to use App locally

<details>
  <summary><strong>Steps to Setup App Locally (Click to Expand):</strong></summary>

<ol>
  <li><strong><ins>Ensure these pre-requisites are installed or setup first</ins>:</strong>
    <ul>
      <li><a href="https://nodejs.org/en">Node.js</a> (v20+ recommended)</li>
      <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
      <li><ins>Optional</ins>: Have an active GitHub account to fork code into a local repository.</li>
      <li><ins>Optional</ins>: Use a PostgreSQL GUI tool like <a href="https://github.com/Paxa/postbird">Postbird</a> or <a href="https://www.pgadmin.org/download/pgadmin-4-windows/">pgAdmin4</a>.</li>
      <li><ins>Optional</ins>: Use an IDE like <a href="https://code.visualstudio.com/">Visual Studio Code</a> (recommended).</li>
    </ul>
  </li>

  <li><strong><ins>Clone (or download) repository locally</ins>:</strong>
    <ul>
      <li><ins>Run the Git clone command</ins>:
        <pre><code>git clone https://github.com/SattyikKundu/Codecademy-Portfolio-Project-5.git</code></pre>
      </li>
      <li><ins>Change into the project folder</ins>:
        <pre>cd repository-folder-name</pre>
      </li>
    </ul>
  </li>

  <li><strong><ins>Setup PostgreSQL Database</ins>:</strong>
    <ul>
      <li>Import the <code>PERN-Ecommerce-app-database.sql</code> file from the project repository (see at top) and into PostgreSQL using <ins><a href="https://www.pgadmin.org/download/pgadmin-4-windows/">pgAdmin4</a></ins> or <ins><a href="https://github.com/Paxa/postbird">Postbird</a></ins>.</li>
      <li><ins>Or use the command line</ins>:
        <pre><code>psql -U your_username -d your_database -f path/to/PERN-Ecommerce-app-database.sql</code></pre>
      </li>
    </ul>
  </li>

  <li><strong><ins>Import packages using <code>npm</code> command</ins>:</strong>
    <ul>
      <li>Each folder (<code>/client</code> and <code>/server</code>) has its own <code>package.json</code>.</li>
      <li><ins>Install dependencies</ins>:
        <pre>cd client
npm install
cd server
npm install</pre>
      </li>
    </ul>
  </li>

  <li><strong><ins>Edit Environment Variable (.env) files</ins>:</strong>
    <ul>
      <li><ins>In both <code>/client</code> and <code>/server</code> folders</ins>:
        <ul>
          <li>Rename <code>.env.example</code> → <code>.env</code></li>
          <li>Edit values as instructed in the comments</li>
        </ul>
      </li>
      <li><ins>Ensure</ins>:
        <ul>
          <li>Correct <code>localhost</code> and port numbers are used so client and server communicate</li>
          <li>Google OAuth app is configured via <a href="https://console.cloud.google.com/">Google Console</a> for login</li>
          <li><code>vite.config.js</code> is updated (if needed)</li>
        </ul>
      </li>
    </ul>
  </li>

  <li><strong><ins>Run the app locally</ins>:</strong>
    <ul>
      <li>Open two terminals (or terminal tabs in VS Code) at the project's folder: <code>C:\...\...\...\project-folder-name></code></li>
      <li><ins>In terminal 1</ins>:
        <pre>cd client
npm start</pre>
      </li>
      <li><ins>In terminal 2</ins>:
        <pre>cd server
npm start</pre>
      </li>
      <li>The app should then open in your browser (usually at <code>http://localhost:5173</code>, but can vary).</li>
    </ul>
  </li>
</ol>

</details>

---

## VI. Features to be Added Later

<details>
  <summary><strong>Future Features/Updated List (Click to Expand): </strong></summary>
  <ul>
    <li>Due to slower app performance from using free cloud hosting on Render.com, a dedicated(paid) hosting will later be added for faster performance speed.</li>
    <li>Currently, the <strong>"Profile"</strong> and <strong>"Checkout"</strong> pages only accept U.S. addresses. This will later be expand so international addresses (outside the U.S.) can be processed.</li>
    <li>Together with updating the App to accept international addresses, the app will also later handle non-dollar currencies used in international deliveries (<ins>Example</ins>: <em>yen</em> for Japanese addresses).</li>
    <li>Besides the 15 products I currently have in my store's products display, I plan to slowly add more products over time. </li>
  </ul>
</details>

---

## VII. Image Attributions
Many images were obtained during the creation of this fake E-commerce store app. Also, *several* of these obtained images have been modified on Canva.com—*mostly to adjust images' contrast and brightness*—to better improve visuals on Final App. Click on below to toggle open/close image attribution links.

<details>
  <summary><strong>Image Attributions List (Click to Expand):</strong></summary>
  <ul>
    <li><strong><ins>App Background Image:</ins></strong> “Churaumi Aquarium, Okinawa” by yuka71 via Pixabay — 
      <a href="https://creativecommons.org/public-domain/cc0/">[CC0]</a>: 
      <a href="https://pixabay.com/photos/churaumi-aquarium-aquarium-okinawa-2407812/">Source</a>
    </li>
    <li><strong><ins>About Page Images:</ins></strong>
      <ul>
        <li>“Fish tank – At Exotic Life in Chatsworth” — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/deed.en">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/kkanouse/2950084525">Source</a>
        </li>
        <li>“Reef Tank at Monterey Bay Aquarium” — 
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/deed.en">[CC BY-NC-ND 2.0]</a>: 
          <a href="https://www.flickr.com/photos/calwhiz/2124674644">Source</a>
        </li>
      </ul>
    </li>
    <li><strong><ins>"Fishes" Product Card Images:</ins></strong>
      <ul>
        <li><strong>Bicolor Blenny</strong>: “Bicolor Blenny (Ecsenius bicolor)” by <em>christa.rohrbach</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/">[CC BY-NC-SA 2.0]</a>: 
          <a href="https://www.flickr.com/photos/megaptera/12179192543/">Source</a>
        </li>
        <li><strong>Carpenter Flasher Wrasse</strong>: “Flasher wrasse” by <em>PacificKlaus</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/pacificklaus/33717046103/">Source</a>
        </li>
        <li><strong>Diamond Watchman Goby</strong>: “Orange-dashed Goby - Valenciennea puella” by <em>François Libert</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/">[CC BY-NC-SA 2.0]</a>: 
          <a href="https://www.flickr.com/photos/zsispeo/50102999473/">Source</a>
        </li>
        <li><strong>Firefish Goby</strong>: “Fire dartfish (Nemateleotris magnifica)” by <em>krokodiver</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by/2.0/">[CC BY 2.0]</a>: 
          <a href="https://www.flickr.com/photos/krokodiver/43372442502/">Source</a>
        </li>
        <li><strong>Flame Angelfish</strong>: “Already Grilled” by <em>San Diego Shooter</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">[CC BY-NC-ND 2.0]</a>: 
          <a href="https://www.flickr.com/photos/nathaninsandiego/4108718790/">Source</a>
        </li>
      </ul>
    </li>
    <li><strong><ins>"Invertebrates" Product Card Images:</ins></strong>
      <ul>
        <li><strong>Emerald Crab</strong>: “roatan 23 PB120106a Emerald or Green Cli” by <em>Pauline Walsh Jacobson</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/coralreefdreams/53382502643/">Source</a>
        </li>
        <li><strong>Scarlet Hermit Crab</strong>: “DSCN7340_16zu9” by <em>Andreas März</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by/2.0">[CC BY 2.0]</a>: 
          <a href="https://www.flickr.com/photos/andreas63/4460902720/">Source</a>
        </li>
        <li><strong>Electric Blue Hermit Crab</strong>: “Calcinus elegans 01” by <em>Fafner</em> via Wikimedia Commons — 
          <a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">[CC BY-SA 3.0]</a>: 
          <a href="https://commons.wikimedia.org/wiki/File:Calcinus_elegans_01.jpg">Source</a>
        </li>
        <li><strong>Halloween Hermit Crab</strong>: “Ciliopagurus strigatus” by <em>jeanmarie.gradot</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/129108168@N08/51710781630">Source</a>
        </li>
        <li><strong>Skunk Cleaner Shrimp</strong>: “清潔蝦” by <em>powapo</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">[CC BY-NC-ND 2.0]</a>: 
          <a href="https://www.flickr.com/photos/116039404@N04/16567238516/">Source</a>
        </li>
      </ul>
    </li>
    <li><strong><ins>"Corals & Anemones" Product Card Images:</ins></strong>
      <ul>
        <li><strong>Green Star Polyps</strong>: “Green Star Polyps” by <em>JustinBurger</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">[CC BY-NC-ND 2.0]</a>: 
          <a href="https://www.flickr.com/photos/justinburger/2680107601/">Source</a>
        </li>
        <li><strong>Pulsing Xenia</strong>: “Sick Xenia?” by <em>edanley</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by/2.0/">[CC BY 2.0]</a>: 
          <a href="https://www.flickr.com/photos/edanley/4933017600/">Source</a>
        </li>
        <li><strong>Toadstool Leather</strong>: “toadstool leather” by <em>bdeseattle</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/bdeseattle/136709129/">Source</a>
        </li>
        <li><strong>Kenya Tree Coral</strong>: “Kenya Tree coral” by <em>Brian Daniel Eisenberg</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc/2.0/">[CC BY-NC 2.0]</a>: 
          <a href="https://www.flickr.com/photos/pplpwrd/782403645/">Source</a>
        </li>
        <li><strong>Branching Hammerhead Coral</strong>: “Hammer coral (Euphyllia paraancora)” by <em>Adam Balzer</em> via Flickr — 
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">[CC BY-NC-ND 2.0]</a>: 
          <a href="https://www.flickr.com/photos/99579779@N05/25821914928/">Source</a>
        </li>
      </ul>
    </li>
    <li><strong><ins>Checkout Page Background Pattern:</ins></strong> "Water drops background" created and modified in Canva via Pro (paid) account. </li>
  </ul>
</details>
