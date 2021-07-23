import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader, ModalFooter, Table } from "reactstrap";
import MyTable from "./components/MyTable";

function App() {
  return (
    <div className="App">
      <MyTable />
    </div>
  );
}

export default App;
