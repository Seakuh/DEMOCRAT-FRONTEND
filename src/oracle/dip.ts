import { DipResponse } from '../types';

const DIP_BASE_URL = import.meta.env.VITE_DIP_BASE_URL || '/dip';
const DIP_API_KEY = import.meta.env.VITE_DIP_API_KEY;

export async function fetchGesetzentwuerfe(params?: { cursor?: string }): Promise<DipResponse> {
  const url = new URL(`${DIP_BASE_URL}/drucksache`);
  url.searchParams.set('f.drucksachetyp', 'Gesetzentwurf');
  url.searchParams.set('f.zuordnung', 'BT');

  if (params?.cursor) {
    url.searchParams.set('cursor', params.cursor);
  }

  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (DIP_API_KEY && !DIP_BASE_URL.startsWith('/')) {
    headers['Authorization'] = `ApiKey ${DIP_API_KEY}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(`DIP API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
