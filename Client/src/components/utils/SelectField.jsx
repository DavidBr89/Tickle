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
  accId,
  placeholder
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelected] = useState(null);

  const selected = values; // values.find(v => accId(v) === selectedId) || null;

  // console.log('visible', visible, 'values', values);
  return (
    <div className={`${className} relative `} style={style}>
      <div
        className={`h-full flex flex-grow cursor-pointer ${selectedClassName}`}
        tabIndex="-1"
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}>
        {React.cloneElement(selectedComp, {...selected})}
      </div>
      <div
        className="absolute w-full z-10"
        style={{
          // left: 0,
          // top: 0,
          // opacity: visible && values.length > 0 ? 1 : 0,
          transition: 'opacity 200ms',
          pointerEvents: !visible && 'none',
          display: !visible && 'none'
        }}>
        <ul className="mt-2 list-reset p-2 bg-white border border-black shadow">
          {values.map(x => (
            <li
              className={`${optionClassName} ${accId(x) ===
                selectedId && 'bg-grey'} cursor-pointer `}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setSelected(accId(x));
                setTimeout(() => setVisible(false), 50);
                onChange(x);
              }}>
              <ChildComp {...x} key={accId(x)} />
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
  accId: d => d.id,
  onChange: d => d
};

const InputComp = ({
  className,
  placeholder,
  forwardRef,
  value,
  onChange
}) => (
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
  onInputChange,
  onIdChange,
  ChildComp,
  selectedClassName,
  ...props
}) => {
  const {values, accId, accInputVal} = props;
  const [inputVal, setInputVal] = useState('');
  const [id, setId] = useState(null);

  const inputRef = React.createRef();

  useEffect(
    () => {
      onInputChange(inputVal);
    },
    [inputVal]
  );

  useEffect(
    () => {
      if (id !== null) onIdChange(id);
    },
    [id]
  );

  return (
    <SelectField
      {...props}
      onChange={u => {
        setInputVal(accInputVal(u));
        setId(accId(u));
        inputRef.current.blur();
      }}
      values={values}
      ChildComp={d => <ChildComp {...d} />}
      selectedClassName={selectedClassName}
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
  onInputChange: d => d,
  onIdChange: d => d,
  ChildComp: () => <></>,
  accId: d => d.id,
  accInputVal: d => d.id,
  values: []
};

const FilterInput = ({...props}) => {
  const {values, accId, onChange} = props;
  const [inputVal, setInputVal] = useState('');
  const filteredValues = values.filter(d =>
    accId(d).includes(inputVal)
  );

  return (
    <SelectInput
      {...props}
      values={filteredValues}
      onInputChange={u => {
        setInputVal(u);
        onChange(u);
      }}
    />
  );
};

export const SelectTag = ({
  values,
  className,
  accId,
  inputClassName,
  placeholder,
  btnContent,
  onChange,
  selectedClassName,
  style
}) => {
  const [inputVal, setInputVal] = useState(null);
  const [key, resetKey] = useState(uuidv1());
  return (
    <div key={key} className={`flex ${className}`} style={style}>
      <FilterInput
        className="flex-grow"
        placeholder={placeholder}
        inputClassName={inputClassName}
        selectedClassName={selectedClassName}
        ChildComp={d => <div>{accId(d)}</div>}
        accId={accId}
        values={values}
        onChange={val => setInputVal(val)}
      />
      <button
        className="ml-2 bg-white btn btn-shadow"
        onClick={() => {
          onChange(inputVal);
          resetKey(uuidv1());
        }}>
        <div>{btnContent}</div>
      </button>
    </div>
  );
};

SelectTag.defaultProps = {
  onChange: d => d,
  accId: d => d.id,
  accInputVal: d => d.id,
  placeholder: 'Enter',
  btnContent: 'Add'
};

export default SelectField;
