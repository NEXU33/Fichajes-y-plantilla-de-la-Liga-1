import os
from PIL import Image
import numpy as np

kits = [
    'universitario-de-deportes',
    'alianza-lima',
    'sporting-cristal',
    'fbc-melgar',
    'cienciano',
    'cusco-fc',
    'ad-tarma',
    'atletico-grau',
    'deportivo-garcilaso',
    'comerciantes-unidos',
    'alianza-atletico-sullana',
    'sport-boys-association',
    'csd-sport-huancayo',
    'juan-pablo-ii-college',
    'fc-cajamarca',
    'los-chankas',
    'utc',
    'cd-moquegua'
]

for k in kits:
    path = f'scripts/kit_images/{k}_local_2026.jpg'
    if not os.path.exists(path):
        print(f'MISSING: {k}')
        continue
    im = Image.open(path).convert('RGB')
    w, h = im.size
    arr = np.array(im)
    
    # Collar area (top center of jersey, around y: 0.15 to 0.28, x: 0.40 to 0.60)
    collar = arr[int(h*0.16):int(h*0.26), int(w*0.42):int(w*0.58)]
    # Cuffs area (sleeve ends: left around y: 0.35 to 0.50, x: 0.08 to 0.20; right x: 0.80 to 0.92)
    cuff_l = arr[int(h*0.35):int(h*0.50), int(w*0.08):int(w*0.22)]
    # Main chest area (y: 0.30 to 0.70, x: 0.30 to 0.70)
    chest = arr[int(h*0.30):int(h*0.70), int(w*0.30):int(w*0.70)]
    
    def hex_color(rgb):
        return f'#{int(rgb[0]):02X}{int(rgb[1]):02X}{int(rgb[2]):02X}'
    
    print(f'=== {k.upper()} ({w}x{h}) ===')
    # Let us find unique dominant colors in chest, collar, and cuff
    # Mask out pure white background (>245)
    chest_fg = chest[(chest[:,:,0]<245) | (chest[:,:,1]<245) | (chest[:,:,2]<245)]
    collar_fg = collar[(collar[:,:,0]<245) | (collar[:,:,1]<245) | (collar[:,:,2]<245)]
    cuff_fg = cuff_l[(cuff_l[:,:,0]<245) | (cuff_l[:,:,1]<245) | (cuff_l[:,:,2]<245)]
    
    if len(chest_fg) > 0:
        print('  Chest median:', hex_color(np.median(chest_fg, axis=0)))
    if len(collar_fg) > 0:
        print('  Collar median:', hex_color(np.median(collar_fg, axis=0)))
    if len(cuff_fg) > 0:
        print('  Cuff median:', hex_color(np.median(cuff_fg, axis=0)))
