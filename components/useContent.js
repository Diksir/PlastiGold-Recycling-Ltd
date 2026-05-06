'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from './api';
import { defaultContent } from './siteData';

export default function useContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/content');
      setContent({
        hero: data.hero || defaultContent.hero,
        slides: data.slides?.length ? data.slides : defaultContent.slides,
        gallery: data.gallery?.length ? data.gallery : defaultContent.gallery,
      });
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
