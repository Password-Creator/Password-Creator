#!/bin/bash

echo "🎓 Real-Time Captioner AI Setup Helper"
echo "======================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file found"
    
    # Check if API key is set
    if grep -q "REACT_APP_GEMINI_API_KEY=your_api_key_here" .env; then
        echo "⚠️  WARNING: You still need to add your Google AI API key!"
        echo ""
        echo "Steps:"
        echo "1. Go to https://aistudio.google.com/"
        echo "2. Click 'Get API Key'"
        echo "3. Copy your key"
        echo "4. Edit .env file and replace 'your_api_key_here' with your actual key"
        echo ""
    elif grep -q "REACT_APP_GEMINI_API_KEY=" .env; then
        echo "✅ API key appears to be configured"
    else
        echo "❌ .env file exists but no API key found"
    fi
else
    echo "❌ .env file not found"
    echo ""
    echo "Creating .env from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "⚠️  Now you need to add your Google AI API key:"
        echo "1. Go to https://aistudio.google.com/"
        echo "2. Click 'Get API Key'"
        echo "3. Copy your key"
        echo "4. Edit .env file and replace 'your_api_key_here' with your actual key"
        echo ""
    else
        echo "❌ .env.example not found. Creating one..."
        echo "REACT_APP_GEMINI_API_KEY=your_api_key_here" > .env
        echo "✅ Created .env file"
    fi
fi

echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules/@google/generative-ai" ]; then
    echo "✅ @google/generative-ai installed"
else
    echo "❌ @google/generative-ai not found"
    echo "Installing..."
    npm install @google/generative-ai
fi

echo ""
echo "🚀 Ready to start!"
echo ""
echo "Next steps:"
echo "1. Make sure your API key is in .env file"
echo "2. Run: npm start"
echo "3. Start recording and test the AI features!"
echo ""
echo "📚 For full documentation, see:"
echo "   - AI_IMPLEMENTATION_SUMMARY.md (quick overview)"
echo "   - AI_SETUP_GUIDE.md (detailed guide)"
echo ""
