import { Grid, withStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StaticProfile from "../profile/StaticProfile";
import Event from "../event/Event";
import ProfileSkeleton from "../../util/ProfileSkeleton";
import EventSkeleton from "../../util/EventSkeleton";
import { getUserData } from "../../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

function User(props) {
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  // eslint-disable-next-line no-unused-vars
  const [eventIdParam, setEventIdParam] = useState(props.match.params.eventId);

  const { events, loading } = data;
  const username = props.match.params.username;
  //setEventIdParam(props.match.params.eventId);
  useEffect(() => {
    // if (props.match.params.scremId) {
    //   setEventIdParam(props.match.params.eventId);
    // }
    dispatch(getUserData(username));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    axios
      .get(`/user/${username}`)
      .then((res) => {
        setProfile(res.data.user);
      })
      .catch((err) => console.log(err));
  }, [dispatch, username]);
  const eventsMarkup = loading ? (
    <EventSkeleton />
  ) : events === null ? (
    <p>No events from this user</p>
  ) : !eventIdParam ? (
    events.map((event) => <Event key={event.eventId} event={event} />)
  ) : (
    events.map((event) => {
      if (event.eventId !== eventIdParam) {
        return <Event key={event.eventId} event={event} />;
      } else {
        return <Event key={event.eventId} event={event} openDialog={true} />;
      }
    })
  );
  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {eventsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={profile} />
        )}
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(User);
