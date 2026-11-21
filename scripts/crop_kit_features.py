import os
from PIL import Image

kits = [
    ('universitario-de-deportes', 'Universitario'),
    ('alianza-lima', 'Alianza Lima'),
    ('sporting-cristal', 'Sporting Cristal'),
    ('fbc-melgar', 'FBC Melgar'),
    ('cienciano', 'Cienciano'),
    ('cusco-fc', 'Cusco FC'),
    ('ad-tarma', 'ADT Tarma'),
    ('atletico-grau', 'Atletico Grau'),
    ('deportivo-garcilaso', 'Deportivo Garcilaso'),
    ('comerciantes-unidos', 'Comerciantes Unidos'),
    ('alianza-atletico-sullana', 'Alianza Atletico'),
    ('sport-boys-association', 'Sport Boys'),
    ('csd-sport-huancayo', 'Sport Huancayo'),
    ('juan-pablo-ii-college', 'Juan Pablo II'),
    ('fc-cajamarca', 'FC Cajamarca'),
    ('los-chankas', 'Los Chankas'),
    ('utc', 'UTC'),
    ('cd-moquegua', 'CD Moquegua')
]

os.makedirs('scripts/crops', exist_ok=True)

for fname, name in kits:
    p = f'scripts/kit_images/{fname}_local_2026.jpg'
    if not os.path.exists(p):
        continue
    im = Image.open(p).convert('RGB')
    w, h = im.size
    # Crop collar (top middle)
    collar = im.crop((int(w*0.35), int(h*0.12), int(w*0.65), int(h*0.30)))
    collar.save(f'scripts/crops/{fname}_collar.jpg')
    # Crop cuff (left sleeve)
    cuff = im.crop((int(w*0.05), int(h*0.30), int(w*0.25), int(h*0.55)))
    cuff.save(f'scripts/crops/{fname}_cuff.jpg')
    # Crop chest (center)
    chest = im.crop((int(w*0.25), int(h*0.25), int(w*0.75), int(h*0.65)))
    chest.save(f'scripts/crops/{fname}_chest.jpg')

print('All crops saved in scripts/crops/')
