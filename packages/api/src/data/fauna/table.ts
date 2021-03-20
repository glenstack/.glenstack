import { query as q } from 'faunadb';   
import {Query, Queries} from './query' 
import { collection } from './collection';
import { fields } from './fields';

export function table(name: string = ''): any  {

    const rows = collection(name);
    const _fields = fields(name+"_fields",rows.ref);
    const table_to_fields = collection(name+"_to_fields");
    return {
        ...rows,
        fields: _fields,

        create() {
            return Queries([rows.create(), _fields.create(), table_to_fields.create()])
        },
}

}
