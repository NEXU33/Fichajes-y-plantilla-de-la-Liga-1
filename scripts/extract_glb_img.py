import json, struct, os

with open(r'public\models\player-01.glb', 'rb') as f:
    f.seek(12)
    chunk_len, chunk_type = struct.unpack('<II', f.read(8))
    gltf = json.loads(f.read(chunk_len).decode('utf-8'))
    bin_chunk_len, bin_chunk_type = struct.unpack('<II', f.read(8))
    bin_data = f.read(bin_chunk_len)

buffer_views = gltf.get('bufferViews', [])
for i, img in enumerate(gltf.get('images', [])):
    bv = buffer_views[img['bufferView']]
    offset = bv.get('byteOffset', 0)
    length = bv['byteLength']
    data = bin_data[offset:offset+length]
    name = img.get('name', f'img_{i}')
    ext = 'webp' if 'webp' in img.get('mimeType', '') else 'png'
    out_path = os.path.join('public', 'models', f'extracted_{i}_{name}.{ext}')
    with open(out_path, 'wb') as out_f:
        out_f.write(data)
    print('Wrote:', out_path, len(data))
