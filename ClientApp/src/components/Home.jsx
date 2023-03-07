import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";
import "./Home.css";

export function Home() {
  const [result, setResult] = useState([]);
  const [setCode, setSetCode] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(true);

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

  async function getUrgentes() {
    const response = await fetch("Home/getUrgentes");
    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  async function addUrgente() {
    if (setCode != "" && qty != "") {
      setLoading(true);
      const response = await fetch(
        "Home/addUrgente:" + setCode.trim() + ":" + qty
      );
      const data = await response.json();
      if (data == 0) {
        notify("Urgente agregado correctamente", "success");
        getUrgentes();
      } else {
        notify("Urgente ya agregado", "error");
        setLoading(false);
      }
    } else {
      notify("Complete los campos", "warning");
    }
    setSetCode("");
    setQty("");
  }

  useEffect(() => {
    getUrgentes();
    let interval = setInterval(() => {
      getUrgentes();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function filterTable(id) {
    let filter, table, tr, td, i, txtValue, td2, td3;
    filter = id.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      td2 = tr[i].getElementsByTagName("td")[1];
      td3 = tr[i].getElementsByTagName("td")[3];
      if (td || td2 || td3) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  function loader() {
    return (
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: "1001",
          display: loading ? "block" : "none",
        }}
      >
        <div className="loader">
          <span>DAWS...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      {loader()}
      <MDBBtn
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: "1000",
          borderRadius: "10px",
          backgroundColor: "#249D45",
        }}
      >
        <MDBIcon
          fas
          icon="sync"
          style={{
            color: "white",
            fontSize: "20px",
          }}
        />
      </MDBBtn>
      <Modal />
      <ToastContainer />
      <MDBContainer
        fluid
        style={{
          backgroundColor: "#F5F5F5",
          width: "100%",
          height: "100%",
        }}
      >
        <MDBRow>
          <MDBCol md={12}>
            <MDBCard
              style={{
                marginTop: "10px",
                borderRadius: "10px",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              <MDBCardHeader>
                <MDBRow>
                  <MDBCol
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <input
                      type="text"
                      style={{
                        width: "200px",
                      }}
                      className="form-control"
                      placeholder="Search"
                      onChange={(e) => filterTable(e.target.value)}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardHeader>
              <MDBCardHeader>
                <MDBRow>
                  <MDBCol
                    md={12}
                    style={{
                      overflowX: "auto",
                      overflowY: "auto",
                      height: window.innerHeight - 200,
                    }}
                  >
                    <table className="table" id="table">
                      <thead
                        style={{
                          backgroundColor: "darkblue",
                          color: "white",
                          textAlign: "center",
                          fontStyle: "bold",
                          position: "sticky",
                          top: 0,
                        }}
                      >
                        <tr>
                          <th>SetCode</th>
                          <th>CutCode</th>
                          <th>RelationType</th>
                          <th>Machine</th>
                          <th>D0</th>
                          <th>Inventary</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                          color: "black",
                          fontSize: "15px",
                        }}
                      >
                        {result.map((item) => (
                          <tr key={item.ID} style={{}}>
                            <td>{item.SetCode}</td>
                            <td>{item.CutCode}</td>
                            <td>{item.RelationType}</td>
                            <td>{item.Machine}</td>
                            <td>{item.D0}</td>
                            <td>{item.Inventary}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </MDBCol>
                </MDBRow>
              </MDBCardHeader>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
