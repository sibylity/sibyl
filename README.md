# Sibyl

A type-safe analytics configuration and tracking library.

## Features

- Type-safe analytics configuration
- Schema validation for analytics configs
- Automatic type generation for events and properties
- Agnostic of destination so it can be used with any analytics vendor

## Installation

```bash
npm install sibyl
```

## Usage

### 1. Configure Analytics

Create an `analytics.config.json` file in your project root:

```json
{
  "generates": [
    {
      "globals": "analytics.globals.json",
      "events": "analytics.events.json"
    }
  ]
}
```

### 2. Define Events

Create `analytics.events.json` to define your events:

```json
{
  "events": {
    "page_view": {
      "properties": [
        {
          "name": "page_title",
          "type": "string"
        },
        {
          "name": "page_url",
          "type": "string"
        }
      ]
    },
    "button_click": {
      "properties": [
        {
          "name": "button_id",
          "type": "string"
        },
        {
          "name": "button_text",
          "type": "string"
        }
      ]
    }
  }
}
```

### 3. Using the Tracker

```typescript
import { AnalyticsTracker, TrackerEvents, trackingConfig } from './__analytics_generated__/analytics';
import { createAnalyticsTracker } from 'sibyl';

// Create a tracker instance
const tracker: AnalyticsTracker<TrackerEvents> = createAnalyticsTracker<TrackerEvents>(trackingConfig, {
  // Required callback to send events
  send: async (eventData) => {
    // Send the event to your analytics service
  }
});

// Track a page view event
tracker.track('page_view', {
  page_title: 'Home Page',
  page_url: 'https://example.com'
});

// Track a button click event
tracker.track('button_click', {
  button_id: 'signup_button',
  button_text: 'Sign Up'
});
```

### 4. CLI Commands

```bash
# Validate your analytics configuration
npx sibyl validate

# Generate TypeScript types for your events
npx sibyl generate

# List all dimensions and their events
npx sibyl dimensions
```

## License

MIT
