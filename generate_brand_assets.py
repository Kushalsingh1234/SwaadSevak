import os
import math
from PIL import Image, ImageDraw, ImageFont

BRAND_DIR = os.path.join(os.path.dirname(__file__), 'client', 'public', 'brand')
os.makedirs(BRAND_DIR, exist_ok=True)

# Helper function to draw the Swaad Sevak Soup Bowl Mark with anti-aliasing
def draw_brand_mark(draw, offset_x, offset_y, scale, is_dark_bg=True, is_mono_black=False):
    # Colors
    orange = (0, 0, 0, 255) if is_mono_black else (255, 94, 14, 255)
    bowl_color = (0, 0, 0, 255) if is_mono_black else ((255, 255, 255, 255) if is_dark_bg else (11, 16, 32, 255))
    
    # 1. Left Steam Ribbon (Points scaled from 100x100 viewBox: M 37 40 C 31 29 46 21 39 8)
    # Sample points along the cubic bezier
    def cubic_bezier(p0, p1, p2, p3, steps=30):
        pts = []
        for i in range(steps + 1):
            t = i / steps
            x = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
            y = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
            pts.append((offset_x + x * scale, offset_y + y * scale))
        return pts

    left_steam = cubic_bezier((37, 40), (31, 29), (46, 21), (39, 8))
    right_steam = cubic_bezier((63, 40), (57, 29), (72, 21), (65, 8))
    
    steam_w = int(round(8.5 * scale))
    draw.line(left_steam, fill=orange, width=steam_w, joint='curve')
    # Round caps for left steam
    r = steam_w / 2
    draw.ellipse([left_steam[0][0]-r, left_steam[0][1]-r, left_steam[0][0]+r, left_steam[0][1]+r], fill=orange)
    draw.ellipse([left_steam[-1][0]-r, left_steam[-1][1]-r, left_steam[-1][0]+r, left_steam[-1][1]+r], fill=orange)

    draw.line(right_steam, fill=orange, width=steam_w, joint='curve')
    # Round caps for right steam
    draw.ellipse([right_steam[0][0]-r, right_steam[0][1]-r, right_steam[0][0]+r, right_steam[0][1]+r], fill=orange)
    draw.ellipse([right_steam[-1][0]-r, right_steam[-1][1]-r, right_steam[-1][0]+r, right_steam[-1][1]+r], fill=orange)

    # 2. Bowl Rim: <rect x="14" y="47" width="72" height="8" rx="4" />
    rim_box = [
        offset_x + 14 * scale,
        offset_y + 47 * scale,
        offset_x + 86 * scale,
        offset_y + 55 * scale
    ]
    draw.rounded_rectangle(rim_box, radius=int(round(4 * scale)), fill=orange)

    # 3. Bowl Basin: smooth curve down from (18, 55) through (34, 88), (50, 88), (66, 88) to (82, 55)
    basin_pts = [(offset_x + 18 * scale, offset_y + 55 * scale)]
    # Bezier down from 18,55 to 50,88
    curve_l = cubic_bezier((18, 55), (20, 76), (34, 88), (50, 88), steps=20)
    curve_r = cubic_bezier((50, 88), (66, 88), (80, 76), (82, 55), steps=20)
    basin_polygon = curve_l + curve_r[1:]
    draw.polygon(basin_polygon, fill=bowl_color)

    # 4. Bowl Foot Stand: <rect x="36" y="88" width="28" height="4.5" rx="2.25" fill="..." />
    foot_box = [
        offset_x + 36 * scale,
        offset_y + 88 * scale,
        offset_x + 64 * scale,
        offset_y + 92.5 * scale
    ]
    draw.rounded_rectangle(foot_box, radius=int(round(2.25 * scale)), fill=bowl_color)


def generate_icon(size, supersample=3):
    ss = size * supersample
    img = Image.new('RGBA', (ss, ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Squircle background
    rx = int(round(ss * 0.22))
    bg_color = (22, 14, 8, 255)
    draw.rounded_rectangle([0, 0, ss, ss], radius=rx, fill=bg_color)
    
    # Border
    stroke_w = max(1, int(round(ss * 0.015)))
    draw.rounded_rectangle([stroke_w//2, stroke_w//2, ss - stroke_w//2, ss - stroke_w//2], 
                           radius=rx - stroke_w//2, outline=(255, 255, 255, 30), width=stroke_w)

    # Radial orange glow in center
    cx, cy = ss // 2, int(ss * 0.55)
    glow_r = int(ss * 0.35)
    for r in range(glow_r, 0, -int(round(supersample * 2))):
        alpha = int(28 * (1 - r / glow_r))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 94, 14, alpha))

    # Center mark (symbol is 100x100 viewBox, scaled to ~68% of squircle)
    mark_target_size = ss * 0.68
    scale = mark_target_size / 100.0
    ox = (ss - mark_target_size) / 2
    oy = (ss - mark_target_size) / 2 - ss * 0.01

    draw_brand_mark(draw, ox, oy, scale, is_dark_bg=True)

    # Downsample with high quality Lanczos
    return img.resize((size, size), Image.Resampling.LANCZOS)


print("Generating app-icon-512.png...")
icon_512 = generate_icon(512)
icon_512.save(os.path.join(BRAND_DIR, 'app-icon-512.png'))

print("Generating app-icon-192.png...")
icon_192 = generate_icon(192)
icon_192.save(os.path.join(BRAND_DIR, 'app-icon-192.png'))

print("Generating apple-touch-icon.png (180x180)...")
icon_180 = generate_icon(180)
icon_180.save(os.path.join(BRAND_DIR, 'apple-touch-icon.png'))
# Also place in client/public root for standard browser fallback
icon_180.save(os.path.join(os.path.dirname(__file__), 'client', 'public', 'apple-touch-icon.png'))

print("Generating favicon.ico (16, 32, 48)...")
fav_16 = generate_icon(16, supersample=4)
fav_32 = generate_icon(32, supersample=4)
fav_48 = generate_icon(48, supersample=4)
fav_ico_path = os.path.join(BRAND_DIR, 'favicon.ico')
fav_16.save(fav_ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[fav_32, fav_48])
# Also save to root public
fav_16.save(os.path.join(os.path.dirname(__file__), 'client', 'public', 'favicon.ico'), format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[fav_32, fav_48])


# Generate og-image.png (1200 x 630)
print("Generating og-image.png (1200x630)...")
og_w, og_h = 1200, 630
og = Image.new('RGBA', (og_w, og_h), (20, 13, 8, 255))
draw_og = ImageDraw.Draw(og)

# Ambient glow on the left and right
for r in range(350, 0, -5):
    alpha = int(45 * (1 - r / 350))
    draw_og.ellipse([150 - r, 315 - r, 150 + r, 315 + r], fill=(255, 94, 14, alpha))
    alpha2 = int(25 * (1 - r / 350))
    draw_og.ellipse([1000 - r, 300 - r, 1000 + r, 300 + r], fill=(255, 176, 32, alpha2))

# Card container on the left
card_box = [80, 80, 1120, 550]
draw_og.rounded_rectangle(card_box, radius=28, fill=(28, 19, 13, 220), outline=(255, 255, 255, 25), width=2)

# Draw brand icon mark
icon_box_size = 130
draw_og.rounded_rectangle([130, 130, 130 + icon_box_size, 130 + icon_box_size], radius=28, fill=(22, 14, 8, 255), outline=(255, 94, 14, 80), width=2)
draw_brand_mark(draw_og, 130 + 15, 130 + 15, 1.0, is_dark_bg=True)

# Try to use a nice font, or default
try:
    font_large = ImageFont.truetype("arial.ttf", 52)
    font_sub = ImageFont.truetype("arial.ttf", 24)
    font_body = ImageFont.truetype("arial.ttf", 18)
    font_pill = ImageFont.truetype("arial.ttf", 15)
except:
    font_large = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_body = ImageFont.load_default()
    font_pill = ImageFont.load_default()

# Title text
draw_og.text((290, 142), "Swaad", font=font_large, fill=(255, 255, 255, 255))
draw_og.text((455, 142), "Sevak", font=font_large, fill=(255, 94, 14, 255))
draw_og.text((292, 210), "RESTAURANT & CAFÉ OPERATING SYSTEM", font=font_sub, fill=(212, 195, 179, 255))

draw_og.text((130, 300), "Modern software built for Indian cafés, restaurants, cloud kitchens & sweet shops.", font=font_sub, fill=(255, 247, 237, 255))

# 4 feature pills
pills = [
    "⚡ QR Table Ordering",
    "🍳 Live Kitchen KDS",
    "🧾 5% GST Billing",
    "🖨️ 80mm KOT Thermal Printing"
]
pill_x = 130
for pill in pills:
    pill_w = len(pill) * 11 + 24
    draw_og.rounded_rectangle([pill_x, 370, pill_x + pill_w, 412], radius=12, fill=(255, 255, 255, 15), outline=(255, 255, 255, 30), width=1)
    draw_og.text((pill_x + 14, 382), pill, font=font_pill, fill=(255, 255, 255, 240))
    pill_x += pill_w + 16

# Footer info
draw_og.line([130, 460, 1070, 460], fill=(255, 255, 255, 20), width=1)
draw_og.text((130, 480), "swaadsevak.vercel.app  •  Made with pride in India 🇮🇳", font=font_body, fill=(163, 144, 130, 255))

og.save(os.path.join(BRAND_DIR, 'og-image.png'))
# Also place in root public
og.save(os.path.join(os.path.dirname(__file__), 'client', 'public', 'og-image.png'))

print("All raster brand assets successfully generated!")
