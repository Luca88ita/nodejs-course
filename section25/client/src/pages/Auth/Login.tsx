import { FormEvent, useState } from "react";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";
import { InputType, LoginType } from "../../util/types";

type Credentials = {
  email: string;
  password: string;
};

interface Props {
  onLogin: (
    event: FormEvent<HTMLFormElement>,
    credentials: Credentials
  ) => void;
  loading: boolean;
}

const Login = ({ onLogin, loading }: Props) => {
  const [loginForm, setLoginForm] = useState({
    email: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
    formIsValid: false,
  });

  const inputChangeHandler = (input: LoginType, value: string) => {
    setLoginForm((prevState) => {
      let isValid = true;
      for (const validator of prevState[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState,
        [input]: {
          ...prevState[input],
          valid: isValid,
          value: value,
        },
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        const x = inputName as LoginType;
        formIsValid = formIsValid && updatedForm[x].valid;
      }
      return {
        ...updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input: LoginType) => {
    setLoginForm((prevState) => ({
      ...prevState,
      [input]: {
        ...prevState[input],
        touched: true,
      },
    }));
  };

  return (
    <Auth>
      <form
        onSubmit={(e) =>
          onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value,
          })
        }
      >
        <Input
          id={InputType.EMAIL}
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler(LoginType.EMAIL)}
          value={loginForm.email.value}
          valid={loginForm.email.valid}
          touched={loginForm.email.touched}
        />
        <Input
          id={InputType.PASSWORD}
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler(LoginType.PASSWORD)}
          value={loginForm.password.value}
          valid={loginForm.password.valid}
          touched={loginForm.password.touched}
        />
        <Button design="raised" type="submit" loading={loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
