import urllib.request
import io
from PIL import Image
import numpy as np

def analyze_skin_from_url(name, url):
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            img_bytes = resp.read()

        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        w, h = img.size

        # In portrait photos, facial area is roughly 30%-70% width, 20%-55% height
        crop_box = (int(w * 0.28), int(h * 0.18), int(w * 0.72), int(h * 0.58))
        face_crop = img.crop(crop_box)

        arr = np.array(face_crop)
        r = arr[:, :, 0].astype(float)
        g = arr[:, :, 1].astype(float)
        b = arr[:, :, 2].astype(float)

        # Human skin detector mask in RGB
        # Condition: R > G > B, with reasonable differences
        skin_mask = (r > 60) & (g > 35) & (b > 20) & (r > g) & (g >= (b - 5)) & ((r - g) >= 6) & ((r - b) >= 12)
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        valid_mask = skin_mask & (lum > 40) & (lum < 235)

        if np.sum(valid_mask) < 25:
            # Fallback to center core (nose/cheeks)
            cw, ch = int(arr.shape[1] * 0.25), int(arr.shape[0] * 0.25)
            carr = arr[ch:-ch, cw:-cw]
            cr, cg, cb = carr[:, :, 0].astype(float), carr[:, :, 1].astype(float), carr[:, :, 2].astype(float)
            clum = 0.299 * cr + 0.587 * cg + 0.114 * cb
            mean_lum = float(np.median(clum))
            mean_r = float(np.median(cr))
            mean_g = float(np.median(cg))
            mean_b = float(np.median(cb))
        else:
            mean_lum = float(np.median(lum[valid_mask]))
            mean_r = float(np.median(r[valid_mask]))
            mean_g = float(np.median(g[valid_mask]))
            mean_b = float(np.median(b[valid_mask]))

        # Categorization:
        # Standard dermatological / photographic Fitzpatrick scale mapping:
        # white: lum >= 155
        # mestizo: 110 <= lum < 155
        # moreno: lum < 110 (or lower lum with warm undertones)
        if mean_lum >= 155:
            cat = 'white'
        elif mean_lum >= 110:
            cat = 'mestizo'
        else:
            cat = 'moreno'

        hex_c = f"#{int(mean_r):02X}{int(mean_g):02X}{int(mean_b):02X}"
        print(f"{name:20s} | Lum: {mean_lum:5.1f} | Category: {cat:7s} | Hex: {hex_c}")
        return cat, hex_c, mean_lum
    except Exception as e:
        print(f"Error {name}: {e}")
        return None, None, None

players = [
    ("Paolo Guerrero", "https://img.a.transfermarkt.technology/portrait/header/2989-1776886584.jpg?lm=4711"),
    ("Hernán Barcos", "https://img.a.transfermarkt.technology/portrait/header/53847-1736795983.jpg?lm=4711"),
    ("Sebastián Britos", "https://img.a.transfermarkt.technology/portrait/header/159772-1738284846.png?lm=4711"),
    ("Bernardo Cuesta", "https://img.a.transfermarkt.technology/portrait/header/89317-1678476811.jpg?lm=4711"),
    ("Bryan Reyna", "https://img.a.transfermarkt.technology/portrait/header/440312-1758831102.png?lm=4711"),
    ("Jhilmar Lora", "https://img.a.transfermarkt.technology/portrait/header/740464-1683351946.png?lm=4711"),
    ("Kevin Becerra", "https://img.a.transfermarkt.technology/portrait/header/704884-1741206713.png?lm=4711"),
    ("Ángelo Campos", "https://cdn.resfu.com/img_data/players/medium/161671.jpg?size=120x&lossy=1"),
]

for name, url in players:
    analyze_skin_from_url(name, url)
