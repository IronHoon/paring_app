import axios from 'axios';
import useSWR, { mutate } from 'swr';

export function fetcher(url: string) {
  return axios.get(url).then((response) => response.data);
}

export function useFetch<ResponseType>(url: string, useLog: boolean = false) {
  return useSWR<ResponseType>(url, fetcher);
}

export function preload(url: string) {
  return mutate(url, fetcher(url));
}
