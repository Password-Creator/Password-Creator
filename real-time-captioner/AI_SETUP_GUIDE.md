# AI-Powered Note Summarization Setup Guide

## Overview
Your real-time captioner now includes AI-powered features using Google's Gemini API to automatically:
- Generate concise summaries of your lecture sessions
- Extract key points for easy review
- Identify main topics covered
- Auto-classify the subject area
- Create study materials

## Google AI Studio Setup (REQUIRED)

### Step 1: Get Your API Key
1. Go to **[Google AI Studio](https://aistudio.google.com/)**
2. Sign in with your Google account
3. Click **"Get API Key"** in the left sidebar
4. Click **"Create API Key"** 
5. Select a Google Cloud project (or create a new one)
6. Copy the generated API key

### Step 2: Configure Your Application
1. In your project root, create a file named `.env` (copy from `.env.example`)
2. Open the `.env` file and add your API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file
4. **IMPORTANT**: Restart your development server (`npm start`)

### Step 3: Verify Setup
After restarting, the AI features will be active. You can verify by:
- Starting a listening session
- Speaking some content (at least a few sentences)
- Stopping the session
- Checking the Notes page for AI-generated summaries

## How It Works

### During a Session
1. **Start Listening**: Click the microphone button
2. **Subject Selection**: Choose your subject (optional - AI will auto-detect if skipped)
3. **Speak**: The app captures all speech in real-time
4. **Stop Listening**: Click the microphone button again to end the session

### After a Session
1. **Automatic Save**: Session is saved to local storage immediately
2. **AI Processing**: Gemini analyzes the transcript in the background
3. **Summary Generation**: Creates:
   - 2-3 sentence summary
   - 5-7 key bullet points
   - 3-5 main topics
   - Subject classification (auto-corrects if you selected wrong)

### Viewing Your Notes
1. Navigate to **Notes** page via the navbar
2. See all your saved sessions with AI summaries
3. **Expand** any session to view:
   - AI-generated summary
   - Key points
   - Topics covered
   - Full transcript
4. **Download** sessions as text files
5. **Delete** sessions you no longer need

## Features

### Smart Subject Detection
The AI automatically identifies the subject area from your transcript:
- Computer Science
- Mathematics
- Physics
- Chemistry
- Biology
- History
- English
- Psychology
- Economics
- Engineering
- Other

### Searchable & Filterable
- Search across all transcripts
- Filter by subject
- Sort by date (newest first)

### Export Options
- Download as text file with full AI summary
- Share via native share menu (mobile)
- Includes all AI-generated content

## Troubleshooting

### "AI summarization will not work" Warning
**Solution**: You haven't set up your API key yet. Follow Step 1-2 above.

### Sessions Save but No AI Summary
**Possible causes**:
1. API key not configured correctly
2. Session too short (needs at least ~50 characters)
3. Network issues
4. API quota exceeded

**Check**:
- Browser console for error messages
- Your API key is valid at [Google AI Studio](https://aistudio.google.com/)
- You have internet connection

### API Key Security
- **NEVER** commit your `.env` file to git
- The `.gitignore` file already excludes it
- Each team member needs their own API key
- Free tier includes generous quotas for development

## API Quotas & Limits

**Google AI Studio Free Tier**:
- 60 requests per minute
- Generous free quota for development
- More than enough for a hackathon project

If you exceed quotas:
- Wait 1 minute and try again
- Or upgrade to paid tier (not needed for hackathon)

## Privacy & Data
- All sessions stored **locally** in your browser (localStorage)
- Transcripts sent to Google Gemini API for processing
- No data stored on any server (except Google's AI processing)
- Clear browser data to delete all sessions

## Tips for Best Results

### For Better AI Summaries
1. Speak clearly and at a moderate pace
2. Pause briefly between major concepts
3. Use natural language (the AI understands context)
4. Longer sessions (3+ minutes) get better summaries

### For Study Sessions
1. Review AI key points first
2. Read full transcript for details
3. Download important sessions as backups
4. Use subject filters to organize by class

## Example Workflow

```
1. Start lecture → Click microphone
2. Choose subject (or skip for auto-detect)
3. Listen and take mental notes
4. End lecture → Click microphone to stop
5. Wait ~5 seconds for AI processing
6. Go to Notes page
7. Expand your session
8. Review AI summary and key points
9. Download if important for exam prep
```

## Tech Stack
- **Google Gemini 1.5 Flash**: Fast, efficient AI model
- **React**: Frontend framework
- **TypeScript**: Type safety
- **LocalStorage**: Browser-based persistence

## Support
If you encounter issues:
1. Check browser console for errors
2. Verify API key is correctly set
3. Ensure you restarted the dev server after adding `.env`
4. Check [Google AI Studio](https://aistudio.google.com/) for API status

## Next Steps
Consider adding:
- Export to PDF with formatting
- Study guide generation
- Quiz question generation
- Flashcard creation from key points
- Cloud sync across devices
