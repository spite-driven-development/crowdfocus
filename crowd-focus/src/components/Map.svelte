<script lang="ts">
	import { MAPSTORE_CONTEXT_KEY, type MapStore } from '$lib/stores';
	import maplibregl from 'maplibre-gl';
	import { PMTiles, Protocol } from 'pmtiles';
	import { onMount, onDestroy, getContext, untrack } from 'svelte';

	let protocol;
	let mapFile;

	let { mapStyle } = $props();

	let mapStore: MapStore = getContext(MAPSTORE_CONTEXT_KEY);

	let mapContainer: HTMLDivElement | undefined = $state();

	onMount(() => {
		protocol = new Protocol();
		maplibregl.addProtocol('pmtiles', protocol.tile);
		mapFile = new PMTiles('/boston.pmtiles');
		protocol.add(mapFile);
	});

	onDestroy(() => {
		if (protocol) {
			maplibregl.removeProtocol('pmtiles');
		}
	});

	$effect(() => {
		untrack(() => {
			if (!mapContainer || !mapFile || !mapStyle.layers) return;
			const map = new maplibregl.Map({
				container: mapContainer,
				maxBounds: [
					[-71.191247, 42.227911],
					[-70.648072, 42.450118]
				],
				style: {
					version: 8,
					sources: {
						openmaptiles: {
							type: 'vector',
							tiles: ['pmtiles://' + mapFile.source.getKey() + '/{z}/{x}/{y}']
						}
					},
					zoom: 12,
					center: [-71.08936258403622, 42.3181973483706],
					layers: mapStyle.layers,
					glyphs: 'https://m-clare.github.io/map-glyphs/fonts/{fontstack}/{range}.pbf'
				}
			});
			console.log(map);
			mapStore?.set(map);
		});
	});
</script>

<link rel="stylesheet" type="text/css" href="npm:maplibre-gl@4.0.2/dist/maplibre-gl.css" />

<div style="position: relative; width: 500px; height: 500px;">
	<div class="map" data-testid="map" bind:this={mapContainer}></div>
</div>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 1;
	}
</style>
