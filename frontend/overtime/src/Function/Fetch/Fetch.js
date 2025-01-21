import axios from "axios";
import React, { useState } from 'react';

/**
 * Általános fetch funkció axios segítségével
 * @param {string} url        - Az API URL, ahová a kérés irányul.
 * @param {string} method     - A HTTP metódus (GET, POST, PUT, DELETE, stb.).
 * @param {object} data       - Az elküldendő adatok (pl. regisztrációs űrlap).
 * @param {object} headers    - Egyedi HTTP-fejlécek.
 * @returns {Promise}         - Az API válasza vagy egy hiba.
 */
export const useAxiosFetch = () => {
  const [error, setError] = useState(null);

  const fetchData = async (url, method = "GET", data = null, headers = {}) => {
    const token = localStorage.getItem('jwt');
    try {
      const config = {
        url,
        method,
        withCredentials: 'include',
        headers: {
          "Content-Type": "application/json",                     // Alapértelmezett header JSON adatok küldéséhez.
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,                                             // Egyedi headerek hozzáadása.
        },
        data: data || undefined,                                  // Csak akkor ad adatot a kéréshez, ha van mit küldeni.
      };

      const response = await axios(config);
      return response.data;              // API válasz adatainak visszaadása.
    } catch (error) {
      setError(error);
    }
  }
  return { fetchData, error };
}
