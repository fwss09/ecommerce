import React, { useState } from 'react';

const PhoneInput = ({ value, onChange, placeholder }) => {
  const handleChange = (e) => {
    const phoneValue = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (phoneValue.length > 0) {
      formattedValue = `+38 (${phoneValue.slice(0, 3)}) ${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 8)}-${phoneValue.slice(8, 10)}`;
    }

    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength="18"
    />
  );
};

export default PhoneInput;