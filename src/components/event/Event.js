import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { useSelector } from "react-redux";
import MyButton from "../../util/MyButton";
import ChatIcon from "@material-ui/icons/Chat";

import DeleteScream from "./DeleteScream";
import ScreamDialog from "./EventDialog";
import LikeButton from "./ApplyButton";
const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: { padding: 25, objectFit: "cover" },
};

function Event(props) {
  /*
  const eventId = props.eventId;
  const dispatch = useDispatch();
  useEffect(() => {
    //effect
    dispatch(getScream(eventId));
  }, [dispatch]);
*/
  const {
    classes,
    openDialog,
    event: {
      description,
      createdAt,
      location,
      username,
      eventId,
      likeCount,
      commentCount,
    },
  } = props;
  const { authenticated } = useSelector((state) => state.user);
  const { credentials } = useSelector((state) => state.user);

  const handle = credentials.username;

  dayjs.extend(relativeTime);

  const deleteButton =
    authenticated && username === handle ? (
      <DeleteScream eventId={eventId} />
    ) : null;

  //console.log(props);
  return (
    <Card className={classes.card}>
      {/* <CardMedia
        image={userImage}
        title="Profile image"
        className={classes.image}
      /> */}
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          // to={`/users/${username}`}
          color="primary"
        >
          {eventId}
          {/* {username} */}
        </Typography>
        {deleteButton}
        <Typography component={"div"} variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
          {/* <p>{eventId}</p> */}
        </Typography>
        <Typography variant="body1">{description}</Typography>
        <Typography variant="body2">{location}</Typography>
        <LikeButton eventId={eventId} />
        <span>{likeCount} Likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary"></ChatIcon>
        </MyButton>
        <span>{commentCount} comments</span>
        <ScreamDialog
          eventId={eventId}
          username={username}
          openDialog={openDialog}
        ></ScreamDialog>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(Event);
