import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  return (
    <Navbar className="bg-dark" fixed="top">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="./src/assets/react.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <strong style={{ color: "white" }}>
            Product Management Dashboard
          </strong>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
export default NavBar;
