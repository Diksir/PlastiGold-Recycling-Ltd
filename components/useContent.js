'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from './api';
import { defaultContent, mergeContent } from './siteData';

export default function useContent(initialContent = defaultContent) {
  const [content, setContent] = useState(() => mergeContent(initialContent));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/api/content?ts=${Date.now()}`, { cache: 'no-store' });
      setContent(mergeContent(data));
    } catch (err) {
      setError(err.message);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return { content, loading, error, loadContent, setContent };
}
