import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import mbxGeoCoding from '@mapbox/mapbox-sdk/services/geocoding';

import {SelectInput} from 'Components/utils/SelectField';

const directionService = mbxGeoCoding({
  accessToken: process.env.MapboxAccessToken
});

const SelectPlace = ({onChange, className, ...props}) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(
    () => {
      directionService
        .forwardGeocode({
          query,
          limit: 5
        })
        .send()
        .then(response => {
          const match = response.body;
          if (match.features) setMatches(match.features);
          console.log('match', match);
        });
    },
    [query]
  );

  return (
    <SelectInput
      className={className}
      values={matches}
      onInputChange={t => setQuery(t)}
      onIdChange={id => {
        const m = matches.find(d => d.id === id);
        onChange(m);
      }}
      accId={d => d.id}
      accInputVal={d => d.place_name}
      ChildComp={d => <div>{d.place_name}</div>}
    />
  );
};

export default function GoToPlace({onChange, className, ...props}) {
  const [loc, setLoc] = useState({longitude: 0, latitude: 0});

  return (
    <form
      className={`flex ${className}`}
      onSubmit={e => {
        e.preventDefault();
        onChange(loc);
      }}>
      <SelectPlace
        className=""
        {...props}
        onChange={place =>
          onChange({
            longitude: place.center[0],
            latitude: place.center[1]
          })
        }
      />
      <button type="submit" className="btn btn-black">
        Go
      </button>
    </form>
  );
}
