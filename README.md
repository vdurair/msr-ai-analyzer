# msr-ai-analyzer

AI-powered MSR dashboard integrating Jira, React, Node.js, and OpenAI.

## Features
- React frontend (Hooks, Context API)
- Recharts for data visualization
- Axios for API calls
- Node.js + Express backend API
- OpenAI integration for AI insights
- CSS Modules or Tailwind CSS for styling
- State management via React Context API
- Dev tools: ESLint, Prettier, Git, VS Code

## Project Structure
```
src/
  api/
    jiraApi.js
  components/
    layout/
      Sidebar.jsx
      Header.jsx
      PageContainer.jsx
    filters/
      TrainTabs.jsx
      ChannelFilter.jsx
      TeamFilter.jsx
    kpis/
      KpiCard.jsx
    tables/
      MsrTable.jsx
    charts/
      VelocityChart.jsx
      BurndownChart.jsx
      StoryTypePie.jsx
    ai/
      AiSummaryBox.jsx
  context/
    JiraContext.jsx
    UiContext.jsx
  hooks/
    useJiraData.js
    useAiInsights.js
  pages/
    Dashboard.jsx
  utils/
    dataTransform.js
    kpiCalculations.js
  styles/
    dashboard.css
  App.jsx
  index.js
package.json
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file for Jira credentials:
  ```bash
  copy .env.example .env
  ```
3. Start backend API server:
  ```bash
  npm run start
  ```
4. Start frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Configure values in `.env`:

```env
BACKEND_PORT=4000
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_STORY_POINTS_FIELD=customfield_10016
JIRA_CHANNEL_LABEL_PREFIX=channel-
JIRA_TEAM_LABEL_PREFIX=team-
JIRA_TRAIN_LABEL_PREFIX=train-
REACT_APP_JIRA_PROJECT_KEY=TM
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
```

## Jira Integration
- Backend endpoint: `/api/jira/issues?projectKey=TM`
- Health check: `/api/health`
- Jira credentials are read only on backend from `.env`.
- Channel, Team, and Train are parsed from Jira labels.
- Label examples: `channel-aa`, `team-aa`, `train-aa`.
- `JIRA_STORY_POINTS_FIELD` remains configurable for story points.
- AI Insights endpoint: `/api/ai/insights` (uses OpenAI via backend only).
- Set `OPENAI_API_KEY` in `.env` to enable real AI-generated summaries.

## Run Notes
- Run backend and frontend in separate terminals.
- Keep backend on port `4000` using `BACKEND_PORT`.
- Frontend uses `react-scripts` and proxies `/api` calls to backend via `package.json` proxy.

## Customization
- Update placeholder files with actual implementation.
- Configure OpenAI and Jira API keys as needed.

## License
MIT
