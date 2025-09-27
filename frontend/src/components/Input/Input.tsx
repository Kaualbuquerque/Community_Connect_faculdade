import { InputProps } from "@/utils/interfaces";
import styles from "./Input.module.scss";

export default function Input({
    id,
    type,
    label,
    name,
    value,
    placeholder,
    required,
    maxLength,
    minLength,
    checked,
    onChange,
}: InputProps) {

    const renderField = () => {
        switch (type) {
            case "radio":
                return (
                    <div className={styles.radioBox}>
                        <input
                            type="radio"
                            id={id}
                            name={name}
                            value={value}
                            checked={checked}
                            onChange={onChange}
                            required={required}
                        />
                        {label && <label htmlFor={id}>{label}</label>}
                    </div>
                );
                            default:
                return (
                    <>
                        {label && <label htmlFor={id}>{label}</label>}
                        <input
                            type={type}
                            id={id}
                            placeholder={placeholder}
                            name={name}
                            required={required}
                            maxLength={maxLength}
                            minLength={minLength}
                            value={value}
                            onChange={onChange}
                        />
                    </>
                );
        }
    };

    return <div className={styles.input}>{renderField()}</div>;
}
