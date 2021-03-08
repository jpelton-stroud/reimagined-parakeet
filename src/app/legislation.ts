import { Shared } from './shared';

export interface Legislation extends Shared {
  sponsors: {
    date: string;
    name: string;
    identifier: string;
  }[];
}
