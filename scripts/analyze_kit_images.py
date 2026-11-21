import os
import glob
from PIL import Image
import numpy as np

kit_files = glob.glob('scripts/kit_images/*.jpg')

def analyze_kit(filepath):
    img = Image.open(filepath).convert('RGB')
    w, h = img.size
    
    # The jersey is centered in the image.
    # Exclude outer 15% borders (background).
    # Central torso: 25% to 75% width, 25% to 75% height.
    crop_box = (int(w * 0.22), int(h * 0.22), int(w * 0.78), int(h * 0.78))
    torso = img.crop(crop_box)
    
    arr = np.array(torso)
    r = arr[:, :, 0].astype(float)
    g = arr[:, :, 1].astype(float)
    b = arr[:, :, 2].astype(float)
    
    # Filter out pure white or light grey background (r > 240, g > 240, b > 240)
    # and pure black if background
    not_white_bg = ~((r > 238) & (g > 238) & (b > 238))
    not_dark_bg = ~((r < 10) & (g < 10) & (b < 10))
    valid = not_white_bg & not_dark_bg

    if np.sum(valid) < 50:
        valid = not_white_bg

    if np.sum(valid) == 0:
        valid = np.ones_like(r, dtype=bool)

    vr, vg, vb = r[valid], g[valid], b[valid]
    
    # Quantize to find top colors
    pixels = np.stack([vr, vg, vb], axis=1).astype(int)
    
    # Simple histogram
    # Round to nearest 16 to group shades
    quant = (pixels // 16) * 16
    unique, counts = np.unique(quant, axis=0, return_counts=True)
    sorted_idx = np.argsort(-counts)
    
    top_colors = []
    for idx in sorted_idx[:3]:
        c = unique[idx]
        pct = (counts[idx] / len(pixels)) * 100
        hex_c = f"#{c[0]:02X}{c[1]:02X}{c[2]:02X}"
        top_colors.append((hex_c, pct))
        
    return top_colors, (w, h)

print(f"Analyzing {len(kit_files)} downloaded kit images...")
for f in sorted(kit_files):
    name = os.path.basename(f).replace('_local_2026.jpg', '')
    top_c, dims = analyze_kit(f)
    print(f"{name:32s} | Dominant: {top_c[0][0]} ({top_c[0][1]:4.1f}%) | Sec: {top_c[1][0] if len(top_c)>1 else 'N/A'} ({top_c[1][1]:4.1f}%) | {top_c[2][0] if len(top_c)>2 else ''}")
