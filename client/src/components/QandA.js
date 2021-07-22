import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  audioRoot: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioBox: {
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audio: {
    height: "40px",
  },
});

const QandA = ({ doc, handleDeleteRecord }) => {
  const classes = useStyles();
  let questionDate = new Date(doc.data().createdAt);
  questionDate =
    questionDate.getFullYear().toString() +
    " / " +
    (questionDate.getMonth() + 1).toString() +
    " / " +
    questionDate.getDate().toString();

  return (
    <>
      <div className={classes.audioRoot}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4 style={{ margin: "0" }}>{questionDate}</h4>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={()=>handleDeleteRecord(doc.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={classes.audioBox}>
          <h3>질문</h3>
          <audio src={doc.data().recordURL} controls className={classes.audio}></audio>
        </div>
        <div className={classes.audioBox}>
          <h3>답변</h3>{" "}
          {doc.data().answerURL !== "" ? (
            <audio
              src={doc.data().answerURL}
              controls
              className={classes.audio}
            ></audio>
          ) : (
            <div style={{ width: "300px", textAlign: "center" }}>
              답변이 없습니다
            </div>
          )}
        </div>
      </div>
      <hr style={{ width: "90%", color: "#f50057", border: "1px solid" }} />
    </>
  );
};

export default QandA;
