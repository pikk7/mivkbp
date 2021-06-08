const { db } = require("../utils/admin");
const functions = require("firebase-functions");
// const { isEmpty } = require("../utils/validators");

exports.getAllEvents = (req, res) => {
  functions.logger.info("get events", { structuredData: true });

  db.collection("events")
    //.orderBy("start", "desc")
    .get()
    .then((data) => {
      let events = [];
      data.forEach((doc) => {
        events.push({
          eventId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(events);
    })
    .catch((e) => console.log(e));
};

exports.postOneEvent = (req, res) => {
  console.log(req.body);
  if (req.body.description.trim() === "") {
    return res.status(400).json({ error: "Must not be empty" });
  }

  let errors = {};
  const newEvent = {
    ...req.body,
    username: req.user.username,
    // userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    volunteerCount: 0,
    commentCount: 0,
  };

  if (Object.keys(errors) > 0) {
    return res.status(400).json({ errors });
  }
  functions.logger.info("new event", { structuredData: true });

  db.collection("events")
    .add(newEvent)
    .then((doc) => {
      const resEvent = newEvent;
      resEvent.eventId = doc.id;
      return res.json(resEvent);
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({ error: err.code });
    });
};

exports.getEvent = (req, res) => {
  let eventData = {};
  functions.logger.info("get event", { structuredData: true });

  db.doc(`/events/${req.params.eventId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Event is not found" });
      }
      eventData = doc.data();
      eventData.eventId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("eventId", "==", req.params.eventId)
        .get();
    })
    .then((data) => {
      eventData.comments = [];
      data.forEach((doc) => {
        eventData.comments.push(doc.data());
      });
      return res.json(eventData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

//Comment on an event
exports.commentOnEvent = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }
  functions.logger.info("comment event", { structuredData: true });

  const newComment = {
    ...req.body,
    createdAt: new Date().toISOString(),
    eventId: req.params.eventId,
    username: req.user.username,
    userImage: req.user.imageUrl,
  };

  db.doc(`/events/${req.params.eventId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Event not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.applyEvent = (req, res) => {
  const applyDocument = db
    .collection("applies")
    .where("username", "==", req.user.username)
    .where("eventId", "==", req.params.eventId)
    .limit(1);

  const eventDocument = db.doc(`/events/${req.params.eventId}`);

  let eventData;

  eventDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        eventData = doc.data();
        eventData.eventId = doc.id;
        return applyDocument.get();
      } else {
        return res.status(404).json({ error: "Event not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("applies")
          .add({
            eventId: req.params.eventId,
            username: req.user.username,
          })
          .then(() => {
            ++eventData.volunteerCount;
            return eventDocument
              .update({ volunteerCount: eventData.volunteerCount })
              .then(() => {
                return res.json(eventData);
              });
          });
      } else {
        return res.status(400).json({ error: "Event already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  functions.logger.info("apply event", { structuredData: true });
};

exports.leaveEvent = (req, res) => {
  const applyDocument = db
    .collection("applies")
    .where("username", "==", req.user.username)
    .where("eventId", "==", req.params.eventId)
    .limit(1);

  const eventDocument = db.doc(`/events/${req.params.eventId}`);

  let eventData;

  eventDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        eventData = doc.data();
        eventData.eventId = doc.id;
        return applyDocument.get();
      } else {
        return res.status(404).json({ error: "Event not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Event not liked" });
      } else {
        return db
          .doc(`/applies/${data.docs[0].id}`)
          .delete()
          .then(() => {
            eventData.volunteerCount--;
            return eventDocument.update({
              volunteerCount: eventData.volunteerCount,
            });
          })
          .then(() => {
            res.json(eventData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  functions.logger.info("leave event", { structuredData: true });
};

//delete event
exports.deleteEvent = (req, res) => {
  const document = db.doc(`/events/${req.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Event not found" });
      }

      //sajat eventjet torli, ezeket majd ugyis at kell formaznom
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unathorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Event deleted succesfully" });
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: e.code });
    });
  functions.logger.info("delete event", { structuredData: true });
};
