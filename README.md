# Overwiew

This project is a simple web application written in **Vue.js (3)** for creating your own digital Kanban Boards.  
A Kanban board is a visual project management tool that helps teams organize and track their work. It typically consists of columns representing different stages of a workflow, with tasks or work items represented as cards that move across these columns as they progress.  

The repository for the backend part (Django Rest Framework) of this project can be found here:  https://github.com/kwilczyn/easy_kanban_backend

Example user flow:  

![task_flow](https://github.com/user-attachments/assets/d1d95030-39d6-4b0e-995e-9e701d2892be)

The mobile version of the layout:  
<p align="middle">
<img src="https://github.com/user-attachments/assets/a9ddae2f-ef46-42ce-a720-8609c39bd449" alt="Mobile view"/>  
</p>

Implemented features:
- design look for the desktop and mobile devices
- dark mode theme
- animations for the basic actions like deleting lists from the board
- basic CRUD operations on tasks and lists
- drag & drop operations for tasks
- changing the order of the lists on the board
- fallback UI for components when waiting for required data
- dedicated API client as a separate module
- handling communication errors
- unit tests (Vitest)
- E2E Tests (Playwright)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Preparation of a dev instance of a backend

```sh
git clone https://github.com/kwilczyn/easy_kanban_backend.git
python3 -m venv venv
```
Activate the new created virtual environent using steps suited to your operating system  

For MacOs/Linux:
```sh
source ./venv/bin/activate
```
Install requirements and run dev server:
```sh
python -m pip install -r requirements.txt  
python ./easy_kanban_backend/manage.py runserver  
```
The dev server should be started on localhost:8000

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
