from PIL import Image
import numpy as np

def remove_background(input_path, output_path):
    # Open the image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Get data
    data = np.array(img)
    
    # Define the background color (dark blue from the image)
    # Based on the image, the background is roughly #0A2A3B or similar dark blue
    # We'll use a tolerance based approach
    
    # Sample the top-left pixel to get the background color
    bg_color = data[0, 0]
    
    # Calculate distance from background color
    r, g, b, a = data.T
    
    # Calculate color difference
    color_diff = np.sqrt(
        (r - bg_color[0])**2 + 
        (g - bg_color[1])**2 + 
        (b - bg_color[2])**2
    )
    
    # Set tolerance (adjust as needed)
    tolerance = 30
    
    # Create mask where difference is less than tolerance
    mask = color_diff < tolerance
    
    # Set alpha channel to 0 where mask is true
    data[..., 3][mask.T] = 0
    
    # Create new image
    new_img = Image.fromarray(data)
    
    # Save
    new_img.save(output_path, "PNG")
    print(f"Processed image saved to {output_path}")

if __name__ == "__main__":
    input_file = "/home/ubuntu/escritorio-advocacia/client/public/images/logo.jpg"
    output_file = "/home/ubuntu/escritorio-advocacia/client/public/images/logo-transparent.png"
    remove_background(input_file, output_file)
