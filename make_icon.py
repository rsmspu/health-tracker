"""Cute app icon generator — proper teardrop leaf cradling a water drop with a heart."""
from PIL import Image, ImageDraw, ImageFilter
import math
import os


def lerp(a, b, t):
    return a + (b - a) * t


def lerp_color(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))


def leaf_outline(cx, cy, length, width, n=80):
    """Almond-shaped leaf with ONE peak in the middle — vertical orientation."""
    pts = []
    for i in range(n + 1):
        t = i / n  # 0 at top tip, 1 at bottom tip
        y = -length / 2 + length * t
        # Single sine bell, peak at t=0.5
        # Sharper top (so it tapers to a point), rounder bottom
        if t < 0.5:
            # Top half: shape it more pointed
            w = width * 0.5 * math.sin(math.pi * t) ** 0.8
        else:
            # Bottom half: more rounded
            w = width * 0.5 * math.sin(math.pi * t) ** 0.7
        pts.append((cx + w, cy + y))
    for i in range(n, -1, -1):
        t = i / n
        y = -length / 2 + length * t
        if t < 0.5:
            w = width * 0.5 * math.sin(math.pi * t) ** 0.8
        else:
            w = width * 0.5 * math.sin(math.pi * t) ** 0.7
        pts.append((cx - w, cy + y))
    return pts


def drop_outline(cx, cy, height, n=80):
    """Classic water drop using tangent-from-external-point construction."""
    r = height * 0.42
    bcy = cy + height / 2 - r
    tip = (cx, cy - height / 2)
    d = bcy - tip[1]
    if d <= r:
        # Degenerate, just return circle
        return [(cx + r * math.cos(2 * math.pi * i / n), bcy + r * math.sin(2 * math.pi * i / n)) for i in range(n + 1)]

    alpha = math.asin(r / d)
    beta = math.pi / 2 - alpha
    rtx = cx + r * math.cos(beta)
    rty = bcy - r * math.sin(beta)
    ltx = cx - r * math.cos(beta)
    lty = bcy - r * math.sin(beta)

    pts = []
    n_side = n // 4
    # Right side: tip → right tangent point with slight outward bulge
    for i in range(n_side + 1):
        t = i / n_side
        x = lerp(tip[0], rtx, t) + math.sin(t * math.pi) * r * 0.04
        y = lerp(tip[1], rty, t)
        pts.append((x, y))
    # Bottom arc: from right tangent point around bottom to left tangent point
    n_arc = n // 2
    theta_start = -beta
    theta_end = math.pi + beta
    for i in range(1, n_arc + 1):
        theta = theta_start + (theta_end - theta_start) * i / n_arc
        x = cx + r * math.cos(theta)
        y = bcy + r * math.sin(theta)
        pts.append((x, y))
    # Left side: left tangent → tip with slight outward bulge
    for i in range(1, n_side + 1):
        t = i / n_side
        x = lerp(ltx, tip[0], t) - math.sin((1 - t) * math.pi) * r * 0.04
        y = lerp(lty, tip[1], t)
        pts.append((x, y))
    return pts


def heart_outline(cx, cy, size, n=80):
    pts = []
    for i in range(n + 1):
        t = 2 * math.pi * i / n
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((cx + x * size / 32, cy + y * size / 32))
    return pts


def sparkle_4pt(cx, cy, size):
    s = size
    return [
        (cx, cy - s), (cx + s * 0.22, cy - s * 0.22),
        (cx + s, cy), (cx + s * 0.22, cy + s * 0.22),
        (cx, cy + s), (cx - s * 0.22, cy + s * 0.22),
        (cx - s, cy), (cx - s * 0.22, cy - s * 0.22),
    ]


def fill_polygon_vgrad(canvas_size, polygon_pts, top_color, bot_color):
    mask = Image.new('L', (canvas_size, canvas_size), 0)
    ImageDraw.Draw(mask).polygon(polygon_pts, fill=255)
    ys = [p[1] for p in polygon_pts]
    y0, y1 = max(0, int(min(ys))), min(canvas_size, int(max(ys)))
    grad = Image.new('RGB', (canvas_size, canvas_size), top_color)
    px = grad.load()
    for y in range(canvas_size):
        if y <= y0:
            c = top_color
        elif y >= y1:
            c = bot_color
        else:
            t = (y - y0) / (y1 - y0)
            c = lerp_color(top_color, bot_color, t)
        for x in range(canvas_size):
            px[x, y] = c
    rgba = grad.convert('RGBA')
    rgba.putalpha(mask)
    return rgba


def fill_polygon_radial(canvas_size, polygon_pts, center, radius, inner_color, outer_color):
    mask = Image.new('L', (canvas_size, canvas_size), 0)
    ImageDraw.Draw(mask).polygon(polygon_pts, fill=255)
    grad = Image.new('RGB', (canvas_size, canvas_size), outer_color)
    px = grad.load()
    cx, cy = center
    for y in range(canvas_size):
        for x in range(canvas_size):
            d = min(1.0, math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius)
            px[x, y] = lerp_color(inner_color, outer_color, d)
    rgba = grad.convert('RGBA')
    rgba.putalpha(mask)
    return rgba


def make_icon(size=1024, maskable=False):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

    bg_inner = (254, 243, 226)
    bg_outer = (240, 222, 200)
    bg = Image.new('RGB', (size, size), bg_inner)
    bg_px = bg.load()
    cx_bg, cy_bg = size / 2, size * 0.4
    max_r = size * 0.75
    for y in range(size):
        for x in range(size):
            d = min(1.0, math.sqrt((x - cx_bg) ** 2 + (y - cy_bg) ** 2) / max_r)
            bg_px[x, y] = lerp_color(bg_inner, bg_outer, d)

    if maskable:
        img.paste(bg, (0, 0))
    else:
        radius = int(size * 0.224)
        bg_mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(bg_mask).rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
        img.paste(bg, (0, 0), bg_mask)

    scale = 0.78 if maskable else 1.0

    # Dot grain
    grain = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grain)
    for px_x, px_y in [(60, 80), (140, 50), (220, 90), (320, 60), (420, 100),
                       (80, 180), (190, 220), (380, 200), (450, 280),
                       (100, 380), (240, 430), (400, 450), (60, 460),
                       (470, 60), (290, 380), (170, 320), (340, 110), (50, 250)]:
        x = int(px_x * size / 512)
        y = int(px_y * size / 512)
        r = max(1, int(size * 0.0035))
        g_draw.ellipse([x - r, y - r, x + r, y + r], fill=(120, 113, 108, 30))
    img = Image.alpha_composite(img, grain)

    cx, cy = size / 2, size / 2

    # ===== LEAF =====
    leaf_length = size * 0.78 * scale
    leaf_width = size * 0.50 * scale
    cy_leaf = cy + size * 0.02
    leaf_pts = leaf_outline(cx, cy_leaf, leaf_length, leaf_width)

    leaf_dark = (74, 124, 79)
    leaf_light = (140, 195, 138)
    leaf_layer = fill_polygon_vgrad(size, leaf_pts, leaf_light, leaf_dark)

    # Veins
    vein_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vein_layer)
    vein_color = (45, 90, 50, 110)
    v_draw.line([(cx, cy_leaf - leaf_length / 2 + size * 0.025),
                 (cx, cy_leaf + leaf_length / 2 - size * 0.025)],
                fill=vein_color, width=max(2, int(size * 0.008)))
    for k in [-0.32, -0.16, 0.0, 0.16, 0.32]:
        y0 = cy_leaf + leaf_length * k
        t_local = k + 0.5
        # Match the new single-peak profile
        if t_local < 0.5:
            w = leaf_width * 0.5 * math.sin(math.pi * t_local) ** 0.8
        else:
            w = leaf_width * 0.5 * math.sin(math.pi * t_local) ** 0.7
        v_draw.line([(cx, y0), (cx + w * 0.85, y0 + leaf_length * 0.07)],
                    fill=vein_color, width=max(1, int(size * 0.005)))
        v_draw.line([(cx, y0), (cx - w * 0.85, y0 + leaf_length * 0.07)],
                    fill=vein_color, width=max(1, int(size * 0.005)))
    leaf_layer = Image.alpha_composite(leaf_layer, vein_layer)

    # Highlight on upper-left of leaf, masked to leaf shape
    hl_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(hl_layer)
    hx, hy = cx - leaf_width * 0.18, cy_leaf - leaf_length * 0.22
    hl_draw.ellipse([hx - leaf_width * 0.18, hy - leaf_length * 0.07,
                     hx + leaf_width * 0.18, hy + leaf_length * 0.07],
                    fill=(190, 235, 180, 110))
    hl_layer = hl_layer.filter(ImageFilter.GaussianBlur(radius=size * 0.025))
    # Mask to leaf
    leaf_mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(leaf_mask).polygon(leaf_pts, fill=255)
    hl_alpha = hl_layer.split()[3]
    new_alpha = Image.new('L', (size, size), 0)
    np = new_alpha.load()
    ha = hl_alpha.load()
    lm = leaf_mask.load()
    for y in range(size):
        for x in range(size):
            np[x, y] = (ha[x, y] * lm[x, y]) // 255
    hl_layer.putalpha(new_alpha)
    leaf_layer = Image.alpha_composite(leaf_layer, hl_layer)

    # Rotate the whole leaf
    leaf_layer = leaf_layer.rotate(-8, resample=Image.BICUBIC, center=(cx, cy))
    img = Image.alpha_composite(img, leaf_layer)

    # ===== WATER DROP =====
    drop_height = size * 0.36 * scale
    drop_cx, drop_cy = cx, cy + size * 0.005
    drop_pts = drop_outline(drop_cx, drop_cy, drop_height)

    drop_top = (175, 220, 235)
    drop_bot = (62, 130, 175)
    drop_layer = fill_polygon_vgrad(size, drop_pts, drop_top, drop_bot)
    img = Image.alpha_composite(img, drop_layer)

    # Drop highlight — soft white
    soft_hl = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(soft_hl)
    hx_d = drop_cx - drop_height * 0.13
    hy_d = drop_cy - drop_height * 0.1
    s_draw.ellipse([hx_d - drop_height * 0.06, hy_d - drop_height * 0.16,
                    hx_d + drop_height * 0.06, hy_d + drop_height * 0.16],
                   fill=(255, 255, 255, 200))
    soft_hl = soft_hl.filter(ImageFilter.GaussianBlur(radius=size * 0.005))
    img = Image.alpha_composite(img, soft_hl)

    # Sharper inner highlight
    dot = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(dot)
    d_draw.ellipse([hx_d - drop_height * 0.025, hy_d - drop_height * 0.07,
                    hx_d + drop_height * 0.025, hy_d + drop_height * 0.07],
                   fill=(255, 255, 255, 245))
    img = Image.alpha_composite(img, dot)

    # ===== HEART =====
    heart_size = drop_height * 0.32
    heart_cx, heart_cy = drop_cx, drop_cy + drop_height * 0.18
    heart_pts = heart_outline(heart_cx, heart_cy, heart_size)
    heart_layer = fill_polygon_radial(size, heart_pts,
                                      (heart_cx - heart_size * 0.15, heart_cy - heart_size * 0.15),
                                      heart_size * 0.7,
                                      (253, 164, 164), (220, 80, 105))
    img = Image.alpha_composite(img, heart_layer)

    # ===== SPARKLES =====
    if not maskable:
        sparkle_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        sp_draw = ImageDraw.Draw(sparkle_layer)
        for sx, sy, ssize in [(0.18, 0.20, 0.025), (0.80, 0.28, 0.022),
                              (0.76, 0.78, 0.020), (0.20, 0.80, 0.018),
                              (0.50, 0.10, 0.014)]:
            pts = sparkle_4pt(size * sx, size * sy, size * ssize)
            sp_draw.polygon(pts, fill=(232, 168, 56, 220))
        img = Image.alpha_composite(img, sparkle_layer)

    return img


def main():
    out = '/home/claude/health-tracker/public'
    os.makedirs(out, exist_ok=True)

    print("Generating 1024 master...")
    master = make_icon(1024, maskable=False)
    master.save(f'{out}/icon-1024.png', 'PNG', optimize=True)
    print("  → 512, 192, 180...")
    master.resize((512, 512), Image.LANCZOS).save(f'{out}/icon-512.png', 'PNG', optimize=True)
    master.resize((192, 192), Image.LANCZOS).save(f'{out}/icon-192.png', 'PNG', optimize=True)
    master.resize((180, 180), Image.LANCZOS).save(f'{out}/icon-180.png', 'PNG', optimize=True)
    master.resize((64, 64), Image.LANCZOS).save(f'{out}/favicon.png', 'PNG', optimize=True)
    print("Generating maskable...")
    maskable = make_icon(1024, maskable=True)
    maskable.resize((512, 512), Image.LANCZOS).save(f'{out}/icon-512-maskable.png', 'PNG', optimize=True)
    print("Done.")
    for f in ['icon-1024.png', 'icon-512.png', 'icon-192.png', 'icon-180.png', 'icon-512-maskable.png', 'favicon.png']:
        print(f"  {f}: {os.path.getsize(f'{out}/{f}') // 1024} KB")


if __name__ == '__main__':
    main()
