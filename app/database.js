import React from 'react';
import ReactDOM from 'react-dom';

// Modify with your startup's name!
var startupName = "MorningStar";

// Put your mock objects here, as in Workshop 4
var initialData = {
  "users": {
      "1": {
        "_id": 1,
        "fullName": "Tim",
        "exchangeLists": [1],
        "wantLists": [2],
        "feed":1
      },
      "2": {
        "_id": 2,
        "fullName": "Kai",
        "exchangeLists": [],
        "wantLists": [],
        "feed":2
      },
      "3": {
        "_id": 3,
        "fullName": "Leo",
        "exchangeLists": [],
        "wantLists": [],
        "feed":3
      },
      //this is you
      "4": {
        "_id": 4,
        "fullName": "Carter",
        // ID of your books.
        "exchangeLists": [2],
        "wantList": [1],
        "feed":4
      }
    },
    //books
    "booksItems": {
      "1": {
        "_id":1,
        "owner_id":2,
        "contents":{
          "bookname":"Introduction-to-algorithms",
          "author":"Tomas",
          "edition": "3rd",
          "isbn_10": "0262033844",
          "isbn_13": "9780262033848",
          "postDate": "1453668480000",
          "Publisher": "The MIT Press",
          "publish_date": "July 31, 2009",
          "page": "1312",
          "list_price": "$66.32",
          "condition": "Great",
          "description": "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and c.",
          "location": "Amherst, MA"
        },
        "comments": [
            {
                // The author of the comment.
                "author": 1,
                // The contents of the comment.
                "contents": "I love this book!",
                // The date the comment was posted.
                // 01/24/16 22:00 EST
                "postDate": 1453690800000
              }

                  ]
      },
      "2": {
        "_id":2,
        "owner_id":3,
        "contents":{
          "bookname":"Artificial Intelligence A Modern Approach",
          "author":"Peter",
          "edition": "3rd",
          "isbn_10": "0262099822",
          "isbn_13": "9780261234567",
          "postDate": 1453668480000,
          "Publisher": "The MASS Press",
          "publish_date": "July 31, 1004",
          "page": "999",
          "list_price": "$80.32",
          "condition": "Great",
          "description": "This book is used for learning some knowledges about AI for the college students.",
          "location": "Amherst, MA"
        },
        "comments": [
            {
                // The author of the comment.
                "author": 2,
                // The contents of the comment.
                "contents": "book is good!",
                // The date the comment was posted.
                // 01/24/16 22:00 EST
                "postDate": 1453690800000
              }

            ]
          }
    },
    "feeds": {
      "4": {
        "_id": 4,
        // Listing of FeedItems in the feed.
        "contents": [1,2]
      },
      "3": {
        "_id": 3,
        "contents": []
      },
      "2": {
        "_id": 2,
        "contents": []
      },
      "1": {
        "_id": 1,
        "contents": []
      }
    }
};

var data = JSON.parse(localStorage.getItem(startupName));
if (data === null) {
  data = JSONClone(initialData);
}

/**
 * A dumb cloning routing. Serializes a JSON object as a string, then
 * deserializes it.
 */
function JSONClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Emulates reading a "document" from a NoSQL database.
 * Doesn't do any tricky document joins, as we will cover that in the latter
 * half of the course. :)
 */
export function readDocument(collection, id) {
  // Clone the data. We do this to model a database, where you receive a
  // *copy* of an object and not the object itself.
  return JSONClone(data[collection][id]);
}

/**
 * Emulates writing a "document" to a NoSQL database.
 */
export function writeDocument(collection, changedDocument) {
  var id = changedDocument._id;
  // Store a copy of the object into the database. Models a database's behavior.
  data[collection][id] = JSONClone(changedDocument);
  // Update our 'database'.
  localStorage.setItem(startupName, JSON.stringify(data));
}

/**
 * Adds a new document to the NoSQL database.
 */
export function addDocument(collectionName, newDoc) {
  var collection = data[collectionName];
  var nextId = Object.keys(collection).length;
  while (collection[nextId]) {
    nextId++;
  }
  newDoc._id = nextId;
  writeDocument(collectionName, newDoc);
  return newDoc;
}

/**
 * Reset our browser-local database.
 */
export function resetDatabase() {
  localStorage.setItem(startupName, JSON.stringify(initialData));
  data = JSONClone(initialData);
}

/**
 * Reset database button.
 */
class ResetDatabase extends React.Component {
  render() {
    return (
      <button className="btn btn-default" type="button" onClick={() => {
        resetDatabase();
        window.alert("Database reset! Refreshing the page now...");
        document.location.reload(false);
      }}>Reset Mock DB</button>
    );
  }
}

ReactDOM.render(
  <ResetDatabase />,
  document.getElementById('db-reset')
);
