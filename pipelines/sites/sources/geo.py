import math


def haversine_km(lat1, lng1, lat2, lng2):
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def nearest(lat, lng, points, min_kv=0):
    """Nearest point with voltage >= min_kv. points: dicts with lat, lng, kv."""
    best = None
    for p in points:
        if (p.get("kv") or 0) < min_kv:
            continue
        d = haversine_km(lat, lng, p["lat"], p["lng"])
        if best is None or d < best[0]:
            best = (d, p)
    return best
