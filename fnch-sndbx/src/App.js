import './App.css';
import Directory from './components/Directory';
import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const API_ENDPOINT = "http://localhost:5000";

function App() {

  const [directory, setDirectory] = useState([]);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const handleCloseError = () => setShowError(false);

  function loadDirectory() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    fetch(`${API_ENDPOINT}/api/directory`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error with directory api");
        }
      }).then(result => setDirectory(result))
      .catch(error => handleError(error));
  }

  function getPayment() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    fetch(`${API_ENDPOINT}/api/payment`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error with payment api");
        }
      }).then(result => setDirectory(result))
      .catch(error => handleError(error));
  }

  const handleError = (error) => {
    setError(error.message);
    setShowError(true);
  }

  useEffect(() => {
    loadDirectory();
  }, []);


  return (
    <div className="App">
      <Container>

        <Modal show={showError} onHide={handleCloseError}>
          <Modal.Header closeButton>
            <Modal.Title>Error!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>


        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">
              Finch App
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Button variant="light" onClick={getPayment}>Payment Info</Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Row>
          {directory.individuals && <Directory directory={directory} handleError={handleError} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;