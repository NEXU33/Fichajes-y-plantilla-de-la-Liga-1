import json
import struct
import numpy as np

with open('public/models/player-01.glb', 'rb') as f:
    data = f.read()

magic, version, length = struct.unpack('<4sII', data[:12])
chunk_len, chunk_type = struct.unpack('<II', data[12:20])
gltf = json.loads(data[20:20+chunk_len].decode('utf-8'))
bin_data = data[20+chunk_len+8:]

# Find mesh 10: kit_shirt
mesh_shirt = gltf['meshes'][10]
prim = mesh_shirt['primitives'][0]
pos_acc = gltf['accessors'][prim['attributes']['POSITION']]
uv_acc = gltf['accessors'][prim['attributes']['TEXCOORD_0']]

def read_acc(acc):
    bv = gltf['bufferViews'][acc['bufferView']]
    offset = bv.get('byteOffset', 0) + acc.get('byteOffset', 0)
    count = acc['count']
    if acc['type'] == 'VEC3':
        fmt = f'<{count*3}f'
        return np.array(struct.unpack(fmt, bin_data[offset:offset+count*12])).reshape(-1, 3)
    elif acc['type'] == 'VEC2':
        fmt = f'<{count*2}f'
        return np.array(struct.unpack(fmt, bin_data[offset:offset+count*8])).reshape(-1, 2)

positions = read_acc(pos_acc)
uvs = read_acc(uv_acc)

print(f'Shirt vertices count: {len(positions)}')
print(f'Position bounds: X [{positions[:,0].min():.3f}, {positions[:,0].max():.3f}], Y [{positions[:,1].min():.3f}, {positions[:,1].max():.3f}], Z [{positions[:,2].min():.3f}, {positions[:,2].max():.3f}]')
print(f'UV bounds: U [{uvs[:,0].min():.3f}, {uvs[:,0].max():.3f}], V [{uvs[:,1].min():.3f}, {uvs[:,1].max():.3f}]')

# Where are front vertices (Z > 0) vs back vertices (Z < 0)?
front_mask = positions[:, 2] > 0.02
back_mask = positions[:, 2] < -0.02
print(f'Front UVs U bounds: [{uvs[front_mask, 0].min():.3f}, {uvs[front_mask, 0].max():.3f}], V bounds: [{uvs[front_mask, 1].min():.3f}, {uvs[front_mask, 1].max():.3f}]')
print(f'Back UVs U bounds: [{uvs[back_mask, 0].min():.3f}, {uvs[back_mask, 0].max():.3f}], V bounds: [{uvs[back_mask, 1].min():.3f}, {uvs[back_mask, 1].max():.3f}]')

# Sleeves: |X| > 0.20
sleeve_mask = np.abs(positions[:, 0]) > 0.18
print(f'Sleeve UVs U bounds: [{uvs[sleeve_mask, 0].min():.3f}, {uvs[sleeve_mask, 0].max():.3f}], V bounds: [{uvs[sleeve_mask, 1].min():.3f}, {uvs[sleeve_mask, 1].max():.3f}]')
