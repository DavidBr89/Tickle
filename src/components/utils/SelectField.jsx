import React, {useState, useEffect} from 'react';

import uuidv1 from 'uuid/v1';

const SelectField = ({
  className,
  selectedClassName,
  optionClassName,
  style,
  onChange,
  values = [],
  ChildComp,
  selectedComp,
  idAcc,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelected] = useState(null);

  const selected = values.find(v => idAcc(v) === selectedId) || null;

  return (
    <div className={`${className} relative z-10`} style={style}>
      <div
        className={`h-full cursor-pointer ${selectedClassName}`}
        tabIndex="-1"
        onClick={() => setVisible(!visible)}
        onBlur={() => setVisible(false)}>
        {React.cloneElement(selectedComp, {...selected})}
      </div>
      <div
        className="absolute w-full "
        style={{
          opacity: visible && values.length > 0 ? 1 : 0,
          transition: 'opacity 200ms',
          pointerEvents: !visible && 'none',
        }}>
        <ul className="mt-2 list-reset p-2 z-10 bg-white border border-black shadow">
          {values.map(x => (
            <li
              className={`${optionClassName} ${idAcc(x) === selectedId &&
                'bg-grey'} cursor-pointer`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setSelected(idAcc(x));
                setTimeout(() => setVisible(false), 50);
                onChange(x);
              }}>
              <ChildComp {...x} key={idAcc(x)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SelectField.defaultProps = {
  ChildComp: ({index}) => <div>{index}</div>,
  selectedComp: () => <div>selectedComp</div>,
  placeholder: 'No selection',
  selectedId: null,
  idAcc: d => d.id,
  onChange: d => d,
};

const InputComp = ({className, placeholder, forwardRef, value, onChange}) => (
  <input
    className={className}
    ref={forwardRef}
    value={value}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
  />
);

export const SelectInput = ({
  inputClassName,
  placeholder,
  onChange,
  ...props
}) => {
  const {values, idAcc} = props;
  const [inputVal, setInputVal] = useState('');
  const filteredValues = values.filter(d => idAcc(d).includes(inputVal));

  // TODO: solve focus issue
  const inputRef = React.createRef();
  useEffect(
    () => {
      onChange(inputVal);
    },
    [inputVal],
  );

  return (
    <SelectField
      {...props}
      onChange={u => setInputVal(idAcc(u))}
      values={filteredValues}
      ChildComp={d => <li>{idAcc(d)}</li>}
      selectedComp={
        <InputComp
          className={inputClassName}
          forwardRef={inputRef}
          value={inputVal}
          placeholder={placeholder}
          onChange={val => setInputVal(val)}
        />
      }
    />
  );
};

SelectInput.defaultProps = {
  onChange: d => d,
};

export const SelectTag = ({values, onChange}) => {
  const [inputVal, setInputVal] = useState(null);
  const [key, resetKey] = useState(uuidv1());
  return (
    <div key={key} className="flex">
      <SelectInput
        placeholder="Select Interests"
        className="form-control border-2 shadow border-black p-1"
        inputClassName=""
        style={{flex: 0.75}}
        idAcc={d => d.id}
        values={values}
        onChange={val => setInputVal(val)}
      />
      <button
        className="ml-auto bg-white btn btn-shadow"
        onClick={() => {
          onChange(inputVal);
          resetKey(uuidv1());
        }}>
        Add Tag
      </button>
    </div>
  );
};

SelectTag.defaultProps = {onChange: d => d};

export default SelectField;
