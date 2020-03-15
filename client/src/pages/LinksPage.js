import React, { useState, useCallback } from 'react';
import { useHttp } from '../hooks';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { useEffect } from 'react';
import Loader from '../components/Loader';
import LinksList from '../components/LinksList';

export default () => {
  const [links, setLinks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);
  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      setLinks(fetched);
    } catch (e) {}
  }, [token, request]);
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);
  if (loading) return <Loader />;
  console.log(links);
  return <>{!loading && <LinksList links={links} />}</>;
};
