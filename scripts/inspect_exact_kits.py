import glob
import os
from PIL import Image
import numpy as np

kits = sorted(glob.glob('scripts/kit_images/*.jpg'))

details = []
for k in kits:
    img = Image.open(k).convert('RGB')
    w, h = img.size
    name = os.path.basename(k).replace('_local_2026.jpg', '')
    
    # Analyze 3 key regions:
    # 1. Main chest (center: 35%-65% width, 35%-60% height)
    chest_crop = img.crop((int(w * 0.35), int(h * 0.35), int(w * 0.65), int(h * 0.60)))
    arr_c = np.array(chest_crop)
    r_c, g_c, b_c = arr_c[:, :, 0].flatten(), arr_c[:, :, 1].flatten(), arr_c[:, :, 2].flatten()
    valid_c = ~((r_c > 235) & (g_c > 235) & (b_c > 235)) & ~((r_c < 15) & (g_c < 15) & (b_c < 15))
    if np.sum(valid_c) > 20:
        med_r, med_g, med_b = int(np.median(r_c[valid_c])), int(np.median(g_c[valid_c])), int(np.median(b_c[valid_c]))
    else:
        med_r, med_g, med_b = int(np.median(r_c)), int(np.median(g_c)), int(np.median(b_c))
        
    chest_hex = f"#{med_r:02X}{med_g:02X}{med_b:02X}"

    # 2. Left chest vs Right chest to detect stripes or half-and-half (like Melgar)
    left_c = img.crop((int(w * 0.28), int(h * 0.35), int(w * 0.45), int(h * 0.60)))
    right_c = img.crop((int(w * 0.55), int(h * 0.35), int(w * 0.72), int(h * 0.60)))
    arr_l, arr_r = np.array(left_c), np.array(right_c)
    l_r, l_g, l_b = int(np.median(arr_l[:, :, 0])), int(np.median(arr_l[:, :, 1])), int(np.median(arr_l[:, :, 2]))
    r_r, r_g, r_b = int(np.median(arr_r[:, :, 0])), int(np.median(arr_r[:, :, 1])), int(np.median(arr_r[:, :, 2]))
    
    hex_l = f"#{l_r:02X}{l_g:02X}{l_b:02X}"
    hex_r = f"#{r_r:02X}{r_g:02X}{r_b:02X}"

    print(f"{name:30s} | Chest: {chest_hex} | Left: {hex_l} | Right: {hex_r}")
