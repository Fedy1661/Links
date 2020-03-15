import React from 'react';
import { Link } from 'react-router-dom';

export default ({ links }) => {
  if (links.length === 0) return <p className="center">Ссылок нет.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Original</th>
          <th>Shorten</th>
          <th>Open</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link, index) => (
          <tr key={link._id}>
            <td>{index + 1}</td>
            <td>{link.from}</td>
            <td>{link.to}</td>
            <td>
              <Link to={`/detail/${link._id}`}>Open</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
