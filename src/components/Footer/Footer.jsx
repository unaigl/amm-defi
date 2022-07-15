import React from "react";
import { Container, Row } from "react-bootstrap";
import {
    AiFillGithub,
    AiOutlineTwitter,
    AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import "./Footer.css"

function Footer() {
    // let date = new Date();
    // let year = date.getFullYear();
    return (
        <Container fluid className="footer">
            <Row className="footer-display">
                <h2 className="footer-display">
                    <a
                        href="https://github.com/unaigl"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <AiFillGithub />
                    </a>
                </h2>

                <h2 className="footer-display">
                    <a
                        href="https://twitter.com/Unai_naz"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <AiOutlineTwitter />
                    </a>
                </h2>
                <h2 className="footer-display">
                    <a
                        href="https://www.linkedin.com/in/unaiiglesias"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaLinkedinIn />
                    </a>
                </h2>
                <h2 className="footer-display">
                    <a
                        target="_blank"
                        href="https://www.instagram.com/unai_igl/"
                        rel="noreferrer"
                    >
                        <AiFillInstagram />
                    </a>
                </h2>
            </Row>
        </Container>
    );
}

export default Footer;
