import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Event from "../event/Event";
import Profile from "../profile/Profile";
import { getEvents } from "../../redux/actions/dataActions";
import { useSelector, useDispatch } from "react-redux";
import EventSkeleton from "../../util/EventSkeleton";
import { Typography } from "@material-ui/core";
const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    //effect
    dispatch(getEvents());
  }, [dispatch]);
  const { events, loading } = useSelector((state) => state.data);
  let recentEventssMarkup = !loading ? (
    events.map((event) => {
      return <Event event={event} key={event.eventId} />;
    })
  ) : (
    <EventSkeleton />
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <Typography variant="h3">Events:</Typography>
        {recentEventssMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

export default Home;
