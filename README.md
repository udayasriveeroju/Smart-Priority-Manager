# Smart Priority Manager

Smart Priority Manager is a simple to-do app that helps users decide which task they should do first.

It gives priority to tasks based on things like **deadline, importance, difficulty, and estimated time**.

## Features

* Add, edit and delete tasks
* Mark tasks as completed
* Set task deadline
* Set task importance
* Automatic priority score
* Shows high, medium and low priority tasks
* AI suggestions for important tasks
* Search and filter tasks
* Simple dashboard
* Login and signup

## Tech Used

* React.js
* JavaScript
* CSS
* Node.js
* Express.js
* MongoDB
* JWT
* OpenAI API

## How to Run

### 1. Clone the project

```bash
git clone https://github.com/your-username/smart-priority-manager.git
cd smart-priority-manager
```

### 2. Install dependencies

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

### 3. Add environment variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key
```

### 4. Run the backend

```bash
cd backend
npm run dev
```

### 5. Run the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Then open the localhost link in your browser.

## Future Ideas

* Add notifications
* Add calendar
* Add voice input
* Add mobile app
* Improve AI suggestions

## Author

**Your Name**
