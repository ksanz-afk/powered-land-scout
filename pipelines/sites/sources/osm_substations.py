"""Substations from OpenStreetMap via the public Overpass API.

License: OSM data is ODbL. Attribute "(c) OpenStreetMap contributors"; a
database we publish that is derived from OSM must be shared under ODbL.
Coverage in the US is uneven, so treat gaps as missing data, not absence.
Be polite to the public Overpass server: one query per county, cache results.

Needs Python 3.10+: macOS's built-in Python 3.9 ships an old LibreSSL that
fails the TLS handshake with the Overpass server.

Usage:
    python -m sources.osm_substations 32.10 -100.15 32.60 -99.60 > /tmp/subs.json
"""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def _parse_kv(voltage):
    """OSM voltage tags are volts, possibly 'a;b'. Return the max in kV."""
    if not voltage:
        return None
    values = []
    for part in str(voltage).replace(",", ";").split(";"):
        try:
            values.append(float(part.strip()) / 1000)
        except ValueError:
            continue
    return round(max(values)) if values else None


def fetch_substations(south, west, north, east, timeout=60, cache=None):
    """Fetch substations in a bounding box. If `cache` is a path and exists,
    read the saved Overpass response instead of calling the server; otherwise
    save the response there."""
    if cache and Path(cache).exists():
        return parse_overpass(json.loads(Path(cache).read_text()))
    query = f"""
    [out:json][timeout:{timeout}];
    (
      node["power"="substation"]({south},{west},{north},{east});
      way["power"="substation"]({south},{west},{north},{east});
    );
    out center tags;
    """
    data = urllib.parse.urlencode({"data": query}).encode()
    request = urllib.request.Request(
        OVERPASS_URL, data=data, headers={"User-Agent": "powered-land-scout/0.1 (research prototype)"}
    )
    with urllib.request.urlopen(request, timeout=timeout + 10) as response:
        payload = json.load(response)
    if cache:
        Path(cache).parent.mkdir(parents=True, exist_ok=True)
        Path(cache).write_text(json.dumps(payload))
    return parse_overpass(payload)


def parse_overpass(payload):
    substations = []
    for el in payload.get("elements", []):
        lat = el.get("lat") or el.get("center", {}).get("lat")
        lng = el.get("lon") or el.get("center", {}).get("lon")
        if lat is None or lng is None:
            continue
        tags = el.get("tags", {})
        substations.append({
            "osm_id": f"{el['type']}/{el['id']}",
            "lat": lat,
            "lng": lng,
            "kv": _parse_kv(tags.get("voltage")),
            "name": tags.get("name"),
            "operator": tags.get("operator"),
        })
    return substations


if __name__ == "__main__":
    s, w, n, e = map(float, sys.argv[1:5])
    json.dump(fetch_substations(s, w, n, e), sys.stdout, indent=2)
