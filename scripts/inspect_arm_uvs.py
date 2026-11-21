import json
import struct
import numpy as np

with open('public/models/player-01.glb', 'rb') as f:
    data = f.read()

chunk_len = struct.unpack('<I', data[12:16])[0]
gltf = json.loads(data[20:20+chunk_len].decode('utf-8'))
bin_data = data[20+chunk_len+8:]

mesh_shirt = gltf['meshes'][10]
prim = mesh_shirt['primitives'][0]
pos_acc = gltf['accessors'][prim['attributes']['POSITION']]
uv_acc = gltf['accessors'][prim['attributes']['TEXCOORD_0']]

bv_p = gltf['bufferViews'][pos_acc['bufferView']]
offset_p = bv_p.get('byteOffset', 0) + pos_acc.get('byteOffset', 0)
positions = np.array(struct.unpack(f'<{pos_acc["count"]*3}f', bin_data[offset_p:offset_p+pos_acc['count']*12])).reshape(-1, 3)

bv_uv = gltf['bufferViews'][uv_acc['bufferView']]
offset_uv = bv_uv.get('byteOffset', 0) + uv_acc.get('byteOffset', 0)
uvs = np.array(struct.unpack(f'<{uv_acc["count"]*2}f', bin_data[offset_uv:offset_uv+uv_acc['count']*8])).reshape(-1, 2)

# Left arm (X > 0.22)
left_arm = positions[:, 0] > 0.22
right_arm = positions[:, 0] < -0.22

print(f'Left arm U: [{uvs[left_arm, 0].min():.3f}, {uvs[left_arm, 0].max():.3f}], V: [{uvs[left_arm, 1].min():.3f}, {uvs[left_arm, 1].max():.3f}]')
print(f'Right arm U: [{uvs[right_arm, 0].min():.3f}, {uvs[right_arm, 0].max():.3f}], V: [{uvs[right_arm, 1].min():.3f}, {uvs[right_arm, 1].max():.3f}]')
