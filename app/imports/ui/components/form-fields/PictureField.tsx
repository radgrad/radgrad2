import classnames from 'classnames';
import React, { useState } from 'react';
import { connectField, filterDOMProps } from 'uniforms';
import { TextFieldProps } from 'uniforms-semantic';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import RadGradAlert from '../../utilities/RadGradAlert';

/**
 * Augment the Uniforms TextField with an to support Cloudinary upload for pictures.
 * Adapted from https://github.com/vazco/uniforms/blob/master/packages/uniforms-semantic/src/TextField.tsx
 *
 * The MIT License (MIT)

 Copyright (c) 2016-2019 Vazco

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

const PictureField: React.FC<TextFieldProps> = ({
  autoComplete,
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
  name,
  onChange,
  placeholder,
  readOnly,
  required,
  showInlineError,
  type,
  value,
  wrapClassName,
  ...props
}) => {
  const [pictureURL, setPictureURL] = useState(value);

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      // console.log(cloudinaryResult);
      if (cloudinaryResult.event === 'success') {
        setPictureURL(cloudinaryResult.info.secure_url);
        onChange(cloudinaryResult.info.secure_url);
      }
    } catch (err) {
      RadGradAlert.failure('Failed to Upload Photo', err.statusText, err);
    }
  };

  const handleChange = (event) => {
    // console.log('handleChange', event);
    setPictureURL(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div
      className={classnames(className, { disabled, error, required }, 'field')}
      {...filterDOMProps(props)}
    >
      {label && <label htmlFor={id}>{label} (<button type="button" onClick={handleUpload}>
        Upload
      </button>)</label>}

      <div
        className={classnames(
          'ui',
          wrapClassName,
          { left: iconLeft, icon: icon || iconLeft },
          'input',
        )}
      >
        <input
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={inputRef}
          type={type}
          value={pictureURL ?? ''}
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
};

// eslint-disable-next-line react/default-props-match-prop-types
PictureField.defaultProps = { type: 'text' };

export default connectField(PictureField, { kind: 'leaf' });
