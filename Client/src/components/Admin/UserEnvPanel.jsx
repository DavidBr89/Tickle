import uuidv1 from 'uuid/v1';

import React, {useState, useEffect} from 'react';

import {Link} from 'react-router-dom';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

const summaryClass = 'mb-3';
const baseLiClass =
  'border cursor-pointer p-2 text-lg flex justify-between items-center';

function UserEnvPanel({
  className,
  createNewUserEnv,
  userEnvs,
  routeUserEnv,
  removeUserEnv,
  title,
  userEnvId
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [envName, setEnvName] = useState('');

  const selectedUserEnv = userEnvs.find(d => d.id === userEnvId) || {};
  const {
    name: userEnvName = null,
    id: selectedUserEnvId = null
  } = selectedUserEnv;

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
        onClick={() => setPanelOpen(!panelOpen)}>
        {`Select User environment ${userEnvName}`}
      </summary>
      <div className="p-2">
        <h3>Create a new User Environment</h3>
        <form
          className="flex justify-between mb-3"
          onSubmit={e => {
            e.preventDefault();
            createNewUserEnv({id: uuidv1(), name: envName});
          }}>
          <input
            className="border-2 text-lg"
            style={{flexGrow: 0.75}}
            value={envName}
            placeholder="Add a card environment for your users"
            onChange={e => setEnvName(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 p-2 border"
            style={{flexGrow: 0.25}}>
            Add
          </button>
        </form>
        <ul className="list-reset">
          {userEnvs.map(d => (
            <li
              onClick={() => routeUserEnv(d.id)}
              className={`${baseLiClass} ${selectedUserEnvId === d.id &&
                'bg-grey'}`}>
              <div>{d.name}</div>
              <MoreIcon
                onClick={e => {
                  e.stopPropagation();
                  removeUserEnv(d);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Generated Link</h3>
        <Link className="link" to={`/${selectedUserEnvId}`}>
          {selectedUserEnvId}
        </Link>
      </div>
    </details>
  );
}

export default UserEnvPanel;
