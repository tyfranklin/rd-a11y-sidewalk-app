var Progress = Progress || {};
var polyToBullshit = function(square) {
	var final = "POLYGON((";
	for (var i = 0; i < square.length; i++) {
		var f = square[i]
		final = final.concat(f[0], " ", f[1], ", ")
	}
	return final.slice(0, -2).concat("))");
}
var angleTo = function(pa, pb) {
	return Math.atan((pb[1] - pa[1])/(pb[0] - pa[0])); // Returns in radians
}
var distance = function(pa, pb) {
	// Euclidean distance
	return Math.abs(Math.sqrt(Math.pow(pb[1]-pa[1], 2)+Math.pow(pb[0]-pa[0], 2)));
}
Progress.streets = (function Streets($, L) {
	var self = {};
	function _init() {
		// Styling: http://leafletjs.com/examples/geojson.html
		// http://leafletjs.com/reference.html#path-dasharray
		// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
		function onEachFeature(feature, layer) {
			layer.bindPopup("<div id=\"feature-".concat(feature.properties.id, "\" class=\"FeaturePopup\">Loading...</div>"));
			$(layer).click(function() {
				load(feature.properties.id, feature.geometry.type, null);
			});
		}
		// Because javascript is so bad, these have to be predefined, you can't just add "var " to the declarations below or it will define them in a local scope and they won't be accessible from the zoomend hook.
		var streetmap = "test";
			var data = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.992643,38.896119],[-76.9915025,38.89611775],[-76.991,38.896115],[-76.990142,38.8961165],[-76.989296,38.896116],[-76.988525,38.896112],[-76.988309,38.896115]]},"properties":{"street_edge_id":462769130,"source":49777919,"target":49777944,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.982212,38.894779],[-76.982211,38.895466]]},"properties":{"street_edge_id":12715781,"source":49763138,"target":49765730,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.982212,38.894779],[-76.982211,38.895466]]},"properties":{"street_edge_id":12715781,"source":49763138,"target":49765730,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.985508,38.896115],[-76.985508,38.896722]]},"properties":{"street_edge_id":761607599,"source":49739593,"target":49739596,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.99024,38.899553],[-76.989465,38.899549],[-76.988305,38.89955]]},"properties":{"street_edge_id":6055973,"source":49777013,"target":49777019,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.985306,38.901824],[-76.984565,38.901508]]},"properties":{"street_edge_id":927673412,"source":49793217,"target":49816414,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9984558,38.8938525],[-76.99834125,38.8939928],[-76.9981739,38.8940752],[-76.997695,38.8942731],[-76.99666945,38.8946917],[-76.9964463,38.8947826]]},"properties":{"street_edge_id":1158366543,"source":1449347671,"target":1824556145,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.980762,38.896667],[-76.980757,38.896302],[-76.980712,38.896111]]},"properties":{"street_edge_id":130889753,"source":49765968,"target":49765949,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.979068,38.900211],[-76.9774934,38.9002054],[-76.976219,38.9002009],[-76.975698,38.900199],[-76.9751877,38.9001971],[-76.9746841,38.9001953],[-76.9741738,38.9001935],[-76.9737804,38.9001918],[-76.9735388,38.9001907],[-76.973153,38.900189],[-76.9728173,38.9001875],[-76.972479,38.900186]]},"properties":{"street_edge_id":6055691,"source":49766002,"target":49781593,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9836428,38.8988399],[-76.9836405,38.8992704],[-76.983634,38.899652],[-76.9836205,38.8998545],[-76.983547,38.9000876]]},"properties":{"street_edge_id":771495824,"source":49756572,"target":1484481416,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-77.002036,38.901327],[-77.000632475,38.9013241],[-77.0004389,38.901324],[-76.999476725,38.901324],[-76.9984258,38.90132405],[-76.996140975,38.901327875],[-76.9949333,38.90132595],[-76.993736425,38.901324],[-76.9926281,38.901322],[-76.991512125,38.90132],[-76.990244,38.901318],[-76.98831,38.90132]]},"properties":{"street_edge_id":1503110408,"source":49790024,"target":49790041,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-77.002036,38.901327],[-77.000632475,38.9013241],[-77.0004389,38.901324],[-76.999476725,38.901324],[-76.9984258,38.90132405],[-76.996140975,38.901327875],[-76.9949333,38.90132595],[-76.993736425,38.901324],[-76.9926281,38.901322],[-76.991512125,38.90132],[-76.990244,38.901318],[-76.98831,38.90132]]},"properties":{"street_edge_id":1503110408,"source":49790024,"target":49790041,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9793027,38.8993404],[-76.9785135,38.8992132],[-76.9775414,38.8990327],[-76.9764843,38.8988395],[-76.9759466,38.8987476],[-76.9755027,38.8986652],[-76.9741761,38.8984419],[-76.9730704,38.8982478],[-76.9721851,38.8980912],[-76.9712702,38.8979263],[-76.9704358,38.8977853],[-76.969505,38.897632],[-76.968993,38.8975756],[-76.9678584,38.8974837],[-76.9658563,38.8973253]]},"properties":{"street_edge_id":567006158,"source":1484481512,"target":1484481958,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-77.0035135,38.8989151],[-77.00197245,38.89891295],[-77.000552775,38.898911975],[-76.999494325,38.898911025],[-76.9984316,38.89891095],[-76.99615035,38.898908025],[-76.99493105,38.8989081],[-76.994353,38.898909],[-76.99372295,38.898908275],[-76.99270565,38.89890705],[-76.9925228,38.8989071],[-76.9915159,38.898907925],[-76.990243,38.898907],[-76.9882938,38.8989153]]},"properties":{"street_edge_id":1129007100,"source":49756492,"target":49756549,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.982214,38.896117],[-76.982214,38.896664]]},"properties":{"street_edge_id":101377790,"source":49777969,"target":49794274,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.983966,38.897329],[-76.983647,38.897326]]},"properties":{"street_edge_id":2138515536,"source":49794264,"target":49758250,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.983966,38.897329],[-76.983647,38.897326]]},"properties":{"street_edge_id":2138515536,"source":49794264,"target":49758250,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.981991,38.898021],[-76.98186,38.898494]]},"properties":{"street_edge_id":1878764482,"source":49836899,"target":49836903,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.981991,38.898021],[-76.98186,38.898494]]},"properties":{"street_edge_id":1878764482,"source":49836899,"target":49836903,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.988311,38.894785],[-76.98831,38.894191],[-76.9883113437,38.8935782188],[-76.988314,38.89312],[-76.988316,38.89297],[-76.988312,38.892819],[-76.988299,38.892571]]},"properties":{"street_edge_id":1441201575,"source":49763125,"target":49738311,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9814626,38.8998697],[-76.9799445,38.8996067],[-76.9792672,38.8994773]]},"properties":{"street_edge_id":1409131342,"source":49769580,"target":49765997,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.980762,38.895471],[-76.9807605,38.895955],[-76.980712,38.896111]]},"properties":{"street_edge_id":2064140317,"source":49765735,"target":49765949,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.978999,38.8932331],[-76.9789936,38.8933751],[-76.978992,38.893663],[-76.978994,38.893981],[-76.978994,38.894295],[-76.978997,38.894603],[-76.978995,38.894778]]},"properties":{"street_edge_id":1000333616,"source":705647738,"target":49763149,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9883014,38.898094],[-76.988301,38.8981763]]},"properties":{"street_edge_id":606931274,"source":1124063647,"target":49788050,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.979494,38.898723],[-76.979112,38.898651],[-76.978635,38.898568],[-76.9777215,38.8984108]]},"properties":{"street_edge_id":6057334,"source":49765992,"target":49795789,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.979871,38.894779],[-76.97987,38.894267],[-76.979872,38.89393],[-76.979868,38.8933793]]},"properties":{"street_edge_id":56228626,"source":49763147,"target":705647635,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.987503,38.898921],[-76.987047,38.8986943]]},"properties":{"street_edge_id":1114595860,"source":49738304,"target":49738294,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.987503,38.898921],[-76.987047,38.8986943]]},"properties":{"street_edge_id":1114595860,"source":49738304,"target":49738294,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.987503,38.898921],[-76.987047,38.8986943]]},"properties":{"street_edge_id":1114595860,"source":49738304,"target":49738294,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9815011,38.8997358],[-76.9814626,38.8998697]]},"properties":{"street_edge_id":1309243187,"source":1484481543,"target":49769580,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.983648,38.894783],[-76.983646,38.894433],[-76.98364775,38.8935675],[-76.983644,38.893081],[-76.983646,38.892652],[-76.9836416,38.8924574]]},"properties":{"street_edge_id":485048220,"source":49758306,"target":49758293,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9795809,38.8984231],[-76.979494,38.898723]]},"properties":{"street_edge_id":654793788,"source":1596649017,"target":49765992,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9795809,38.8984231],[-76.979494,38.898723]]},"properties":{"street_edge_id":654793788,"source":1596649017,"target":49765992,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.983644,38.896667],[-76.982488,38.896665],[-76.982214,38.896664]]},"properties":{"street_edge_id":240619277,"source":49758244,"target":49794274,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.982214,38.896664],[-76.980762,38.896667]]},"properties":{"street_edge_id":432889613,"source":49794274,"target":49765968,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.988308,38.900201],[-76.987143,38.9001993],[-76.9861497,38.9001979],[-76.985504,38.900197]]},"properties":{"street_edge_id":1045503343,"source":49774098,"target":49739609,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.988308,38.900201],[-76.987143,38.9001993],[-76.9861497,38.9001979],[-76.985504,38.900197]]},"properties":{"street_edge_id":1045503343,"source":49774098,"target":49739609,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.988301,38.8981763],[-76.987047,38.8986943]]},"properties":{"street_edge_id":1370141664,"source":49788050,"target":49738294,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.984574,38.897334],[-76.983966,38.897329]]},"properties":{"street_edge_id":1566121641,"source":49794262,"target":49794264,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.988306,38.897333],[-76.9883014,38.898094]]},"properties":{"street_edge_id":1768501521,"source":49794253,"target":1124063647,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9855046,38.899248],[-76.985504,38.898908]]},"properties":{"street_edge_id":1294345418,"source":212276693,"target":49739600,"way_type":"tertiary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.978995,38.894778],[-76.978123,38.894778],[-76.97768,38.894775],[-76.977306,38.8947765],[-76.976218,38.894778],[-76.97497,38.8947795],[-76.974597,38.894775],[-76.974408,38.89473]]},"properties":{"street_edge_id":1832193721,"source":49763149,"target":49763167,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.9836428,38.8988399],[-76.98186,38.898494]]},"properties":{"street_edge_id":434711528,"source":49756572,"target":49836903,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.98831,38.90132],[-76.9868402,38.9013221]]},"properties":{"street_edge_id":966973763,"source":49790041,"target":1375406095,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.98831,38.90132],[-76.9868402,38.9013221]]},"properties":{"street_edge_id":966973763,"source":49790041,"target":1375406095,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.982214,38.896664],[-76.982197375,38.89724725],[-76.982116,38.897571]]},"properties":{"street_edge_id":1150459788,"source":49794274,"target":49798512,"way_type":"residential"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.985504,38.900197],[-76.9849655,38.9001661],[-76.9843165,38.9001598],[-76.9838283,38.9001243],[-76.983547,38.9000876]]},"properties":{"street_edge_id":894545881,"source":49739609,"target":1484481416,"way_type":"primary"}},{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-76.983653,38.897692],[-76.983644,38.897977],[-76.983646,38.89843],[-76.9836428,38.8988399]]},"properties":{"street_edge_id":978288606,"source":49758252,"target":49756572,"way_type":"tertiary"}}]};
			streetmap = L.geoJson(data, {
				pointToLayer: L.mapbox.marker.style,
				style: function(feature) {
					//return {color: feature.properties.stroke, opacity: 0.75, weight: 3};
					return {color: "#000000", opacity: 0.75, weight: 3};
				},
				onEachFeature: onEachFeature
			});console.log(streetmap);
			streetmap.addTo(Progress.map);
			var points = [];
			var squares = [];
			var complexity_constant = 40; // Was 10
			var vertical_stretch_factor = 0.8;
			//var radius = 0.0015;
			var radius = 0.0006;
			//var distance_between_points = (1/vertical_stretch_factor)*radius/2 + .00001
			var pairs = [];
			var distance_between_points = radius;
			for (var i = 0; i < data["features"].length; i++) {
				for (var s = 0; s < data["features"][i]["geometry"]["coordinates"].length; s++) {
					if (data["features"][i]["geometry"]["coordinates"][s]) { // This is necessary because some of the points are null. Dunno why
						// These are just to make code easier to write, they will not be changed
						var pa = data["features"][i]["geometry"]["coordinates"][s];
						var pb = data["features"][i]["geometry"]["coordinates"][s+1]; // Because this might be null, we need the following while loop.
						var a = 1;
						while (pb === null) { // Can't just do while !pb because if pb is undefined the while loop will become infinite
							a++;
							pb = data["features"][i]["geometry"]["coordinates"][s+a];
						}
						// This causes too much lag, need to find a better solution
						//points.push(pa);
						//if (pb && distance(pa, pb) > radius) {
						if (pb) {
							pairs.push([pa, pb]);
						}
					}
				}
			}
			/*for (var i = 0; i < points.length; i++) {
				var coords = [];
				for (var j = 0; j < complexity_constant; j++) {
					coords.push([points[i][0] + radius * Math.sin(2 * Math.PI * j/complexity_constant + (Math.PI / 4)), points[i][1] + vertical_stretch_factor * radius * Math.cos(2 * Math.PI * j/complexity_constant + (Math.PI / 4))]);
					// The extra pi/4 is so that if you have a complexity_constant of 4, the squares are aligned east/west instead of 45° off.
				}
				coords.push(coords[0]);
				squares.push(coords);
			}*/
			for (var i = 0; i < pairs.length; i++) {
				var pa = pairs[i][0];
				var pb = pairs[i][1];
				var coords = [];
				var theta = angleTo(pa, pb) - (Math.PI/2),
					theta_alt = angleTo(pa, pb);
				var x = Math.sin(theta) * radius,
					y = Math.cos(theta) * radius;
				var x_alt = Math.sin(theta_alt) * radius,
					y_alt = Math.cos(theta_alt) * radius;
				coords.push([pa[0] + y, pa[1] + x]);
				coords.push([pa[0] - y_alt, pa[1] - x_alt]);
				coords.push([pa[0] - y, pa[1] - x]);
				coords.push([pb[0] - y, pb[1] - x]);
				coords.push([pb[0] + y_alt, pb[1] + x_alt]);
				coords.push([pb[0] + y, pb[1] + x]);
				coords.push(coords[0]);
				squares.push(coords);
			}
			var reader = new jsts.io.WKTReader();
			var parser = new jsts.io.GeoJSONParser();
			var base = reader.read(polyToBullshit(squares[0]));
			for (var i = 1; i < squares.length; i++) {
				try {
				base = base.union(reader.read(polyToBullshit(squares[i])));
				} catch(e) {console.log(e)};
			}
			var squares2 = parser.write(base);
			console.log(squares2);
			if (squares2.type == "Polygon") {
				squares2.coordinates.push([
					[
						180,
						-180
					],
					[
						180,
						180
					],
					[
						-180,
						180
					],
					[
						-180,
						-180
					],
					[
						180,
						-180
					]
				]);
				var squares3 = {
					"type": "FeatureCollection",
					"features": [{
						"type": "Feature",
						"properties": {},
						"geometry": {
							"type": "Polygon",
							"coordinates": squares2 // Might be [squares2] instead of just squares2
						}
					}]
				};
			} else {
				var squares3 = {
					"type": "FeatureCollection",
					"features": [{
						"type": "Feature",
						"properties": {},
						"geometry": {
							"type": "Polygon",
							"coordinates": []
						}
					}]
				};
				for (var i = 0; i < squares2.coordinates.length; i++) {
					squares3.features[0].geometry.coordinates.push(squares2.coordinates[i][0]);
				}
				squares3.features[0].geometry.coordinates.push([
					[
						180,
						-180
					],
					[
						180,
						180
					],
					[
						-180,
						180
					],
					[
						-180,
						-180
					],
					[
						180,
						-180
					]
				]);
			}
			console.log(JSON.stringify(squares3, null));
			L.geoJson(squares3, {
				style: function(feature) {
					return {fillColor: "#000000", fillOpacity: 0.5, clickable: false, lineJoin: "round", className: "squares3", color: "#000000"};
				}
			})//.addTo(Progress.map);
			$("#loading").html("");
	}
	// Public methods
	self.init = _init;
	return self;
}($, L))

