import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import PlusSquare from 'react-feather/dist/icons/plus';
import Trash2 from 'react-feather/dist/icons/trash-2';

import uniqBy from 'lodash/uniqBy';

import {NewTabLink} from '~/components/utils/StyledComps';

import {GIF, TEXT, VIDEO, IMG, URL} from '~/constants/mediaTypes';

const formClass = 'form-control text-lg';
function MediaBtn({selected, onClick, className}) {
  return (
    <div
      className={`btn bg-light-grey ${className}`}
      style={{
        color: selected ? 'tomato' : 'black'
      }}
      onClick={onClick}>
      {selected ? (
        <Trash2 fill="whitesmoke" size={40} />
      ) : (
        <PlusSquare
          className="border-4 border-black"
          fill="whitesmoke"
          size={40}
        />
      )}
    </div>
  );
}

export const MediaSearch = props => {
  const {
    data,
    searchFn,
    defaultQuery,
    onChange,
    Element,
    selectedData
  } = props;
  const [searchResults, setSearchResults] = useState([]);

  const doSearch = q => searchFn(q).then(setSearchResults);

  const removeItem = id =>
    onChange(selectedData.filter(d => d.id !== id));

  const addItem = item => onChange([...selectedData, item]);

  useEffect(() => {
    doSearch(defaultQuery);
  }, []);

  const selectedIds = selectedData.map(d => d.id);

  return (
    <div className="flex flex-col">
      <input
        type="text"
        className={`${formClass} mb-3 w-full`}
        placeholder={`Search...for instance ${defaultQuery}`}
        onChange={evt => doSearch(evt.target.value)}
      />
      <div className="flex-grow overflow-y-scroll">
        {searchResults.map(d => (
          <div className="border p-2 ml-3 flex mb-3">
            <Element {...props} {...d} />
            <div>
              <MediaBtn
                selected={selectedIds.includes(d.id)}
                onClick={e => {
                  e.stopPropagation();
                  selectedIds.includes(d.id)
                    ? removeItem(d.id)
                    : addItem(d);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export const MediaOverview = props => {
  const {data, onChange, className, Element} = props;

  const removeItem = m => {
    const newData = data.filter(d => d.id !== m.id);
    onChange(newData);
  };

  return (
    <div className={`${className} flex flex-col`}>
      {data.length === 0 && (
        <h3 className="text-muted">No media added to this Card!</h3>
      )}
      {data.map(d => (
        <div className="flex-none flex p-3 mb-3 border border-2">
          <Element {...props} {...d} />
          <div className="ml-3">
            <MediaBtn selected onClick={() => removeItem(d)} />
          </div>
        </div>
      ))}
    </div>
  );
};
