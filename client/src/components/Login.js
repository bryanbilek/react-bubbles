import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useHistory } from "react-router-dom";

const Login = () => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route

  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const { register, handleSubmit } = useForm();
  const history  = useHistory();

  const handleChanges = e => {
    setUser({...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    axiosWithAuth()
      .post("/api/login", data)
      .then(res => {
        console.log('***POST***', res);
        localStorage.setItem("token", (res.data.payload));
        history.push("/protected");
      })
      .catch(err => console.log(err.response));
  };
  return (
    <>
     <h1>Welcome to the Bubble App!</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        ref={register({ required: true, maxLength: 20 })}
        onChange={handleChanges}
      />

      <input
        type="password"
        placeholder="Password"
        name="password"
        ref={register({ required: true, maxLength: 20 })}
        onChange={handleChanges}
      />

      <button type="submit">Submit</button>
    </form>
    </>
  );
};

export default Login;
