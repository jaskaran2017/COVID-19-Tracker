import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";
import { FaHeartbeat } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <MDBFooter className=" text-lg-left footer">
      <div className=".text-info p-4" style={{ backgroundColor: "rgb(201,201,201,0.2)" }}>
        &copy; {new Date().getFullYear()} Copyright:{" "}
      </div>
      <div>
        <h4 className="text-white">
          Made with <FaHeartbeat /> by Jasjit...
        </h4>
      </div>
    </MDBFooter>
  );
}

export default Footer;
