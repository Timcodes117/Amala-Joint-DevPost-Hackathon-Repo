#!/usr/bin/python3.10

import sys
import os

# Add your project directory to the Python path
path = '/home/yourusername/mysite'  # Replace 'yourusername' with your PythonAnywhere username
if path not in sys.path:
    sys.path.append(path)

# Import your Flask app
from app import app as application

if __name__ == "__main__":
    application.run()
