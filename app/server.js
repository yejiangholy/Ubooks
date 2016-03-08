import {readDocument,writeDocument,addDocument} from './database.js';




/**
 * Emulates how a REST call is *asynchronous* -- it calls your function back
 * some time in the future with data.
 */
function emulateServerReturn(data, cb) {
  setTimeout(() => {
    cb(data);
  }, 4);
}

function getFeedItemSync(feedItemId) {
  var feedItem = readDocument('booksItems', feedItemId);
  feedItem.owner_id = readDocument('users',feedItem.owner_id);
  feedItem.comments.forEach((comment) => {
    comment.author = readDocument('users', comment.author);
  });
  return feedItem;
}

export function getFeedData(user, cb) {
  var userData = readDocument('users', user);
  var feedData = readDocument('feeds', userData.feed);
  feedData.contents = feedData.contents.map(getFeedItemSync);
  emulateServerReturn(feedData, cb);
}

function getMailItemSync(mail) {
  var mailItem = readDocument('mailbox', mail);
  mailItem.participants = mailItem.participants.map((participant) => readDocument('users', participant));
  return mailItem;
}

export function getMailboxData(user, cb) {
  var userData = readDocument('users', user);
  userData.mailbox = userData.mailbox.map(getMailItemSync);
  emulateServerReturn(userData, cb);
}

export function getMailData(id, cb) {
  var mailData = readDocument('mailbox', id);
  mailData.Messages.forEach((msg) => {
    msg.From = readDocument('users', msg.From);
  });
  emulateServerReturn(mailData, cb);
}

export function getUserData(user, cb){
  var userData = readDocument('users', user);
  emulateServerReturn(userData, cb);
}

export function postComment(bookitemId, author, contents, cb) {
  // Since a CommentThread is embedded in a FeedItem object,
  // we don't have to resolve it. Read the document,
  // update the embedded object, and then update the
  // document in the database.
  var feedItem = readDocument('booksItems', bookitemId);
  feedItem.comments.push({
    "author": author,
    "contents": contents,
    "postDate": new Date().getTime()
  });
  writeDocument('booksItems', feedItem);
  // Return a resolved version of the feed item so React can
  // render it.
  emulateServerReturn(getFeedItemSync(bookitemId), cb);
}

export function replyMail(mailId, user, content, cb) {
  var mailItem = readDocument('mailbox', mailId);
  mailItem.Messages.push({
    "From": user,
    "sendDate": new Date().getTime(),
    "contents": content
  });
  writeDocument('mailbox', mailItem);
  emulateServerReturn(getMailItemSync(mailId), cb);
}


export function postBook(owner_id,pic,bookname,author,edition,isbn_10,isbn_13,publisher,publish_date,list_price,condition,highlight,notes,description,location){
  var time = new Date().getTime();
  var newBookItem={
    "owner_id":owner_id,
    "pic":pic,
    "contents":{
      "bookname":bookname,
      "author":author,
      "edition": edition,
      "isbn_10": isbn_10,
      "isbn_13": isbn_13,
      "postDate": time,
      "Publisher": publisher,
      "publish_date": publish_date,
      "list_price": list_price,
      "condition": condition,
      "highlight": highlight,
      "notes": notes,
      "description": description,
      "location": location
    },
    "comments": []
  };
  newBookItem = addDocument('booksItems',newBookItem);
  var userData = readDocument('users', owner_id);
  var feedData = readDocument('feeds', userData.feed);
  feedData.contents.push(newBookItem._id);
  writeDocument('feeds',feedData);
}

export function getExchangebook(user, cb) {
  var userData = readDocument('users', user);
  emulateServerReturn(userData.exchangeLists.map((bookid) => readDocument('booksItems', bookid)), cb);
}

export function getNeedbook(user, cb) {
  var userData = readDocument('users', user);
  emulateServerReturn(userData.wantLists.map((bookid) => readDocument('booksItems', bookid)), cb);
}

export function getMail(user, cb) {
  var userData = readDocument('users', user);
  var mailData = readDocument('mailbox', userData.mailbox);
  emulateServerReturn(mailData.Messages, cb);
}

export function getUserdata(user,cb)
{
  var userData = readDocument('users',user);
  emulateServerReturn(userData,cb);
}

export function getUserbook(bookitem,cb)
{
  var bookData = readDocument('booksItems',bookitem);
  emulateServerReturn(bookData,cb);

}
