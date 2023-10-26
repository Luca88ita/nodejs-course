import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./Input.module.css";
import { InputType } from "../../../util/types";

interface Props {
  label?: string;
  id?: InputType;
  control: "input" | "textarea";
  valid?: boolean;
  touched?: boolean;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  value?: string | number;
  placeholder?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: () => void;
  rows?: number;
}

const input = ({
  label,
  id,
  control,
  valid,
  touched,
  type,
  required,
  value,
  placeholder,
  onChange,
  onBlur,
  rows,
}: Props) => (
  <div className={styles.input}>
    {label && <label htmlFor={id}>{label}</label>}
    {control === "input" && (
      <input
        className={`${valid ? styles.valid : styles.invalid} ${
          touched ? styles.touched : styles.untouched
        }`}
        type={type ? type : "text"}
        id={id}
        required={required}
        value={value}
        placeholder={placeholder ? placeholder : ""}
        onChange={
          onChange /* (e) => onChange(id, e.target.value, e.target.files!) */
        }
        onBlur={onBlur}
      />
    )}
    {control === "textarea" && (
      <textarea
        className={`${valid ? styles.valid : styles.invalid} ${
          touched ? styles.touched : styles.untouched
        }`}
        id={id}
        rows={rows}
        required={required}
        value={value}
        onChange={onChange /* (e) => onChange(id, e.target.value) */}
        onBlur={onBlur}
      />
    )}
  </div>
);

export default input;
