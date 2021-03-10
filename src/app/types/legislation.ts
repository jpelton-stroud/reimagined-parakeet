import { Shared } from './shared';

export interface Legislation extends Shared {
  title: string;
  creator_id: string;
  version: string;
}
