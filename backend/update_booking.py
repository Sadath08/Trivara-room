import re

# Read files
with open(r'c:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend\src\pages\Booking.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(r'c:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend\PAYMENT_STEP_CODE.jsx', 'r', encoding='utf-8') as f:
    payment_lines = f.readlines()[3:]  # Skip the comment lines

# Find where to insert (after line 317, which is after currentStep === 2 closes)
# Insert payment code at line 317 (0-indexed, so insert at 317)
print(f"Total lines before: {len(lines)}")
print(f"Line 316: {lines[315].strip()}")
print(f"Line 317: {lines[316].strip()}")  
print(f"Line 318: {lines[317].strip()}")

# Insert payment code after line 317 (after the closing paren of step 2)
insert_position = 317  # After line 317
lines_to_insert = ['\n'] + payment_lines + ['\n']
new_lines = lines[:insert_position] + lines_to_insert + lines[insert_position:]

# Join and update button logic
content = ''.join(new_lines)
content = content.replace('if (currentStep < 3)', 'if (currentStep < 4)')
content = content.replace("currentStep < 3 ? 'Continue'", "currentStep < 4 ? 'Continue'")

# Write back
with open(r'c:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend\src\pages\Booking.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Total lines after: {len(new_lines)}")
print("✅ Successfully updated Booking.jsx!")
print(f"✅ Inserted {len(lines_to_insert)} lines at position {insert_position}")
print("✅ Updated button logic for 4 steps")
