import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { OptionItem } from "./option";
import { Arrow } from "../svg";
import "./style.scss";

export interface ISelectOption {
  value: string;
  label: string;
}

interface IProps {
  options: ISelectOption[];
  className: string;
  label: string;
  isValid: boolean;
  name: string;
  value?: string;
  isTouched?: boolean;
  error?: string;
  setFieldValue: (field: string, value: string) => void;
}

export const CustomSelect = (props: IProps) => {
  const {
    options,
    className,
    label,
    name,
    value,
    isTouched,
    isValid,
    error,
    setFieldValue,
  } = props;

  const selectRef = useRef<HTMLDivElement>(null);

  const [isOptionsOpen, setOptionsOpen] = useState(false);

  const isInvalid = useMemo(() => !isValid && isTouched, [isValid, isTouched]);

  const currentValue = useMemo(
    () => options.find((item) => item.value === value)?.label || "",
    [value, options]
  );

  const labelClasses = useMemo(
    () =>
      `select__label ${isInvalid && "select__label--error"} ${
        (isOptionsOpen || currentValue) && "select__label--top"
      }`,
    [isInvalid, isOptionsOpen, currentValue]
  );

  const selectButtonClasses = useMemo(
    () => `select__btn ${isOptionsOpen && "select__btn--active"}`,
    [isOptionsOpen]
  );

  const rotateAngle = useMemo(() => (isOptionsOpen ? 180 : 0), [isOptionsOpen]);

  const toggleOptions = useCallback(() => setOptionsOpen(!isOptionsOpen), [
    setOptionsOpen,
    isOptionsOpen,
  ]);

  const selectOption = useCallback(
    (value) => () => {
      setOptionsOpen(false);
      setFieldValue(name, value);
    },
    [setOptionsOpen, setFieldValue, name]
  );

  const outsideEvtListener = useCallback(
    (e: any) => {
      if (
        e.target === selectRef.current ||
        selectRef?.current?.contains(e!.target)
      ) {
        return;
      }
      setOptionsOpen(false);
    },
    [selectRef, setOptionsOpen]
  );

  const unsubscribeEvent = useCallback(() => {
    document.removeEventListener("click", outsideEvtListener);
  }, [outsideEvtListener]);

  useEffect(() => {
    document.addEventListener("click", outsideEvtListener);
    return unsubscribeEvent;
  }, [outsideEvtListener, unsubscribeEvent]);

  return (
    <div className={`${className} select`} ref={selectRef}>
      <button
        className={selectButtonClasses}
        type="button"
        onClick={toggleOptions}
      >
        <span>{currentValue}</span>
        <Arrow className="select__icon" rotate={rotateAngle} />
      </button>
      {isOptionsOpen && (
        <ul className="select__option-list list">
          {options.map((item) => (
            <OptionItem
              selectHandler={selectOption(item.value)}
              key={item.value}
              label={item.label}
            />
          ))}
        </ul>
      )}

      <span className={labelClasses}>{label}</span>
      {isInvalid && <div className="select__error">{error}</div>}
    </div>
  );
};
