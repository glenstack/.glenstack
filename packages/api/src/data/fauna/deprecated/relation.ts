import { query as q } from 'faunadb';   
import {Query, Queries} from '../query' 
import { collection } from '../collection';

export function relation(name: string = ''): any  {

    const relation_collection = collection(name);
    return {
        ...relation_collection,

    }
}
