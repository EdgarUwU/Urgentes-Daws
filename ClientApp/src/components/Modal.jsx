import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";

export function Modal() {
  const [Modal, setModal] = useState(false);
  const [file, setFile] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleShow = () => setModal(!Modal);

  const notify = (message, type) =>
    toast(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type,
    });

  async function uploadFile() {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("Correo", email);
    formData.append("Password", password);
    const response = await fetch("Home/uploadFile", {
      method: "POST",
      body: formData,
    });
    if (response != 0) {
      notify("File uploaded successfully", "success");
      toggleShow();
    } else {
      notify("Error al subir el archivo", "error");
    }
    //limpiar campos
    setFile([]);
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <ToastContainer />
      <MDBModal show={Modal} setShow={setModal} tabIndex="-1">
        <MDBModalDialog size="md">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Upload File</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="form-group">
                <label htmlFor="formFile" className="form-label">
                  Production Plan
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <MDBRow className="mt-4">
                <MDBCol
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <MDBBtn
                    color="primary"
                    size="sm"
                    //descargar template de excel
                    href="https://localhost:44456/Template/Template.xlsx"
                  >
                    Template
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-4">
                <MDBCol md={6}>
                  <div className="form-group">
                    <label htmlFor="Email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </MDBCol>
                <MDBCol md={6}>
                  <div className="form-group">
                    <label htmlFor="Password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="danger" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn color="success" onClick={uploadFile}>
                Upload File
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
