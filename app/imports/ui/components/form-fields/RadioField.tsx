import React from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
/**
 * Augment the Uniforms RadioField with an 'inline' property so that radio buttons all appear on a single line.
 * Adapted from https://github.com/vazco/uniforms/blob/master/packages/uniforms-semantic/src/RadioField.js
 *
 * The MIT License (MIT)

 * Copyright (c) 2016-2019 Vazco

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint react/prop-types: 0 */
const RadioField = ({
  allowedValues,
  checkboxes, // eslint-disable-line no-unused-vars
  className,
  disabled,
  error,
  errorMessage,
  id,
  inline,
  label,
  name,
  onChange,
  required,
  showInlineError,
  transform,
  value,
  ...props
}) => (
  <div className={classnames(className, { disabled, error, inline }, inline ? '' : 'grouped', 'fields')} {...filterDOMProps(props)}>
    {label && (
      <div className={classnames({ required }, 'field')}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>{label}</label>
      </div>
    )}

    {allowedValues.map((item) => (
      <div className="field" key={item}>
        <div className="ui radio checkbox">
          <input checked={item === value} disabled={disabled} id={`${id}-${item}`} name={name} onChange={() => onChange(item)} type="radio" />

          <label htmlFor={`${id}-${item}`}>{transform ? transform(item) : item}</label>
        </div>
      </div>
    ))}

    {!!(error && showInlineError) && <div className="ui red basic pointing label">{errorMessage}</div>}
  </div>
);

export default connectField(RadioField);
