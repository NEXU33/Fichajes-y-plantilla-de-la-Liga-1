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

def analyze_crop(crop_path):
    if not os.path.exists(crop_path):
        return None
    im = Image.open(crop_path).convert('RGB')
    arr = np.array(im)
    # Exclude white background (R>240, G>240, B>240)
    mask = ~((arr[:,:,0] > 240) & (arr[:,:,1] > 240) & (arr[:,:,2] > 240))
    fg = arr[mask]
    if len(fg) == 0:
        return 'None'
    # Find colors by k-means or histogram
    from collections import Counter
    # Downsample colors (divide by 16)
    quant = (fg // 16) * 16
    tuples = [tuple(c) for c in quant]
    counts = Counter(tuples).most_common(3)
    return [f'#{c[0]:02X}{c[1]:02X}{c[2]:02X} ({pct:.1f}%)' for c, pct in [(col, cnt/len(tuples)*100) for col, cnt in counts]]

for k in kits:
    print(f'*** {k.upper()} ***')
    print('  Collar colors:', analyze_crop(f'scripts/crops/{k}_collar.jpg'))
    print('  Cuff colors:  ', analyze_crop(f'scripts/crops/{k}_cuff.jpg'))
    print('  Chest colors: ', analyze_crop(f'scripts/crops/{k}_chest.jpg'))
