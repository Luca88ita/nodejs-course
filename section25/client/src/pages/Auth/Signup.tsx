import { FormEvent, useState } from "react";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";
import { InputType, SignupType } from "../../util/types";

interface Props {
  onSignup: (event: FormEvent<HTMLFormElement>, form: any) => void;
  loading: boolean;
}

const Signup = ({ onSignup, loading }: Props) => {
  const [signupForm, setSignupForm] = useState({
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
    name: {
      value: "",
      valid: false,
      touched: false,
      validators: [required],
    },
    formIsValid: false,
  });

  const inputChangeHandler = (input: SignupType, value: string) => {
    setSignupForm((prevState) => {
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
        const x = inputName as SignupType;
        formIsValid = formIsValid && updatedForm[x].valid;
      }
      return {
        ...updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input: SignupType) => {
    setSignupForm((prevState) => ({
      ...prevState,
      [input]: {
        ...prevState[input],
        touched: true,
      },
    }));
  };

  return (
    <Auth>
      <form onSubmit={(e) => onSignup(e, signupForm)}>
        <Input
          id={InputType.EMAIL}
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={(e) => inputChangeHandler(SignupType.EMAIL, e.target.value)}
          onBlur={() => inputBlurHandler(SignupType.EMAIL)}
          value={signupForm.email.value}
          valid={signupForm.email.valid}
          touched={signupForm.email.touched}
        />
        <Input
          id={InputType.NAME}
          label="Your Name"
          type="text"
          control="input"
          onChange={(e) => inputChangeHandler(SignupType.NAME, e.target.value)}
          onBlur={() => inputBlurHandler(SignupType.NAME)}
          value={signupForm.name.value}
          valid={signupForm.name.valid}
          touched={signupForm.name.touched}
        />
        <Input
          id={InputType.PASSWORD}
          label="Password"
          type="password"
          control="input"
          onChange={(e) =>
            inputChangeHandler(SignupType.PASSWORD, e.target.value)
          }
          onBlur={() => inputBlurHandler(SignupType.PASSWORD)}
          value={signupForm.password.value}
          valid={signupForm.password.valid}
          touched={signupForm.password.touched}
        />
        <Button design="raised" type="submit" loading={loading}>
          Signup
        </Button>
      </form>
    </Auth>
  );
};

export default Signup;
