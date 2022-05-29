import { writable } from 'svelte/store';
// import {supabase} from "../supabase.js";


export const spells = writable([]);

const fetchSpells = async () => {
	// await supabase.from('character').select()
	const url = `https://www.dnd5eapi.co/api/spells`;
	const res = await fetch(url);
	const data = await res.json();
	const loadedSpells = data.results.map((data, index) => {
		return {
			name: data.name,
			id: index + 1,
			url: data.url,
			index: data.index
		};
	});
	spells.set(loadedSpells);
	// console.log('store spell = ', spells);
};
fetchSpells();
