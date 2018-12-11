import React, {useState} from 'react';

const SelectField = ({
  className,
  selectedClassName,
  optionClassName,
  style,
  onChange,
  values = [],
  ChildComp,
  idAcc,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelected] = useState(null);

  console.log('values', values);
  const selected = values.find(v => idAcc(v) === selectedId) || null;

  return (
    <div className={`${className} relative z-10`} style={style}>
      <div
        className={`h-full cursor-pointer ${selectedClassName}`}
        tabIndex="-1"
        onClick={() => setVisible(!visible)}
        onBlur={() => setVisible(false)}>
        {selected && <ChildComp {...selected} index="-1" />}
        {!selected && placeholder}
      </div>
      <div
        className="absolute w-full "
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms',
          pointerEvents: !visible && 'none',
        }}>
        <ul className="mt-2 list-reset p-2 z-10 bg-white border border-black shadow">
          {values.map((x, i) => (
            <li
              className={`${optionClassName} ${idAcc(x) === selectedId &&
                'bg-grey'} cursor-pointer`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setSelected(idAcc(x));
                setTimeout(() => setVisible(false), 50);
                onChange(x);
              }}>
              <ChildComp {...x} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SelectField.defaultProps = {
  ChildComp: ({index, ...props}) => <div>{index}</div>,
  placeholder: 'No selection',
  selectedId: null,
  idAcc: d => d.id,
  onChange: d => d,
};

export default SelectField;
