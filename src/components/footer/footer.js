import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
  return (
<footer
  style={{
    position: "static",
    bottom: 0,
    left: 0,
    width: "100%",
    
    textAlign: "center",
    padding: "10px 0",
    borderTop: "1px solid #dee2e6",
  }}
>
  <Container>
    <Row>
      <Col>Copyright &copy; Note Zipper</Col>
    </Row>
  </Container>
</footer>
  )
}

export default Footer
