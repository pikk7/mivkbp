const functions = require("firebase-functions");
var express = require("express");
var cors = require("cors");
var app = express();
const {
  getAllUsers,
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/user");
const {
  getAllEvents,
  postOneEvent,
  getEvent,
  deleteEvent,
  leaveEvent,
  applyEvent,
  commentOnEvent,
} = require("./handlers/event");
const db = require("./utils/admin");
const { firebaseAuth } = require("./utils/middlewares");

app.use(cors());

app.get("/events", getAllEvents);
app.post("/event", firebaseAuth, postOneEvent);
app.get("/event/:eventId", getEvent);
app.delete("/event/:eventId", firebaseAuth, deleteEvent);
app.get("/event/:eventId/leave", firebaseAuth, leaveEvent);

app.get("/event/:eventId/apply", firebaseAuth, applyEvent);
app.post("/event/:eventId/comment", firebaseAuth, commentOnEvent);

//users routes
app.get("/users", getAllUsers);
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", firebaseAuth, uploadImage);
app.post("/user", firebaseAuth, addUserDetails);
app.get("/user", firebaseAuth, getAuthenticatedUser);
app.get("/user/:username", getUserDetails);
app.post("/notifications", firebaseAuth, markNotificationsRead);

exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("applies/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/events/${snapshot.data().eventId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "like",
            read: false,
            eventId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("europe-west3")
  .firestore.document("applies/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((e) => {
        console.error(e);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west3")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/events/${snapshot.data().eventId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            eventId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    // console.log(change.before.data());
    // console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image change");
      const batch = db.batch();
      return db
        .collection("events")
        .where("username", "==", change.before.data().username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const event = db.doc(`/events/${doc.id}`);
            batch.update(event, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onEventDelete = functions
  .region("europe-west3")
  .firestore.document("/events/{eventId}")
  .onDelete((snapshot, context) => {
    const eventId = context.params.eventId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("eventId", "==", eventId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("eventId", "==", eventId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("eventId", "==", eventId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });

// /**
//  * HTTP function that supports CORS requests.
//  *
//  * @param {Object} req Cloud Function request context.
//  * @param {Object} res Cloud Function response context.
//  */
// exports.corsEnabledFunction = (req, res) => {
//   // Set CORS headers for preflight requests
//   // Allows GETs from any origin with the Content-Type header
//   // and caches preflight response for 3600s

//   res.set("Access-Control-Allow-Origin", "*");

//   if (req.method === "OPTIONS") {
//     // Send response to OPTIONS requests
//     res.set("Access-Control-Allow-Methods", "GET");
//     res.set("Access-Control-Allow-Headers", "Content-Type");
//     res.set("Access-Control-Max-Age", "3600");
//     res.status(204).send("");
//   } else {
//     res.send("Hello World!");
//   }
// };

exports.api = functions.region("europe-west3").https.onRequest(app);
