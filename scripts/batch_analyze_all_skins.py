import json
import urllib.request
import io
import time
from PIL import Image
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed

def analyze_skin_image(img_bytes):
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        w, h = img.size

        # In portrait photos:
        # width: 30% to 70%
        # height: 22% to 58% (eyes, nose, cheeks, chin)
        crop_box = (int(w * 0.30), int(h * 0.22), int(w * 0.70), int(h * 0.58))
        face_crop = img.crop(crop_box)

        arr = np.array(face_crop)
        r = arr[:, :, 0].astype(float)
        g = arr[:, :, 1].astype(float)
        b = arr[:, :, 2].astype(float)

        # Human skin detector in RGB space:
        # 1. Not studio white or grey background: (r > 225 & g > 225 & b > 225)
        # 2. Not pure black or deep shadows: lum > 35
        # 3. Tone heuristic: r > g > b with healthy human skin undertone
        not_bg = ~((r > 225) & (g > 225) & (b > 225))
        skin_mask = not_bg & (r > 60) & (g > 35) & (b > 20) & (r > g) & (g >= (b - 12)) & ((r - g) >= 6) & ((r - b) >= 10)
        
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        valid_mask = skin_mask & (lum > 38) & (lum < 225)

        if np.sum(valid_mask) < 25:
            # Fallback: center core (cheeks/nose)
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

        # ITA or Luminance classification calibrated against ground-truth portraits:
        # white: lum >= 150
        # mestizo: 110 <= lum < 150
        # moreno: lum < 110
        if mean_lum >= 150:
            category = 'white'
        elif mean_lum >= 110:
            category = 'mestizo'
        else:
            category = 'moreno'

        hex_color = f"#{int(mean_r):02X}{int(mean_g):02X}{int(mean_b):02X}"
        return {
            'luminance': round(mean_lum, 1),
            'rgb': [int(mean_r), int(mean_g), int(mean_b)],
            'hex': hex_color,
            'category': category
        }
    except Exception as e:
        return None

def process_player(p):
    photo_url = p.get('photo_url')
    if not photo_url or len(photo_url) <= 5 or 'default' in photo_url:
        return (p['id'], None)

    try:
        req = urllib.request.Request(
            photo_url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
        res = analyze_skin_image(data)
        return (p['id'], res)
    except Exception as e:
        return (p['id'], None)

def main():
    with open('scripts/active_players_2026.json', 'r', encoding='utf-8') as f:
        players = json.load(f)

    with_photo = [p for p in players if p.get('photo_url') and len(p['photo_url']) > 5 and 'default' not in p['photo_url']]
    print(f"Total players to analyze: {len(with_photo)}")

    results = {}
    completed = 0
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=25) as executor:
        futures = {executor.submit(process_player, p): p for p in with_photo}
        for future in as_completed(futures):
            pid, res = future.result()
            if res:
                results[pid] = res
            completed += 1
            if completed % 50 == 0 or completed == len(with_photo):
                print(f"Analyzed {completed}/{len(with_photo)} players... ({time.time()-t0:.1f}s)")

    print(f"\nSuccessfully analyzed skin tones for {len(results)} players!")
    with open('scripts/players_skin_analyzed.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print("Saved results to scripts/players_skin_analyzed.json")

if __name__ == '__main__':
    main()
