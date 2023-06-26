import { atom } from 'jotai';
import { BlockItemType } from '../types';

export const blocksAtom = atom<BlockItemType[]>([]);
