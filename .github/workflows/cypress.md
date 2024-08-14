name: "Tests: Cypress e2e"

on:
  push:
    branches: ["main", "development"]
  pull_request:
    branches: ["main", "development"]
  schedule:
    - cron: "45 15 * * 4"

jobs:
  cypress-run:
    name: Running Cypress tests ✨
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
          wait-on: "http://localhost:3000"
