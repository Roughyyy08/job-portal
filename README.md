A modern Job Portal Web App built using React that fetches live job data from an API and allows users to search, filter, and save jobs.

🚀 Features
🔄 Live Job Data
Fetches jobs dynamically from JSONPlaceholder API
Maps API data into realistic job listings
🔍 Smart Job Search
Search by:
Role
Company
Location
Skills (tags)
❤️ Save Jobs
Bookmark jobs using the heart icon
Toggle between All Jobs and Saved Jobs
📊 Dynamic Stats Dashboard
Total jobs
Saved jobs
Filtered results
⚡ Interactive UI
Smooth hover effects
Responsive grid layout
Clean modern design
⏳ Loading & Error Handling
Animated loading state
Retry option on API failure
🛠️ Tech Stack
Frontend: React (Hooks: useState, useEffect)
Styling: Inline CSS (custom UI design)
API: JSONPlaceholder (mock REST API)
Language: JavaScript (ES6+)
📂 Project Structure
job-portal/
│── src/
│   ├── App.js        # Main app component
│   ├── index.js   
│── public/
│── package.json
│── README.md
⚙️ How It Works

The app fetches posts from:

https://jsonplaceholder.typicode.com/posts
Each post is transformed into a job listing using a mapping function.
Predefined arrays (roles, companies, salaries, etc.) generate realistic job data.
▶️ Getting Started
1. Clone the repo
git clone https://github.com/Roughyyy08/job-portal.git
cd job-portal
2. Install dependencies
npm install
3. Run the app
npm start
4. Open in browser
http://localhost:3000
🧠 Key Concepts Used
React Hooks (useState, useEffect)
API fetching with fetch()
Conditional rendering
Array filtering & mapping
Component reusability (JobCard, Badge)
✨ UI Highlights
Gradient hero header
Animated loading icon
Card-based job layout
Tag badges for skills
Save/unsave interaction
⚠️ Limitations
Uses mock API (not real job data)
No backend/database (saved jobs stored in state only)
No authentication system
🔮 Future Improvements
Add real backend (Node.js + MongoDB)
User authentication (login/signup)
Apply to jobs feature
Pagination / infinite scroll
Dark mode
📄 License

This project is licensed under the MIT License.

👤 Author
GitHub: https://github.com/Roughyyy08
