/**
 * Custom hook for fetching properties
 */

import { useState, useEffect } from 'react';
import { propertiesAPI } from '../services/api';

export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters)]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data until backend endpoints are complete
      // TODO: Replace with real API call when backend is ready
      // const data = await propertiesAPI.getAll(filters);
      
      // Temporary: Import mock data
      const { allProperties } = await import('../utils/data');
      setProperties(allProperties);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { properties, loading, error, refetch: fetchProperties };
};

export const useProperty = (id) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with real API call
      // const data = await propertiesAPI.getById(id);
      
      // Temporary: Use mock data
      const { getPropertyById } = await import('../utils/data');
      const data = getPropertyById(parseInt(id));
      
      if (!data) {
        throw new Error('Property not found');
      }
      
      setProperty(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { property, loading, error, refetch: fetchProperty };
};

