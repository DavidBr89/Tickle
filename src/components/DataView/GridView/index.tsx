import React from 'react';

interface IAppProps {
  message: string;
}

export default function({ message }: IAppProps) {
  return (
    <div>
      <h1>Hello {message}</h1>
    </div>
  );
}
