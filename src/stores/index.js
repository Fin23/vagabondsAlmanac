import * as _ from 'lodash';
import { writable } from 'svelte/store';
import { supabase } from '../supabase';
export const testVariable = writable(false);

export const supaCharacter = writable([]);
// export const mapInfo:any = writable(mapData);
// import mapData from './mapData.json';
const { data, error } = await supabase.from('character').select('name');

console.log('data == ', await data);
export const loadCharacter = async () => {
	supaCharacter.set(data);
	// if (error) {
	// 	return console.error(error);
	// }
};
loadCharacter();
