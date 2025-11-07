import PocketBase from 'pocketbase';
import type { TypedPocketBase } from "./pocketbase-types";
import { getPocketBaseUrl } from './pocketbase-config';

const pb = new PocketBase(getPocketBaseUrl()) as TypedPocketBase;

export default pb;