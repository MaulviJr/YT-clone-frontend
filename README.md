# YT-Clone Frontend (Under Dev)

A modern, responsive video-sharing platform frontend built with **React 19**, **Vite**, and **Redux Toolkit**. This project utilizes **Tailwind CSS 4** for styling and **Framer Motion** for smooth UI transitions.

## 🚀 Features

* **User Authentication:** Full login and signup flows with persistent sessions using JWT cookies.
* **State Management:** Global state handling for authentication and video data using Redux Toolkit.
* **Modern UI:** Built with Shadcn/UI components, Lucide icons, and Tailwind CSS 4.
* **Responsive Design:** Optimized for mobile, tablet, and desktop views.
* **Form Validation:** Robust client-side validation using React Hook Form.
* **Smooth Animations:** Enhanced user experience with Framer Motion and Animate.css.

## 🛠️ Tech Stack

* **Framework:** React 19 (Functional Components, Hooks)
* **Build Tool:** Vite 7
* **State Management:** Redux Toolkit & React-Redux
* **Routing:** React Router DOM v7
* **Styling:** Tailwind CSS 4 & Class Variance Authority (CVA)
* **API Client:** Axios with centralized instance configuration
* **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/yt-clone-frontend.git
cd yt-clone-frontend

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env` file in the root directory and add your backend URL:
```env
VITE_BACKEND_URL=http://localhost:3000/api/v1

```


4. **Run the development server:**
```bash
npm run dev

```



## 🏗️ Project Structure

* `src/api/`: Axios instances and service layers for modular API calls.
* `src/components/`: Reusable UI components and layout wrappers.
* `src/pages/`: Main page-level components (Login, Signup, Home).
* `src/store/`: Redux slices and store configuration.
* `src/lib/`: Utility functions for Tailwind class merging.

## 📜 Available Scripts

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the application for production.
* `npm run lint`: Runs ESLint to check for code quality issues.
* `npm run preview`: Previews the production build locally.
