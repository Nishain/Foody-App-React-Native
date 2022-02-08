<img src="components\assets\food.png" alt="drawing" style="width:100px;"/>

# Foody Bill App
This is an react Native project built Android and IOS for enabling merchant to generate bills after seleting food items from order line. the Project uses FireBase SDK (realtime database).
Application uses minimum amount UI libraries and sustained good UI without any material libriaries.

The project was in built up using react Native CLI. All components are built with functional components
## RoadMap

- Authentication using Firebase Authentication along with Forget password (send password request link to email inbox)
- During registration user can define themselves if they are admin **(for now)**
- Create new food items and food category **(admin route)**
- Browse Food items and add them to cart
- Generate a bill PDF format and submit bill information to Firebase.After pdf is generated a FileViewer will prompt  the pdf to user and print or share from that intent.
- User can change quantities in cart screen or even can remove them, user can also add discounts to each individual item **but cannot exceed discount limit**  
``
 Note this validation happen on input on  lost focus not onTextChange
 ``
- In order to generate bill the cart should not be empty, user should previously provided all company details *(name,contact details .etc)* user can also edit them anytime and there should be no conflict in the cart - *`No item with greater discount than discount limit for particular item`*
- Can View history of bills of past purhcase orders.User can filter the history by date
- Company details are stored in local storage and automatically included if provided in bill recipt the company logo is stored in base64 format
- For performance improvement cache rendering is used by using ``useMemo()`` hook

## Admin privileges

- create Product
- create category
- edit product

A helper label is shown in home screen to indicate if the user is admin or not

## Installation and running

```bash
npm install
npm start
````
For more setup guidlines check [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

to run on android platform run
```bash
npm run android
```
or 
```bash
npm run ios
```
to run IOS platform.
You may also need to execute Pod install to pod packages for IOS.

You may also need to use 
```bash
npm link
```
or
```bash
npx link
```

`this may be needed step for packages like ` **react-native-html-to-pdf**

to copy relavant assets to platform project folders.If you are using the package ``react-native-vector-icons`` please follow the instructions given in https://github.com/oblador/react-native-vector-icons if need to manually add the icons to Android and IOS project.

## Database Structure

the data structure followed on Realtime Firebase database
```json
{
  "category" : {
    "-MuoTy6yuKGUVcmacEsC" : "new cat",
    "-MvJmXkKIaTDwIDfIlD7" : "Rabutan",
    "-MvJm_a6JxLzUPio3sQ-" : "Rabutan2"
  },
  "food" : {
    "-Mupit081zDvOkNqAJ-M" : {
      "categories" : [ "new cat" ],
      "description" : "very tasty drink",
      "discount limit" : 20,
      "name" : "Orange Juice",
      "price" : 200
    },
    "-MupjCxUwsTSTGL-oENV" : {
      "categories" : [ "new cat" ],
      "description" : "very tasty drink",
      "discount limit" : 20,
      "name" : "Pineapple",
      "price" : 230
    }
  },
  "history" : {
    "-MvHNj85dOxKhyRIdvHj" : {
      "billCode" : "259xuma0v6",
      "cart" : [ {
        "discount" : 20,
        "name" : "Pineapple",
        "price" : 230,
        "quantity" : 2
      }, {
        "discount" : 0,
        "name" : "Orange Juice",
        "price" : 200,
        "quantity" : 1
      } ],
      "customerName" : "Nishain",
      "orderDate" : "2022-02-07",
      "totalPrice" : 1289
    }
  },
  "user" : {
    "kbaPnf9e96exkbZTl3D5rfMLOhd2" : {
      "isAdmin" : true
    }
  }
}

```
The key used in ``user`` collection is the **UID** stored in FireBase Authentication


# Author

 - [@Nishain De Silva](https://github.com/Nishain/)