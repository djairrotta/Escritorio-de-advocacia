import os
from PIL import Image

def optimize_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB if saving as JPEG
                        if file.lower().endswith(('.jpg', '.jpeg')) and img.mode == 'RGBA':
                            img = img.convert('RGB')
                        
                        # Resize if too large (max width 1920px)
                        if img.width > 1920:
                            ratio = 1920 / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                        
                        # Save with optimization
                        if file.lower().endswith('.png'):
                            img.save(filepath, 'PNG', optimize=True)
                        else:
                            img.save(filepath, 'JPEG', quality=85, optimize=True)
                        
                        print(f"Optimized: {filepath}")
                except Exception as e:
                    print(f"Error optimizing {filepath}: {e}")

if __name__ == "__main__":
    target_dir = "/home/ubuntu/escritorio-advocacia/client/public/images"
    if os.path.exists(target_dir):
        optimize_images(target_dir)
    else:
        print(f"Directory not found: {target_dir}")
