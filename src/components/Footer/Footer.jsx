import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
    AiFillGithub,
    AiOutlineTwitter,
    AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { SiBuffer } from "react-icons/si";
import "./Footer.css"

function Footer() {
    // let date = new Date();
    // let year = date.getFullYear();
    return (
        <Container fluid className="footer">
            <Row >
                <small>In order to succed, in metamask; first confirm approve (to uniswap); second confirm swap  </small>
                <small>Uniswap router contract: 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45  </small>
                <b>As developer, I am not Responsible for Accidents Agreement</b>
                <b>MIT license</b>
                <p>Available Chains: Ethereum and Polygon. Contact me to add more chains </p>
                <p>You can trade between first 450 tokens (NO coins yet) by market cap </p>
                <p>This DApp has been built from scrath</p>
                <p>Data is fetched using web scraping technique.<a href='https://github.com/unaigl/scraping' > Check here! </a> </p>
            </Row>
            <Row >
                <Col md={12} className="footer-center">
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
                    <h2 className="footer-display">
                        <a
                            target="_blank"
                            href="https://dev.to/uigla"
                            rel="noreferrer"
                        >
                            <SiBuffer />
                        </a>
                    </h2>
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
