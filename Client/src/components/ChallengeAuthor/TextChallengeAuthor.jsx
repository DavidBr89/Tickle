import React, {Component, useState, useEfect} from 'react';
import PropTypes from 'prop-types';

import uuidv1 from 'uuid/v1';

import Rating, {StarRating} from 'Components/utils/Rating';

import useMergeState from 'Components/utils/useMergeState';
import useDeepCompareMemoize from 'Components/utils/useMergeState';

const DifficultyRating = ({onChange, highlighted, ...props}) => (
  <Rating {...props} numHighlighted={highlighted} num={6}>
    {(on, i) => (
      <div
        onClick={() => {
          onChange(i);
        }}
        className={`m-1 ${on ? 'bg-black' : 'bg-grey'}`}
        style={{width: 30, height: 30}}
      />
    )}
  </Rating>
);

export default function TextActivityEditor(props) {
  const {
    onChange,
    className,
    placeholder,
    styles,
    onChange,
    title
  } = props;

  const [activity, setActivity] = useMergeState({
    description: '',
    difficulty: 1,
    id: uuidv1(),
    ...props
  });

  useEfect(
    () => {
      console.log('activity change', activity);
      onChange(activity);
    },
    [useDeepCompareMemoize(activity)]
  );

  return (
    <div
      className={`${className} flex flex-col flex-grow w-full h-full`}
      style={{...styles}}>
      <section className="mb-4">
        <h2 className="mb-1">Title</h2>
        <input
          className="form-control w-full"
          placeholder="Title"
          defaultValue={title}
          onChange={e => setActivity({title: e.target.value})}
        />
      </section>
      <section className="mb-4">
        <h2 className="mb-1">Description</h2>
        <textarea
          className="form-control w-full"
          placeholder="Description"
          onChange={e => setActivity({description: e.target.value})}
          defaultValue={activity.description}
          style={{minHeight: 200}}
        />
      </section>
      <section>
        <h2>Difficulty</h2>
        <DifficultyRating
          highlighted={activity.difficulty}
          onChange={df => setActivity({difficulty: df})}
          disabled={false}
        />
      </section>
    </div>
  );
}
