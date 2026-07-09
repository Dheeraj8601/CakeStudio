import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
} from "@mui/material";
import SessionManage from "../../../../Session/SessionManage"
import CustomTextField from "../../CustomFields/CustomTextField/CustomTextField";
import CustomPasswordField from "../../CustomFields/CustomPasswordField/CustomPasswordField";
import PrimaryButton from "../../CustomFields/PrimaryButton/PrimaryButton";

import "./LoginForm.css";
import Service from "../../../../services/Service";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    //rememberMe: false,
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      //[name]: type === "checkbox" ? checked : value,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(form);
    const request = {
      Email: form.email,
      Password: form.password,
    };
    try {
      const res = Service.login('Auth/login', request)
        .then(res => {
          const data = res.data
          console.log(data,"data")
          debugger
          SessionManage.setTokenId(data.accessToken);
          SessionManage.setRefreshToken(data.refreshToken);
          SessionManage.setUserId(data.userId)
          SessionManage.setUserRole(data.role)
          navigate('/')
        })
    } catch (err) {
      console.error(err, ' : Error')
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <CustomTextField
        label="Email Address"
        placeholder="Enter your email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <CustomPasswordField
        label="Password"
        placeholder="Enter your password"
        name="password"
        value={form.password}
        onChange={handleChange}
      />

      <Box className="login-options">
        <FormControlLabel
          control={
            <Checkbox
              name="rememberMe"
              //checked={form.rememberMe}
              //onChange={handleChange}
              size="small"
            />
          }
          label="Remember Me"
        />
      </Box>

      <PrimaryButton type="submit">
        Login
      </PrimaryButton>

      <Typography className="register-text">
        Don't have an account?{" "}
        <Link href="/register" underline="hover" className="register-link">
          Register here
        </Link>
      </Typography>
    </form>
  );
};

export default LoginForm;