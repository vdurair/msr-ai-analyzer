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
2. Start development server:
   ```bash
   npm run dev
   ```

## Customization
- Update placeholder files with actual implementation.
- Configure OpenAI and Jira API keys as needed.

## License
MIT
