from PIL import Image

src_path = 'C:/Users/NEXU/.gemini/antigravity/brain/6088883f-c94b-4021-9d1a-dd8a195ffcc6/.user_uploaded/media_1795143507708_e361b8eb.jpg'
img = Image.open(src_path)
width, height = img.size
print(f"Original image size: {width}x{height}")

# The player is on the right half of the image (roughly from x = width * 0.45 to width)
crop_box = (int(width * 0.42), 0, width, height)
player_crop = img.crop(crop_box)
player_crop.save('public/images/cristal_star_player.png')
print("Saved cropped player to public/images/cristal_star_player.png")
