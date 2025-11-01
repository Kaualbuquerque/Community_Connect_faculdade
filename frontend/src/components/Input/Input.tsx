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
    options,
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

            case "textarea":
                return (
                    <>
                        {label && <label htmlFor={id}>{label}</label>}
                        <textarea
                            id={id}
                            name={name}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            required={required}
                            value={value}
                            onChange={onChange}
                        />
                    </>
                );

            case "select":
                return (
                    <>
                        {label && <label htmlFor={id}>{label}</label>}
                        <select
                            id={id}
                            name={name}
                            required={required}
                            value={value}
                            onChange={onChange}
                        >
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                            {options?.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </>
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
