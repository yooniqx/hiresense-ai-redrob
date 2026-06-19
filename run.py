#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HireSense AI - Main Entry Point
Run this script to start the application
"""
import sys
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import app, initialize_system

if __name__ == '__main__':
    print("=" * 60)
    print("HireSense AI - Intelligent Candidate Ranking System")
    print("=" * 60)
    print("\nInitializing system...")
    
    try:
        # Initialize the ranking system
        initialize_system()
        
        print("\nSystem initialized successfully!")
        print("\n" + "=" * 60)
        print("Starting Flask server...")
        print("=" * 60)
        print("\nDashboard: http://localhost:5000")
        print("API Docs: http://localhost:5000/api/dashboard")
        print("\nPress Ctrl+C to stop the server\n")
        
        # Run the Flask app
        app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
        
    except KeyboardInterrupt:
        print("\n\nShutting down HireSense AI...")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)

