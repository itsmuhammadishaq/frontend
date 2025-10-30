import React, { useEffect, useState } from "react";
import MainScreen from "../../mainscreen";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import {  Link } from "react-router-dom";
import ErrorMessage from "../../ErrorMessage";

import { useDispatch, useSelector } from "react-redux";
import {register } from "../../../actions/userAction"
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [picMessage, setPicMessage] = useState(null);
  const dispatch=useDispatch()
  const userRegister=useSelector((state)=>state.userRegister)
  const {loading,error,userInfo}=userRegister
   const navigate = useNavigate();
  useEffect(()=>{
    if(userInfo){
      navigate("/mynotes")

    }
  },[navigate,userInfo])
  

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password!== confirmpassword){
      setMessage("passwords do not match")
    }else{
      dispatch(register(name,email,password,pic))
    }

    
  };
  const postDetails = (pics) => {
  if (!pics) {
    return setPicMessage("Please select an image");
  }

  setPicMessage(null);
  if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData();
    data.append("file", pics);
     data.append("upload_preset", "notezipper");
      data.append("cloud_name", "domeaganh");

    fetch("https://api.cloudinary.com/v1_1/domeaganh/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        console.log("Uploaded Image URL:", data.url.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    setPicMessage("Please select a JPEG or PNG image");
  }
};


  return (
    <MainScreen title="Register">
      <div className="loginContainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <loading />}
        {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="Name"
              value={name}
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>{" "}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>

            <Form.Control
              type="Confirm password"
              value={confirmpassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {picMessage && (
              <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
            )}
          </Form.Group>{" "}
          <Form.Group className="mb-3" controlId="pic">
            <Form.Label>Profile picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => postDetails(e.target.files[0])}
              size="lg"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            REGISTER
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Have an Acoount ? <Link to="/register">login</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterScreen;
