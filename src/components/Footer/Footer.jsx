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
                <p>Available Mainnet Chains: Ethereum and Polygon </p>
                <p>You can trade between first 450 tokens (NO coins yet) by market cap </p>
                <p>Contact me to add more chains, tokens or coins </p>
                <p>This DApp has been built from scrath</p>
                <p>Data is fetched using web scraping technique.<a href='https://github.com/unaigl/scraping' > here! </a> </p>
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
            <br />
            <small>In order to swap, Ex. using metamask: </small>
            <br />
            <small>Select two token amount  </small>
            <br />
            <small>1_ Verify transaction data  </small>
            <br />
            <small>Press Swap  </small>
            <br />
            <small>2_ Confirm approve (TO uniswap router): 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45  </small>
            <br />
            <small>3_ Confirm swap</small>
            <br />
            <br />
            <p>Check DISCLAIMER OF RESPONSIBILITY <a href='https://github.com/unaigl/amm-defi' > here! </a></p>
            <br />

        </Container>
    );
}

export default Footer;
