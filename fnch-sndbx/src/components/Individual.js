import React, { useState, useEffect, useCallback } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const API_ENDPOINT = "http://localhost:5000";

export default function Individual({ individual, handleError }) {
    //individual
    const [selectedIndividualData, setSelectedIndividualData] = useState({});
    const [showIndividual, setShowIndividual] = useState(false);
    const handleCloseIndividual = () => setShowIndividual(false);

    //employement
    const [selectedEmploymentData, setSelectedEmploementlData] = useState({});
    const [showEmployment, setShowEmployment] = useState(false);
    const handleCloseEmployment = () => setShowEmployment(false);


    const viewIndividual = (event) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(`${API_ENDPOINT}/api/individual/${individual.id}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    throw new Error('Error with individual details endpoint');
                }
            }).then(result => {
                console.log(result);
                setSelectedIndividualData(result);
                setShowIndividual(true);
            })
            .catch(error => handleError(error));
    }

    const viewEmployment = (event) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(`${API_ENDPOINT}/api/individual/${individual.id}/employment`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    console.log(response); 
                    return response.json(); 
                } else {
                    throw new Error('Error with employment endpoint');
                }
            }).then(result => {
                console.log(result);
                setSelectedEmploementlData(result);
                setShowEmployment(true);
            })
            .catch(error => handleError(error));
    }


    return (
        <Row>
            <Modal show={showIndividual} onHide={handleCloseIndividual}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedIndividualData.last_name}, {selectedIndividualData.first_name} {selectedIndividualData.middle_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedIndividualData.preferred_name && <Col>{selectedIndividualData.preferred_name}</Col>}
                    {selectedIndividualData.dob && <Col>{selectedIndividualData.dob}</Col>}
                    {selectedIndividualData.gender && <Col>{selectedIndividualData.gender}</Col>}
                    {selectedIndividualData.ethnicity && <Col>{selectedIndividualData.ethnicity}</Col>}
                    {selectedIndividualData.phone_numbers && <Col>{selectedIndividualData.phone_numbers.map(i => <div key={i.data}>{i.type}: {i.data}</div>)}</Col>}
                    {selectedIndividualData.emails && <Col>{selectedIndividualData.emails.map(i => <div key={i.data}>{i.type}: {i.data}</div>)}</Col>}
                    {selectedIndividualData.residence && <Col>{selectedIndividualData.residence.line1}, {selectedIndividualData.residence.line2}, {selectedIndividualData.residence.city}, {selectedIndividualData.residence.state} {selectedIndividualData.residence.postal_code}</Col>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseIndividual}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEmployment} onHide={handleCloseEmployment}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEmploymentData.last_name}, {selectedEmploymentData.first_name} {selectedEmploymentData.middle_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmploymentData.title && <Col>Title: {selectedEmploymentData.title}</Col>}
                    {selectedEmploymentData.department && <Col>Department: {selectedEmploymentData.department.name}</Col>}
                    {selectedEmploymentData.start_date && <Col>Start Date: {selectedEmploymentData.start_date}</Col>}
                    {selectedEmploymentData.end_date && <Col>End Date: {selectedEmploymentData.end_date}</Col>}
                    {selectedEmploymentData.class_code && <Col>Class Code:{selectedEmploymentData.class_code}</Col>}
                    {selectedEmploymentData.income && <Col>Income({selectedEmploymentData.income.unit}): {selectedEmploymentData.income.currency}, {selectedEmploymentData.income.amount}</Col>}
                    {selectedEmploymentData.location && <Col>Location: {selectedEmploymentData.location.line1}, {selectedEmploymentData.location.line2}, {selectedEmploymentData.location.city}, {selectedEmploymentData.location.state} {selectedEmploymentData.location.postal_code}</Col>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEmployment}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Card bg="light" className="mb-2">
                <Card.Body>
                    <Card.Header>
                        <Card.Title>{individual.last_name}, {individual.first_name} {individual.middle_name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{individual.is_active ? "Active" : "Inactive"}</Card.Subtitle>
                    </Card.Header>
                    <Row>
                        <Col>
                            <div>Assigned Department: {individual.department.name}</div>
                        </Col>
                        <Col style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'end' }}>
                            <Button variant="primary" onClick={viewIndividual} >
                                View Individual Data
                            </Button>
                        </Col>
                        <Col style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'end' }}>
                            <Button variant="primary" onClick={viewEmployment} >
                                View Employement Data
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                </Card.Footer>
            </Card >
        </Row>
    );
}

