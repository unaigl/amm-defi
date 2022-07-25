import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

// Modal With Grid
function SwapModal(props) {
    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Swap Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Row>
                        <Col md={12} lg={8}>
                            {"You're swaping"}
                        </Col>
                        <Col md={6} lg={4}>
                            {`${props.cuantity0}   ${props.symbol0}`}
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} lg={8}>
                            {"In exchange for"}
                        </Col>
                        <Col md={6} lg={4}>
                            {`${props.cuantity1}   ${props.symbol1}`}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} onMouseDown={props.onVerified}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SwapModal;