# **NC News Backend**

NC News is a RESTful API that powers a news site for articles, topics, comments, and users, built with **Node.js**, **Express**, and **PostgreSQL**. For the connected frontend, visit this repository: [XQ News Frontend](https://github.com/XiaoQuark/nc-news-frontend).

## **Hosted Version**

The hosted version of the API can be found [here](https://xqnews.onrender.com/api).

## **Getting Started**

To set up this project locally, follow these steps:

### **Install Dependencies**

Run the following command to install dependencies:

```
npm install
```

### **Environment Setup**

Create two files, `**.env.development**` and `**.env.test**`, in the root directory:

-   **.env.development**:

    ```
    PGDATABASE=nc_news
    ```

-   **.env.test**:

    ```
    PGDATABASE=nc_news_test
    ```

These files are required to configure the database connections.

### **Set Up and Seed Database**

To create and seed the local database, run:

```
npm run setup-dbs && npm run seed
```

### **Running Tests**

To run the tests, use:

```
npm test
```

You can also run specific tests:

-   **API Tests**: `npm test app`

-   **Utility Tests**: `npm test utils`

## **Requirements**

-   **Node.js**: v21.6.2 or higher

-   **PostgreSQL**: v14.11 or higher

## **Notes**

This API was built as part of a software engineering bootcamp with Northcoders.
