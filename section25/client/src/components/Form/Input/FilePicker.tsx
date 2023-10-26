import styles from "./Input.module.css";

interface Props {
  id: string;
  label: string;
  valid: boolean;
  touched: boolean;
  onChange: (id: string, value: string, files: FileList) => void;
  onBlur: () => void;
}

const FilePicker = ({ id, label, valid, touched, onChange, onBlur }: Props) => (
  <div className={styles.input}>
    <label htmlFor={id}>{label}</label>
    <input
      className={`${valid ? styles.valid : styles.invalid} ${
        touched ? styles.touched : styles.untouched
      }`}
      type="file"
      id={id}
      onChange={(e) => onChange(id, e.target.value, e.target.files!)}
      onBlur={onBlur}
    />
  </div>
);

export default FilePicker;