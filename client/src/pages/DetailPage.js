import React, { useContext } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks';
import { AuthContext } from '../context';
import { useEffect, useCallback } from 'react';
import Loader from '../components/Loader';
import LinkCard from '../components/LinkCard';

export default () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [link, setLink] = useState(null);
  const linkId = useParams().id;

  const getLink = useCallback(async () => {
    try {
      const data = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      setLink(data);
    } catch (e) {}
  }, [token, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);
  if (loading) return <Loader />;
  return <>{!loading && link && <LinkCard link={link} />}</>;
};
