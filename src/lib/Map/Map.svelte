<script>
	// import * as _ from 'lodash';
	// import { session } from '$app/stores';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	// import image1 from '../../../static/images/cities/fullMap.jpg';
	// import { mapInfo } from '../../stores/index';
	// import image2 from '../../../static/favicon.png';

	const DEFAULT_ZOOM = 5;
	const DEFAULT_LNG = 37.015;
	const DEFAULT_LAT = 39.7505;
	const CONTAINER_ID = 'directory-map';
	// const MAPBOX_KEY =
	// 	pk.eyJ1Ijoicm9zY28yMzQyIiwiYSI6ImNsMm00ZWp3ZDB0eHMza214emhsZnpoem8ifQ.HWX6QvBKVAqQcPa8MCM7gQ;
	const geojson = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [37.015, 39.7505]
				},
				properties: {
					title: 'Mapbox',
					description: 'Kisbee.'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [36.336, 41.2797]
				},
				properties: {
					title: 'Mapbox',
					description: 'Tyr'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [36.1756, 36.5847]
				},
				properties: {
					title: 'Mapbox',
					description: 'Ank.'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [35.482, 38.7205]
				},
				properties: {
					title: 'Mapbox',
					description: 'Bedlum.'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [29.2842, 40.6549]
				},
				properties: {
					title: 'Mapbox',
					description: 'An-kara.'
				}
			}
		]
	};

	// 41.2797° N, 36.3361° E
	export let mapData = [];
	let mapPoints = $mapInfo;

	// const coord = mapPoints[0].geometry.coordinates;

	// const lng = coord[0];
	// const lat = coord[1];

	// console.log('map points == ', coord, lng, lat);
	let map;
	let innerWidth;
	let show = false;

	let click = () => {
		show = !show;
	};

	// $: NEEDJSON = {
	// 	type: 'FeatureCollection',
	// 	features: _.map(
	// 		_.filter(mapData, (s) => {
	// 			const lon = parseFloat(_.get(s, 'location.geometry.coordinates.0'));
	// 			const lat = parseFloat(_.get(s, 'location.geometry.coordinates.1'));

	// 			return lat && lon && lon >= -170 && lon <= -60 && lat >= 20 && lat <= 80;
	// 		}),
	// 		'location'
	// 	)
	// };

	// $: {
	// 	if (map && innerWidth) {
	// 		fitMapBounds();
	// 	}
	// }

	// function fitMapBounds() {
	// 	if (map) {
	// 		map.getBounds();
	// 		let bounds = NEEDJSON?.features.reduce(function (bounds, feature) {
	// 			if (!Array.isArray(feature.geometry.coordinates[0])) {
	// 				return bounds.extend(feature.geometry.coordinates);
	// 			} else {
	// 				return feature.geometry.coordinates.reduce(function (bounds, coord) {
	// 					return bounds.extend(coord);
	// 				}, bounds);
	// 			}
	// 		}, new mapboxgl.LngLatBounds());
	// 		map.fitBounds(bounds, {
	// 			maxZoom: 12,
	// 			padding: 30
	// 		});
	// 	}
	// }

	// $session.MAPBOX_KEY
	// center: [DEFAULT_LNG, DEFAULT_LAT],
	// 		zoom: DEFAULT_LAT

	onMount(async () => {
		mapboxgl.accessToken =
			'pk.eyJ1Ijoicm9zY28yMzQyIiwiYSI6ImNsMm00ZWp3ZDB0eHMza214emhsZnpoem8ifQ.HWX6QvBKVAqQcPa8MCM7gQ';
		map = new mapboxgl.Map({
			container: CONTAINER_ID,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [37.015, 39.7505],
			zoom: 4.5
		});

		map.on('load', async () => {
			console.log('map data == ', mapData);
			// add markers to map
			// Add a GeoJSON source with 3 points.
			map.addSource('points', {
				type: 'geojson',
				data: geojson
			});

			// map.addSource('points', {
			// 	type: 'geojson',
			// 	data: {
			// 		type: 'FeatureCollection',
			// 		features: [
			// 			{
			// 				type: 'Feature',
			// 				properties: {},
			// 				geometry: {
			// 					type: 'Point',
			// 					coordinates: [-91.3952, -0.9145]
			// 				}
			// 			},
			// 			{
			// 				type: 'Feature',
			// 				properties: {},
			// 				geometry: {
			// 					type: 'Point',
			// 					coordinates: [-90.3295, -0.6344]
			// 				}
			// 			},
			// 			{
			// 				type: 'Feature',
			// 				properties: {},
			// 				geometry: {
			// 					type: 'Point',
			// 					coordinates: [-91.3403, 0.0164]
			// 				}
			// 			}
			// 		]
			// 	}
			// });
			// /////////////////////////////////////////
			// Add a circle layer
			map.addLayer({
				id: 'circle',
				type: 'circle',
				source: 'points',
				paint: {
					'circle-color': '#4264fb',
					'circle-radius': 8,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#ffffff'
				}
			});
			//////////////////////////////////////
			// Center the map on the coordinates of any clicked circle from the 'circle' layer.
			map.on('click', 'circle', (e) => {
				map.flyTo({
					center: e.features[0].geometry.coordinates
				});
				console.log('e == ', e);
				// If the user clicked on one of your markers, get its information.
				const features = map.queryRenderedFeatures(e.point, {
					layers: ['circle'] // replace with your layer name
				});
				if (!features.length) {
					return;
				}
				const feature = features[0];
				console.log('feature == ', feature);
				const popup = new mapboxgl.Popup({ offset: [0, -15] })
					.setLngLat(feature.geometry.coordinates)
					.setHTML(`<p>${feature.properties.description}</p>`)
					.addTo(map);
			});

			// Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
			map.on('mouseenter', 'circle', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			// Change it back to a pointer when it leaves.
			map.on('mouseleave', 'circle', () => {
				map.getCanvas().style.cursor = '';
			});
		});
	});
</script>

<svelte:window bind:innerWidth />
<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<div class="flex flex-col justify-center">
	<div id={CONTAINER_ID} style="height:600px; width:80%;" class="self-center" />
	<span>
		<button on:click={click} class="bg-blue-500 p-4 rounded h-18 w-20 ">show map</button>
	</span>
	{#if show}
		<div>
			<img src={image1} alt="" />
		</div>
	{/if}
</div>

<style language="postcss">
</style>
