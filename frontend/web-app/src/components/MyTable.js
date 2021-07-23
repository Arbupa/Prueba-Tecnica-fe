import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const MyTable = () => {
  // to handle the state of the data response from api
  const [dataApi, setDataApi] = useState([]);
  // to handle the state of the modals
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInsert, setModalInsert] = useState(false);
  // to handle the company selected in the table
  const [companySelected, setCompanySelected] = useState({
    _id: "",
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
    // here possibly add another modal for graph
    if (option === "Edit") {
      setModalEdit(true);
    }
    if (option === "Delete") {
      setModalDelete(true);
    }
  };

  // asign to the state what user is typing.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanySelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const edit = () => {
    var newData = dataApi;

    newData.map((company) => {
      if (company._id.$oid === companySelected._id.$oid) {
        company.name = companySelected.name;
        company.description = companySelected.description;
        company.symbol = companySelected.symbol;

        const response = fetch(
          `http://localhost:5000/companies/${companySelected._id.$oid}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: companySelected.name,
              description: companySelected.description,
              symbol: companySelected.symbol,
            }),
          }
        );
      }
      return "There was an error";
    });
    setDataApi(newData);
    setModalEdit(false);
  };

  const deleteData = () => {
    const response = fetch(
      `http://localhost:5000/companies/${companySelected._id.$oid}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    // update the dataApi array leaving all data except data who match with the selected id
    setDataApi(
      dataApi.filter((company) => company._id.$oid !== companySelected._id.$oid)
    );
    // hide the modal
    setModalDelete(false);
  };

  // fetch all data from api
  const fetchData = async () => {
    try {
      const urlApi = "http://localhost:5000/companies";
      const response = await fetch(urlApi);
      const json = await response.json();
      setDataApi(json);
      return json;
    } catch (error) {
      console.log("error", error);
    }
  };

  // function to handle modal behavior
  const openModalInsert = () => {
    setCompanySelected(null);
    setModalInsert(true);
  };

  //function to insert data
  const insertData = async () => {
    // fetch to do the POST request sending headers and body arguments
    const response = await fetch("http://localhost:5000/companies", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: companySelected.name,
        description: companySelected.description,
        symbol: companySelected.symbol,
      }),
    });
    // aux var to avoid conflicts with companySelected id field
    var valueToInsert = {
      name: companySelected.name,
      description: companySelected.description,
      symbol: companySelected.symbol,
    };
    // store the old data into our new var
    var newData = dataApi;
    // add the new element to the table
    newData.push(valueToInsert);
    // update the state of dataApi with our newData
    setDataApi(newData);
    // change the state of our modal hidding it
    setModalInsert(false);
  };

  return (
    <div className="tabla">
      <br />
      <h1 style={{ textAlign: "center" }}>Table with data from backend :D</h1>
      <br />
      <br />
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => setModalInsert(true)}
        className="btn btn-success"
      >
        Insert Data
      </button>
      <br />
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
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
              <td>
                {element._id === undefined
                  ? "Refresh to upload..."
                  : element._id.$oid}
              </td>
              <td>
                {element.uuid === undefined
                  ? "Refresh to upload..."
                  : element.uuid.$uuid}
              </td>
              <td>{element.name}</td>
              <td>{element.description}</td>
              <td>{element.symbol}</td>
              <td>
                <button className="btn btn-warning">Show graph</button>
              </td>
              <td>
                <button
                  onClick={() => companySelect(element, "Edit")}
                  className="btn btn-info"
                >
                  Edit
                </button>
                {"   "}
                <button
                  onClick={() => companySelect(element, "Delete")}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
      {/* the state of Modal is controlled by modalEdit */}
      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <h3>Edit Company information</h3>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="">ID</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id"
              value={companySelect && companySelected._id.$oid}
            />
            <br />

            <label htmlFor="">Name (limited to only 50 characters)</label>
            <input
              className="form-control"
              type="text"
              name="name"
              // adding validations also in frontend
              value={
                companySelected.name.length < 51
                  ? companySelect && companySelected.name
                  : ""
              }
              onChange={handleChange}
            />
            <br />

            <label htmlFor="">
              Description (limited to only 100 characters)
            </label>
            <textarea
              className="form-control"
              type="text"
              name="description"
              // adding validations also in frontend
              value={
                companySelected.description.length < 101
                  ? companySelect && companySelected.description
                  : ""
              }
              onChange={handleChange}
            />
            <br />

            <label htmlFor="">Symbol (limited to only 10 characters)</label>
            <input
              className="form-control"
              type="text"
              name="symbol"
              // adding validations also in frontend
              value={
                companySelected.symbol.length < 11
                  ? companySelect && companySelected.symbol
                  : ""
              }
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => edit()} className="btn btn-lg btn-info">
            Edit & Save
          </button>
          <button
            onClick={() => setModalEdit(false)}
            className="btn btn-lg btn-danger"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalHeader>
          <h3>Delete Company information</h3>
        </ModalHeader>
        <ModalBody>
          Are you sure that you want to delete the company name: "
          {companySelected && companySelected.name}"?
        </ModalBody>
        <ModalFooter>
          {/* on click executes deleteData function */}
          <button
            onClick={() => deleteData()}
            className="btn btn-lg btn-danger"
          >
            Yes
          </button>
          <button
            // if "Nope" option is clicked hide the modal
            onClick={(deleteData) => setModalDelete(false)}
            className="btn btn-lg btn-secondary"
          >
            Nope
          </button>
        </ModalFooter>
      </Modal>

      {/* modalInsert handle the state of this modal */}
      <Modal isOpen={modalInsert}>
        <ModalHeader>
          <h3>Insert Company Information</h3>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="">Number of element in table</label>
            <input
              className="form-control"
              type="text"
              name="id"
              readOnly
              value={dataApi.length - 1 + 2}
            />
            <br />

            <label htmlFor="">Name (limited to only 50 characters)</label>
            <input
              className="form-control"
              type="text"
              name="name"
              // adding validations also in frontend
              value={
                companySelected.name.length < 51
                  ? companySelect && companySelected.name
                  : ""
              }
              onChange={handleChange}
            />
            <br />

            <label htmlFor="">
              Description (limited to only 100 characters)
            </label>
            <textarea
              className="form-control"
              type="text"
              name="description"
              // adding validations also in frontend
              value={
                companySelected.description.length < 101
                  ? companySelect && companySelected.description
                  : ""
              }
              onChange={handleChange}
            />
            <br />

            <label htmlFor="">Symbol (limited to only 10 characters)</label>
            <input
              className="form-control"
              type="text"
              name="symbol"
              // adding validations also in frontend
              value={
                companySelected.symbol.length < 11
                  ? companySelect && companySelected.symbol
                  : ""
              }
              onChange={handleChange}
            />
            <br />
            <label style={{ color: "red" }} htmlFor="">
              P.S.: After insert, must reload page. Sorry :(((
            </label>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            // on click executes insertData function to create new data
            onClick={async () => await insertData()}
            className="btn btn-lg btn-primary"
          >
            Insert
          </button>
          <button
            // if Cancel option is clicked hide ModalInsert
            onClick={() => setModalInsert(false)}
            className="btn btn-lg btn-danger"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MyTable;
