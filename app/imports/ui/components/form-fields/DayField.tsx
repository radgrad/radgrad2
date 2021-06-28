import classnames from 'classnames';
import React, { Ref } from 'react';
import { HTMLFieldProps, connectField, filterDOMProps } from 'uniforms';

/* istanbul ignore next */
const DateConstructor = (typeof global === 'object' ? global : window).Date;
const dateFormat = (value?: Date) => value?.toISOString().slice(0, -14);

export type DayFieldProps = HTMLFieldProps<
Date,
HTMLDivElement,
{
  icon?: string;
  iconLeft?: string;
  iconProps?: Record<string, any>;
  inputRef?: Ref<HTMLInputElement>;
  max?: Date;
  min?: Date;
  wrapClassName?: string;
}
>;

function Day({
  className,
  disabled,
  error,
  errorMessage,
  icon,
  iconLeft,
  iconProps,
  id,
  inputRef,
  label,
  max,
  min,
  name,
  onChange,
  placeholder,
  readOnly,
  required,
  showInlineError,
  value,
  wrapClassName,
  ...props
}: DayFieldProps) {
  return (
    <div
      className={classnames(className, { disabled, error, required }, 'field')}
      {...filterDOMProps(props)}
    >
      {label && <label htmlFor={id}>{label}</label>}

      <div
        className={classnames(
          'ui',
          wrapClassName,
          { left: iconLeft, icon: icon || iconLeft },
          'input',
        )}
      >
        <input
          disabled={disabled}
          id={id}
          max={dateFormat(max)}
          min={dateFormat(min)}
          name={name}
          onChange={event => {
            const date = new DateConstructor(event.target.valueAsNumber);
            if (date.getFullYear() < 10000) {
              onChange(date);
            } else if (isNaN(event.target.valueAsNumber)) {
              onChange(undefined);
            }
          }}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={inputRef}
          type="date"
          value={dateFormat(value) ?? ''}
        />

        {(icon || iconLeft) && (
          <i className={`${icon || iconLeft} icon`} {...iconProps} />
        )}
      </div>

      {!!(error && showInlineError) && (
        <div className="ui red basic pointing label">{errorMessage}</div>
      )}
    </div>
  );
}

export default connectField<DayFieldProps>(Day, { kind: 'leaf' });
