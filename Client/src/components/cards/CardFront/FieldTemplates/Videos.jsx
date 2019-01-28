import React, {useState, useEffect, Component} from 'react';

import {NewTabLink} from 'Components/utils/StyledComps';
import {VIDEOS} from 'Src/constants/cardFields';
import {ModalBody} from 'Components/utils/Modal';

import TabSwitcher from 'Src/components/utils/TabSwitcher';

import PreviewFrame from './PreviewFrame';

import {MediaSearch, MediaOverview} from './MediaSearch';

const YOUTUBE = 'youtube';

const youtubeUrl = ({part, q, type, maxResults, order}) =>
  `https://www.googleapis.com/youtube/v3/search?part=${part}&q=${q}&type=${type}&maxResult=${maxResults}&order=${order}&key=${
    process.env.youtube
  }`;

const searchYoutube = (q = '') =>
  new Promise(resolve =>
    fetch(
      youtubeUrl({
        part: 'snippet',
        q,
        type: 'video',
        maxResults: 20,
        order: 'viewCount'
        // publishedAfter: '2015-01-01T00:00:00Z'
      })
    )
      .then(res => res.json())
      .then(({items}) => {
        const res = items.map(d => ({
          // url2: `http://www.youtube.com/embed/${d.id.videoId}`,
          url: `https://www.youtube.com/watch?v=${d.id.videoId}`,
          id: d.id.videoId,
          title: d.snippet.title,
          descr: d.snippet.description,
          thumbnail: d.snippet.thumbnails.medium.url,
          source: YOUTUBE,
          type: VIDEOS
        }));
        resolve(res);
      })
  );

const VideoPreview = ({thumbnail, title, descr, url, onClick}) => (
  <div className="overflow-hidden w-full" onClick={onClick}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <h2 className="truncate-text mb-2">
        <NewTabLink href={url}>{title}</NewTabLink>
      </h2>
    </div>
    <img
      className="overflow-hidden w-full h-full"
      onClick={onClick}
      src={thumbnail}
      style={{objectFit: 'cover'}}
    />
  </div>
);

export const key = VIDEOS;
export const label = 'Videos';

export const ModalContent = props => {
  const {videos, onChange, modalProps} = props;
  const [tabIndex, setTabIndex] = useState(0);

  const btnClassName = i =>
    `btn flex-grow text-lg border m-1 ${tabIndex === i &&
      'btn-active'}`;
  const updateData = vds => onChange({key, label, value: vds});

  const selectedData = videos.value || [];

  return (
    <ModalBody {...modalProps} className="flex flex-col">
      <div className="flex flex-no-shrink">
        <button
          type="button"
          className={btnClassName(0)}
          onClick={() => setTabIndex(0)}>
          Search
        </button>
        <button
          type="button"
          className={btnClassName(1)}
          onClick={() => setTabIndex(1)}>
          Overview
        </button>
      </div>
      <TabSwitcher
        visibleIndex={tabIndex}
        className="flex flex-col"
        tabClassName="flex flex-col">
        <div className="flex-grow flex flex-col">
          <MediaSearch
            {...props}
            selectedData={selectedData}
            onChange={updateData}
            searchFn={searchYoutube}
            Element={VideoPreview}
          />
        </div>
        <MediaOverview
          {...props}
          onChange={updateData}
          data={selectedData}
          Element={VideoPreview}
          placeholder="No Video added!"
        />
      </TabSwitcher>
    </ModalBody>
  );
};

export const Preview = ({onClick, videos}) => {
  const numVideos = videos.value !== null ? videos.value.length : 0;
  const text = () => `${numVideos} Video${numVideos > 1 ? 's' : ''}`;

  return (
    <PreviewFrame
      onClick={onClick}
      empty={videos.value === null || videos.value.length === 0}
      type="Video"
      placeholder="No Video"
      content={() => text}
    />
  );
};
