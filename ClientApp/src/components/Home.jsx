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

export function Home() {
  const [result, setResult] = useState([]);
  const [setCode, setSetCode] = useState("");
  const [qty, setQty] = useState(0);
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
  }

  async function updateHours() {
    const response = await fetch("Home/updateHours");
    const data = await response.json();
    if (data.map((item) => item.result == "0")) {
      notify("Horas actualizadas correctamente", "success");
      getUrgentes();
    } else {
      notify("Error al actualizar horas", "error");
    }
  }

  async function addUrgente() {
    const response = await fetch("Home/addUrgente:" + setCode + ":" + qty);
    const data = await response.json();
    if (data.map((item) => item.result) == "0") {
      notify("Urgente agregado correctamente", "success");
      getUrgentes();
    } else {
      notify("Urgente ya agregado", "error");
    }
  }

  useEffect(() => {
    getUrgentes();
    let interval = setInterval(() => {
      getUrgentes();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function filterTable(id) {
    let filter, table, tr, td, i, txtValue;
    filter = id.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  return (
    <>
      <MDBBtn
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: "1000",
          borderRadius: "10px",
          backgroundColor: "green",
        }}
        onClick={updateHours}
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
      <ToastContainer />
      <MDBContainer
        fluid
        style={{
          marginTop: "10px",
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
                  <MDBCol md={2}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SetCode"
                      onChange={(e) => setSetCode(e.target.value)}
                    />
                  </MDBCol>
                  <MDBCol md={2}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Qty"
                      value={0}
                      onChange={(e) => setQty(e.target.value)}
                    />
                  </MDBCol>
                  <MDBCol md={1}>
                    <MDBBtn
                      color="primary"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={addUrgente}
                    >
                      Add
                    </MDBBtn>
                  </MDBCol>
                  <MDBCol
                    md={7}
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
                          <th>Line</th>
                          <th>SetCode</th>
                          <th>Qty</th>
                          <th>ResultDate</th>
                          <th>RelationType</th>
                          <th>D0</th>
                          <th>D1</th>
                          <th>InTransit</th>
                          <th>InBranch</th>
                          <th>Inventary</th>
                          <th>QtyTotal</th>
                          <th>Plant</th>
                          <th>Process Hour</th>
                          <th>Cut Hour</th>
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
                          <tr
                            key={item.ID}
                            style={{
                              backgroundColor:
                                item.Total > item.D0
                                  ? "#4aef3fad"
                                  : "#ff5f5fad",
                            }}
                          >
                            <td>{item.Linea}</td>
                            <td>{item.SetCode}</td>
                            <td>{item.Qty}</td>
                            <td>{item.ResultDate}</td>
                            <td>{item.RelationType}</td>
                            <td>{item.D0}</td>
                            <td>{item.D1}</td>
                            <td>{item.InTransit}</td>
                            <td>{item.InBranch}</td>
                            <td>{item.Inventary}</td>
                            <td>{item.Total}</td>
                            <td>{item.Plant}</td>
                            <td>{item.ProcessHour}</td>
                            <td>{item.CutHour}</td>
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
