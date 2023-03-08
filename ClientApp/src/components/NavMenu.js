import React, { Component } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
} from "mdb-react-ui-kit";
import logo from "../img/DAWS Color.png";
import { Modal } from "./Modal";
export function NavMenu() {
  return (
    <>
      <MDBNavbar
        light
        bgColor="light"
        style={{
          padding: "2px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <img src={logo} height="50" alt="Logo" loading="lazy" />
          </MDBNavbarBrand>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
