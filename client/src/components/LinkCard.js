import React from 'react';

export default ({ link }) => {
  return (
    <>
      <h2>Ссылка</h2>
      <p>
        Your link:{' '}
        <a href={link.to} target="_blank" rel="noopener noreferrer">
          {link.to}
        </a>
      </p>
      <p>
        From:{' '}
        <a href={link.from} target="_blank" rel="noopener noreferrer">
          {link.from}
        </a>
      </p>
      <p>
        Clicks: <strong>{link.clicks}</strong>
      </p>
      <p>
        Date of create:{' '}
        <strong>{new Date(link.date).toLocaleDateString()}</strong>
      </p>
    </>
  );
};
