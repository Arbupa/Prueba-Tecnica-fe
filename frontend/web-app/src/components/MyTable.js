import { Modal } from "bootstrap";
import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const MyTable = () => {
  const [dataApi, setDataApi] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [companySelected, setCompanySelected] = useState({
    name: "",
    description: "",
    symbol: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // function to open the respective modal
  const companySelect = (element, option) => {
    setCompanySelected(element);
    option === "Edit" && setModalEdit(true);
  };

  const fetchData = async () => {
    try {
      const urlApi = "http://localhost:5000/companies";
      const response = await fetch(urlApi);
      const json = await response.json();
      //console.log(json);
      setDataApi(json);
      return json;
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="tabla">
      <h3>Table! :D</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID Mongo</th>
            <th>UUID-4</th>
            <th>Company Name</th>
            <th>Description</th>
            <th>Symbol</th>
            <th>Market Values</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {dataApi.map((element) => (
            <tr>
              {console.log(element)}
              <td key={element._id.$oid}>{element._id.$oid}</td>
              <td key={element._id.$oid}>{element.uuid.$uuid}</td>
              <td key={element._id.$oid}>{element.name}</td>
              <td key={element._id.$oid}>{element.description}</td>
              <td key={element._id.$oid}>{element.symbol}</td>
              <td key={element._id.$oid}>
                <button className="btn btn-warning">Show graphic</button>
              </td>
              <td key={element._id.$oid}>
                <button
                  key={element._id.$oid}
                  onClick={() => companySelect(element, "Edit")}
                  className="btn btn-primary"
                >
                  Edit
                </button>
                {"   "}
                <button key={element._id.$oid} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>

      {/* the state of Modal is controlled by modalEdit */}
      {/* <Modal isOpen={modalEdit}>
        <ModalHeader>
          <h3>Edit Company information</h3>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="">Name</label>
            <input className="form-control" readOnly type="text" name="name" />
            <br />

            <label htmlFor="">description</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="description"
            />
            <br />

            <label htmlFor="">Symbol</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="symbol"
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-lg btn-info"></button>
          <button className="btn btn-lg btn-danger"></button>
        </ModalFooter>
      </Modal> */}
    </div>
  );
};

export default MyTable;
