import json
import struct

with open('public/models/player-01.glb', 'rb') as f:
    data = f.read()

magic, version, length = struct.unpack('<4sII', data[:12])
chunk_len, chunk_type = struct.unpack('<II', data[12:20])
gltf = json.loads(data[20:20+chunk_len].decode('utf-8'))

print('=== MESHES ===')
for i, m in enumerate(gltf.get('meshes', [])):
    print(f'Mesh {i}: {m.get("name")}')
    for p in m.get('primitives', []):
        attrs = list(p.get('attributes', {}).keys())
        print(f'   primitives attrs: {attrs}, material: {p.get("material")}')

print('=== NODES WITH MESH ===')
for i, n in enumerate(gltf.get('nodes', [])):
    if 'mesh' in n:
        print(f'Node {i}: {n.get("name")} -> mesh {n["mesh"]}')

print('=== MATERIALS ===')
for i, mat in enumerate(gltf.get('materials', [])):
    print(f'Material {i}: {mat.get("name")}')
