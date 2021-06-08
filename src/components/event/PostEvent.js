import React, { useEffect, useState } from "react";
import { DateTimePicker } from "@material-ui/pickers";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  withStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../util/MyButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { postEvent } from "../../redux/actions/dataActions";
import { CLEAR_ERRORS } from "../../redux/types";
import dayjs from "dayjs";
import "dayjs/locale/hu"; // ES 2015
dayjs.locale("hu"); // use locale globally
/*TODO:
post a new event lekezelese, kode lekezelese, backenden is
*/
const styles = (theme) => ({
  ...theme.speadThis,
  submitButton: { position: "relative", float: "right", marginTop: 10 },
  progressSpinner: { position: "absolute" },
  closeButton: { position: "absolute", left: "91%", top: "4%" },
});

const PostEvent = (props) => {
  const { classes } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(null);
  const UI = useSelector((state) => state.UI);
  const loading = UI.loading;
  const errors = UI.errors;
  const [selectedDate, handleDateChange] = useState(dayjs());
  const [code, setCode] = useState("01");
  const startCode = dayjs().format("YY[B]");

  useEffect(() => {
    dispatch({ type: CLEAR_ERRORS });
    setState("");
  }, [open, dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // dispatch({ type: CLEAR_ERRORS });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state);
    dispatch(postEvent(state));
    setState("");
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <>
      <MyButton onClick={handleOpen} tip="Post a Event!">
        <AddIcon />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogTitle>Post a new event</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="description"
              type="text"
              label="Description"
              multiline
              rows="3"
              placeholder="Webfejlesztes"
              error={errors.error ? true : false}
              helperText={errors.error}
              className={classes.textField}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="1182 Budapest, Orgona utca 1"
              error={errors.error ? true : false}
              helperText={errors.error}
              className={classes.textField}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              type="text"
              className={classes.textField}
              value={startCode}
              disabled
            />
            <TextField
              name="code"
              type="text"
              label="code"
              placeholder="01"
              error={errors.error ? true : false}
              helperText={errors.error}
              className={classes.textField}
              onChange={handleChange}
            />
            {/* <DatePicker value={selectedDate} onChange={handleDateChange} />
              <TimePicker value={selectedDate} onChange={handleDateChange} /> */}
            <DateTimePicker value={selectedDate} onChange={handleDateChange} />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(PostEvent);
