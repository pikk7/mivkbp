import React from "react";
import MyButton from "../../util/MyButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { applyEvent, leaveEvent } from "../../redux/actions/dataActions";

function LikeButton(props) {
  const dispatch = useDispatch();
  const eventId = props.eventId;
  const { authenticated, applies } = useSelector((state) => state.user);
  const appliedEvent = () => {
    return applies && applies.find((apply) => apply.eventId === eventId);
  };

  const applyEventFunc = () => {
    dispatch(applyEvent(eventId));
  };

  const unLikeEventFunc = () => {
    dispatch(leaveEvent(eventId));
  };
  const applyButton = !authenticated ? (
    <Link to="/login">
      <MyButton tip="Like">
        <FavoriteBorder color="primary" />
      </MyButton>
    </Link>
  ) : appliedEvent() ? (
    <MyButton tip="Undo like" onClick={unLikeEventFunc}>
      <FavoriteIcon color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Like" onClick={applyEventFunc}>
      <FavoriteBorder color="primary" />
    </MyButton>
  );
  return applyButton;
}

export default LikeButton;
