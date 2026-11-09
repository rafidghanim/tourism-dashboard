# Tourism Intelligence Dashboard

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/rafidghanim/tourism-dashboard)

This repository contains the frontend for a regional Tourism Intelligence Dashboard, designed to provide insights into the tourism landscape of Kudus Regency, Indonesia. It features data visualizations for visitor trends, destination performance, and geographical distribution of tourist activity. The dashboard is built using Next.js and TypeScript.

## Features

-   **Interactive Dashboard:** A central overview page displaying key performance indicators (KPIs), visitor trends, destination rankings, and a distribution map.
-   **Geospatial Analysis:** An interactive map powered by Leaflet to visualize the geographic distribution of tourist visits across various destinations.
-   **Trend Visualization:** Time-series charts using ECharts to display trends in tourist visits, with comparisons to previous periods.
-   **Destination Performance:** Detailed views for analyzing and ranking tourism destinations based on visits, growth, and operational status.
-   **Planning Studio:**
    -   **Policy Simulation:** A tool to model the potential impact of interventions (e.g., promotion, accessibility improvements) on visitor numbers.
    -   **Policy Recommendation:** Generates policy recommendations based on simulation results.
-   **Reporting:** Functionality to generate and export reports in various formats (HTML, CSV, JSON).
-   **Data Management:** A simple admin interface to manage the catalog of tourism destinations.
-   **Responsive Design:** The UI is designed to be accessible and functional across a range of devices, from mobile phones to desktops.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charting:** [ECharts for React](https://github.com/hustcc/echarts-for-react)
-   **Mapping:** [React Leaflet](https://react-leaflet.js.org/)
-   **UI Components:** Built with custom components and icons from [Lucide React](https://lucide.dev/).
-   **Unit & Component Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
-   **End-to-End Testing:** [Playwright](https://playwright.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later)
-   npm or a compatible package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rafidghanim/tourism-dashboard.git
    cd tourism-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`. The dashboard uses local demonstration data by default. To connect to a backend API, create a `.env.local` file and set the `NEXT_PUBLIC_API_BASE_URL` variable:

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Available Scripts

This project includes several scripts to help with development and testing:

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server after a build.
-   `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
-   `npm run test`: Runs unit and component tests using Vitest.
-   `npm run test:e2e`: Runs end-to-end tests using Playwright.

## Project Structure

The repository is organized as follows:

-   `/app`: Contains all the pages and routes of the application, following the Next.js App Router structure.
-   `/components`: Includes all reusable React components, organized by feature and a `ui` subdirectory for generic elements like buttons and cards.
-   `/e2e`: Contains end-to-end tests written with Playwright, ensuring key user flows work as expected across different viewports.
-   `/lib`: (Implicit) Contains helper functions, API clients, and static data generation logic.

## Testing

The project has a comprehensive testing strategy:

-   **Unit & Component Tests:** Written with Vitest and React Testing Library to ensure individual components behave correctly.
-   **End-to-End Tests:** Playwright is used to simulate user interactions and test critical user journeys, such as filtering data, navigating between pages, and interacting with the map on various screen sizes. Tests are located in the `/e2e` directory.
