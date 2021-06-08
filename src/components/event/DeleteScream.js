import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { useDispatch } from "react-redux";
import MyButton from "../../util/MyButton";
import Button from "@material-ui/core/Button";
import DeleteOutline from "@material-ui/icons/DeleteOutlined";
import { deletEvent } from "../../redux/actions/dataActions";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%",
  },
};
function DeleteEvent(props) {
  const [open, setOpen] = useState(false);
  const { classes, eventId } = props;
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEventFunction = () => {
    dispatch(deletEvent(eventId));
  };
  return (
    <>
      <MyButton
        tip="Delete Event"
        onClick={handleOpen}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="secondary"></DeleteOutline>
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure you want delete this event?</DialogTitle>
        <DialogContent>This can't be reverse</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteEventFunction} color="secondary">
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(DeleteEvent);
