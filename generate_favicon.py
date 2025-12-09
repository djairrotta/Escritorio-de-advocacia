from PIL import Image
import os

def create_favicon(input_path, output_dir):
    # Open the image
    img = Image.open(input_path)
    
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Resize to standard favicon size (32x32)
    # We'll use the transparent logo we created earlier
    favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
    
    # Save as ICO
    favicon.save(os.path.join(output_dir, "favicon.ico"), format="ICO")
    
    # Also save as PNG for modern browsers
    favicon_png = img.resize((192, 192), Image.Resampling.LANCZOS)
    favicon_png.save(os.path.join(output_dir, "icon-192.png"), format="PNG")
    
    print(f"Favicon generated in {output_dir}")

if __name__ == "__main__":
    input_file = "/home/ubuntu/escritorio-advocacia/client/public/images/logo-transparent.png"
    output_dir = "/home/ubuntu/escritorio-advocacia/client/public"
    create_favicon(input_file, output_dir)
