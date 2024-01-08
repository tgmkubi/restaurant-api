![Logo](https://images.pexels.com/photos/2961968/pexels-photo-2961968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

# Restaurant Rest API

In this Node.js and Express-based Restaurant API project provides a comprehensive solution for managing restaurant information and interactions. Users can access a list of restaurants with detailed information, log in to the system, place orders, leave comments, and rate their dining experiences. The system requires users to authenticate with a username and password and allows them to define additional details such as email address, age, gender, and profile picture. Users can input multiple delivery addresses, place food orders, leave a single comment per order, and assign a rating. Date and time information is stored for each order. Restaurants are defined by name, description, logo, and address details, including city, district, and street address with location coordinates. Restaurants may have multiple branches, and a menu can be associated with each restaurant, containing price, content, and cover image information. Additionally, various restaurant types, such as Turkish cuisine or fast food, can be categorized. The project addresses database design challenges in MongoDB based on the specified information, provides a solution for finding the nearest restaurants to a given set of coordinates, and handles transactional updates for a restaurant's menu. The system also supports querying and sorting users based on their comments and ratings, as well as filtering and presenting restaurant information based on specific criteria. The API integrates with Mongoose in Node.js to establish a connection with the MongoDB database, and it offers an endpoint for paginated retrieval of restaurants sorted by the average rating in descending order.

# Getting started

Make sure you've installed **[Node.js](https://nodejs.org/en)**

To get the Node server running locally:

- Clone this repo
- Install all required dependencies(Optional: check 'devDependencies' inside package.json)
```bash
  npm install
```
- Create [MongoDb Cluster](https://www.mongodb.com/) and Get Connection MongoDb URI
- Set environment variables in config.env under ./config/env
    * Set `MONGO_URI=<YOUR_MONGO_URI>`
    * [Gmail SMTP Settings: Easy Step-by-Step Setup Guide (with Screenshots)](https://www.gmass.co/blog/gmail-smtp/). Then:
    * Set `SMTP_USER=<YOUR_GMAIL_EMAIL>`
    * Set `SMTP_PASS=<YOUR_GMAIL_PASSWORD>`

- To start the local server
```bash
  npm run dev
``` 
# Overview

### Dependencies

- [bcryptjs](https://www.npmjs.com/package/slugify) - Hashing Password
- [dotenv](https://www.npmjs.com/package/dotenv) - Zero-Dependency module that loads environment variables
- [express](https://www.npmjs.com/package/express) - The server for handling and routing HTTP requests
- [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Handling exceptions inside of async express routes and passing them into custom express error handlers.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://www.npmjs.com/package/mongoose) - For modeling and mapping MongoDB data to JavaScript
- [multer](https://www.npmjs.com/package/multer) - Node.js middleware for uploading files
- [nodemailer](https://www.npmjs.com/package/nodemailer) - Send e-mails from Node.js

### devDependencies

- [nodemon](https://www.npmjs.com/package/nodemon) - helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

### Application Structure

- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also inncludes the routes we'll be using in the application.
- `config/` - This folder contains configuration for central location environment variables and other configurations.
- `routes/` - This folder contains the route definitions (answer, question etc. ) for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models (User, Question).
- `controllers/` - This folder contains controllers for our API.
- `public/` - This folder contains static files for our API.
- `middlewares/` - This folder contains middlewares for our API.
- `helpers/` - This folder contains helper functions for adapting 3rd party libraries for our API.

### Error Handling

In `middlewares/errors/customErrorHandler.js`, we define a error-handling middleware for handling Mongoose's errors and our own errors.

### Authentication

Requests are authenticated using the `Authorization` header and value `Bearer {{token}}`. with a valid JWT. 

We define express middlewares in `middlewares/authorization/auth.js` that can be used to authenticate requests. The `required` middlewares returns `401` or `403`.

# API USAGE

## AUTH

| METHOD | ROUTE     | FUNCTIONALITY                | POST BODY | ACCESS |
| :-------- | :------- | :------------------------- | :--------------------| :--------|
| `POST` | `/api/auth/register` | *Register New User* | {"name": "Test User","email": "foo@mail.com","password": "123456"} | Public |
| `POST` | `/api/auth/login` | *Login User* | {"email": "foo@mail.com","password": "123456"} | Public |
| `GET` | `/api/auth/profile` | *Get logged in User* | Empty | All users |
| `GET` | `/api/auth/logout` | *Logout User* | Empty | All Users |
| `POST` | `/api/auth/forgotpassword` | *Forget Password Token* | {"email": "foo@mail.com"} | All Users |
| `PUT` | `/api/auth/resetpassword?resetPasswordToken=<resetPasswordToken>` | *Reset Password* | {"password": "12345678"} | All Users |
| `POST` | `/api/auth/upload` | *Upload Image* | Headers Key: 'profile_image' Value: image file | All Users |
| `PUT` | `/api/auth/edit` | *Edit User Details* | {"place": "İzmir"} | All Users |

## ADMIN

| METHOD | ROUTE     | FUNCTIONALITY                | POST BODY | ACCESS |
| :-------- | :------- | :------------------------- | :--------------------| :--------|
| `DEL` | `/api/admin/deleteuser/<userId>` | *Delete user* | Empty | Admin Users |
| `GET` | `api/admin/blockuser/<userId>` | *Block/Unblock user* | Empty | Admin Users |

## USERS

| METHOD | ROUTE     | FUNCTIONALITY                | POST BODY | ACCESS |
| :-------- | :------- | :------------------------- | :--------------------| :--------|
| `GET` | `/api/users` | *Get All Users* | Empty | Public|
| `GET` | `/api/users/<userId>` | *Get Single User Details with id* | Empty | Public|

## RESTAURANTS

 METHOD | ROUTE     | FUNCTIONALITY                | POST BODY | ACCESS |
| :-------- | :------- | :------------------------- | :--------------------| :--------|
| `POST` | `/api/restaurants/createrestaurant` | *Create Restaurant* | {"name": "Restaurant Test","description": "This is a test restaurant description.", "logo": "test_logo.jpg", "address": {"city": "Ankara", "district": "Çankaya", "street": "Cumhuriyet", "location": {"type": "Point", "coordinates": [35.00, 35.00]}}, "type": ["Fast Food", "Ev Yemekleri"]} | Admin Users|
| `POST` | `/api/restaurants/createbranche` | *Create Branche* | {"name": "Branche 1", "address": {"city": "Ankara", "district": "Test District", "street": "Test Street", "location": {"type": "Point", "coordinates": [35.10, 35.10]}}} | Admin Users|
| `DELETE` | `/api/restaurants/<brancheId>/deletebranche` | *Delete Branche* | Empty | Admin Users|
| `PUT` | `/api/restaurants/<restaurantId>/addbranchetorestaurant/<brancheId>` | *Add Branche To Restaurant* | Empty | Admin Users|
| `GET` | `/api/restaurants/<restaurantId>` | *Get Single Restaurant Details* | Empty | Public|
| `GET` | `/api/restaurants/` | *Get All Restaurants Details* | Empty | Public|
| `GET` | `/api/restaurants/<restaurantId>/branches` | *Get All Branches of The Restaurant* | Empty | Public|
| `GET` | `/api/restaurants/nearby?limit=2&filter=lahmacun` | *Get Nearby Restaurant Detail with filter* | Empty | All Users|
| `GET` | `/api/restaurants/<restaurantId>/branches/<brancheId>/` | *Get Single Branche Details of The Restaurant* | Empty | All Users|
| `PUT` | `/api/restaurants/<restaurantId>/deletebranchefromrestaurant/<brancheId>/` | *Delete Branche From Restaurant* | Empty | Admin Users|
| `PUT` | `/api/restaurants/<restaurantId>/addmenustorestaurant/` | *Add Menu(s) to Restaurant* | {"menuIds": ["6594256494fb69770f94185b", "6595296f3d934094f8a84179"]} | Admin Users|
| `POST` | `/api/restaurants/<restaurantId>/orders/createorder` | *Create Order in the Restaurant* | {"menus": ["6595296f3d934094f8a84179", "6594256494fb69770f94185b"]} | All Users|
| `DELETE` | `/api/restaurants/<restaurantId>/orders/deleteorder/<orderId>` | *Delete Order in the Restaurant* | Empty | Admin Users & Order Owner|
| `GET` | `/api/restaurants/find-recommended-restaurants` | *Find Recommended Restaurants* | Empty | All Users|
| `POST` | `/api/order-review/<orderId>/createreview` | *Add Review (comment - rating) to Order* | {"comment": "This is comment for order", "rating": 9} | Order Owner|
| `GET` | `/api/order-review?page=2` | *Get Latest 20 Reviews\ sorted by user age* | Empty | All Users|


## MENU

 METHOD | ROUTE     | FUNCTIONALITY                | POST BODY | ACCESS |
| :-------- | :------- | :------------------------- | :--------------------| :--------|
| `POST` | `/api/menu` | *Create Menu* | {"name": "Lahmacun Ayran Menü", "description": "Lahmacun ve Eker Ayran ile leziz bir menü"} | Admin Users|
| `POST` | `/api/menu/createmenuitem` | *Create Menu Item* | {"name": "Lahmacun", "description": "Adana usulü lahmacun.", "category": "meal", "size": "large", "price": 80} | Admin Users|
| `PUT` | `/api/menu/<menuId>/addmenuitemtomenu/<menuItemId>` | *Add Menu Item to Menu* | Empty | Admin Users|
| `PUT` | `/api/menu/<menuId>/addmenuitemstomenu/` | *Add Menu Items to Menu* | {"menuItemIds": ["659529d43d934094f8a8417d", "659529e83d934094f8a84181"]} | Admin Users|
| `PUT` | `/api/menu/<menuId>/deletemenuitemfrommenu/<menuItemId>` | *Delete Menu Item from Menu* | Empty | Admin Users|



[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
