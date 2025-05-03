export async function load({ fetch }) {
	const response = await fetch('/maptiler-3d-gl-style.json');
	const mapStyle = await response.json();
	return { mapStyle };
}
