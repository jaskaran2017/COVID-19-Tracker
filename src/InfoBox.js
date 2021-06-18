import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  // console.log(title, active);
  return (
    <div>
      <Card
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}
      >
        <CardContent>
          <Typography className="infobox__title" color="textSecondary">
            {title}
          </Typography>
          <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
            {cases}
          </h2>
          <Typography className="infobox__total" color="textSecondary">
            {total} total
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
