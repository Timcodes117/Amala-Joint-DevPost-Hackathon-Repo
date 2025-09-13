# Gemini API Integration for Chat Screen

This chat screen now integrates with Google's Gemini API to provide intelligent responses. The bot will always return responses in the format `{intent: "", message: ""}` where:

- `intent`: A special keyword that categorizes the bot's response
- `message`: The actual response message to display to the user

## Setup Instructions

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the API Key
1. Open `config/gemini.ts`
2. Replace `'YOUR_GEMINI_API_KEY'` with your actual API key
3. Save the file

### 3. Features

#### Conversation History Storage
- All user messages and bot responses are stored in a string format
- This conversation history is automatically included in system instructions
- The history helps maintain context across the conversation

#### Intent-Based Responses
- Bot responses include an `intent` field for categorization
- You can use this intent to trigger specific actions or UI changes
- Example intents: "greeting", "question", "confirmation", "error", etc.

#### Error Handling
- Network errors are handled gracefully
- Invalid JSON responses are parsed safely
- User-friendly error messages are displayed

#### Loading States
- Send button is disabled while processing
- Visual feedback during API calls
- Prevents multiple simultaneous requests

## Usage

The chat screen will automatically:
1. Send user messages to Gemini API
2. Parse the JSON response to extract intent and message
3. Display the message to the user
4. Store the conversation for context
5. Handle button presses through the same API flow

## API Response Format

The bot is instructed to always respond in this exact JSON format:
```json
{
  "intent": "intent_keyword",
  "message": "your_response_message"
}
```

If the API returns invalid JSON, the system will fall back to displaying the raw response text.

## Security Note

Make sure to:
- Keep your API key secure
- Don't commit the API key to version control
- Consider using environment variables for production
- Monitor your API usage to avoid unexpected charges
