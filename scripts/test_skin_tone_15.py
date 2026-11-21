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

        # In Transfermarkt portraits:
        # Width: face is centered between 30% and 70%
        # Height: face (eyes/nose/cheeks) is between 25% and 60%
        crop_box = (int(w * 0.32), int(h * 0.25), int(w * 0.68), int(h * 0.58))
        face_crop = img.crop(crop_box)

        arr = np.array(face_crop)
        r = arr[:, :, 0].astype(float)
        g = arr[:, :, 1].astype(float)
        b = arr[:, :, 2].astype(float)

        # Human skin detector:
        # Exclude dark hair/shadows (r < 65, g < 40, b < 30)
        # Exclude white/grey background and specular highlights (r > 230 and g > 230 and b > 230)
        # Exclude non-skin color (r must be distinctly greater than g, and g >= b - 10)
        not_bg = ~((r > 225) & (g > 225) & (b > 225))
        skin_mask = not_bg & (r > 65) & (g > 40) & (b > 25) & (r > g) & (g >= (b - 8)) & ((r - g) >= 8) & ((r - b) >= 12)
        
        # Perceived luminance formula (ITU-R BT.601)
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        valid_mask = skin_mask & (lum > 45) & (lum < 225)

        if np.sum(valid_mask) < 30:
            # Center sampling fallback
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

        # ITA or Luminance classification:
        # Note: Transfermarkt portraits typically have studio lighting.
        # White players (Britos, Barcos, González, Cuesta, Galeano, Calcaterra, Cazonatti): Lum >= 148
        # Mestizo players (Rivera, Estrada, Cabellos, Christofer Gonzáles, Ávila, Zambrano): 108 <= Lum < 148
        # Moreno players (Kevin Quevedo, Andy Polo, Bryan Reyna, Kevin Becerra, Luis Advíncula): Lum < 108 or dark undertones
        if mean_lum >= 148:
            cat = 'white'
        elif mean_lum >= 108:
            cat = 'mestizo'
        else:
            cat = 'moreno'

        hex_c = f"#{int(mean_r):02X}{int(mean_g):02X}{int(mean_b):02X}"
        print(f"{name:25s} | Lum: {mean_lum:5.1f} | Category: {cat:7s} | Hex: {hex_c}")
        return cat, hex_c, mean_lum
    except Exception as e:
        print(f"Error {name}: {e}")
        return None, None, None

players = [
    ("Sebastián Britos", "https://img.a.transfermarkt.technology/portrait/header/159772-1738284846.png?lm=4711"),
    ("Leonel Galeano", "https://img.a.transfermarkt.technology/portrait/header/124244-1678473996.jpg?lm=4711"),
    ("José Rivera", "https://img.a.transfermarkt.technology/portrait/header/58616-1444904332.jpg?lm=4711"),
    ("Josué Estrada", "https://img.a.transfermarkt.technology/portrait/header/260324-1776886148.jpg?lm=4711"),
    ("Kevin Quevedo", "https://img.a.transfermarkt.technology/portrait/header/439631-1776887019.jpg?lm=4711"),
    ("Williams Riveros", "https://img.a.transfermarkt.technology/portrait/header/457058-1770730870.jpg?lm=4711"),
    ("Andy Polo", "https://img.a.transfermarkt.technology/portrait/header/189236-1770730700.jpg?lm=4711"),
    ("Horacio Calcaterra", "https://img.a.transfermarkt.technology/portrait/header/77125-1770729488.jpg?lm=4711"),
    ("Gustavo Cazonatti", "https://img.a.transfermarkt.technology/portrait/header/520457-1770126256.png?lm=4711"),
    ("Catriel Cabellos", "https://img.a.transfermarkt.technology/portrait/header/1011264-1770126031.png?lm=4711"),
    ("Hernán Barcos", "https://img.a.transfermarkt.technology/portrait/header/53847-1736795983.jpg?lm=4711"),
    ("Santiago González", "https://img.a.transfermarkt.technology/portrait/header/1249779-1727449808.jpg?lm=4711"),
    ("Christofer Gonzáles", "https://img.a.transfermarkt.technology/portrait/header/250055-1770126788.png?lm=4711"),
    ("Irven Ávila", "https://img.a.transfermarkt.technology/portrait/header/82589-1770125705.png?lm=4711"),
    ("Horacio Orzán", "https://img.a.transfermarkt.technology/portrait/header/249468-1678475961.jpg?lm=4711"),
]

for name, url in players:
    analyze_skin_from_url(name, url)
