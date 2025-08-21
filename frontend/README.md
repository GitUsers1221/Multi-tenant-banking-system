# Banking Management System - Frontend

A modern, responsive web interface for the Banking Management System backend.

## Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Live data from your backend API
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Audit Logs**: View system activity and changes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## Supported Entities

1. **Accounts** - Bank accounts with customer association, type, and balance
2. **Customers** - Customer information with name, age, and gender
3. **Banks** - Bank branches with location and contact information
4. **Loans** - Loan management (backend not fully implemented)
5. **Audit Logs** - System activity tracking

## Setup Instructions

### 1. Backend Setup
Make sure your backend server is running on `http://localhost:3000`

```bash
# In your backend directory
npm start
# or
node index.js
```

### 2. Frontend Setup
The frontend is a static HTML/CSS/JavaScript application. You can serve it using any static file server:

#### Option A: Using Python (if you have Python installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js
```bash
# Install a simple HTTP server globally
npm install -g http-server

# Serve the frontend
http-server frontend -p 8000
```

#### Option C: Using Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"

### 3. Access the Application
Open your browser and navigate to:
- If using Python: `http://localhost:8000`
- If using http-server: `http://localhost:8080`
- If using Live Server: Usually `http://localhost:5500`

## API Configuration

The frontend is configured to connect to your backend API at `http://localhost:3000/api`. If your backend runs on a different port or URL, update the `API_BASE_URL` constant in `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Features Overview

### Navigation
- Click on the navigation buttons to switch between different sections
- Each section loads its respective data from the backend

### Data Management
- **View**: All data is displayed in clean, sortable tables
- **Create**: Click "Add" buttons to create new records
- **Update**: Click "Edit" buttons to modify existing records
- **Delete**: Click "Delete" buttons to remove records

### Forms
- Dynamic forms that adapt to the entity type
- Form validation for required fields
- Real-time feedback on form submission

### Error Handling
- Network errors are displayed as user-friendly messages
- Loading states prevent multiple submissions
- Confirmation dialogs for destructive actions

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality and API calls
└── README.md           # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend has CORS enabled. Add this to your backend:

```javascript
const cors = require('cors');
app.use(cors());
```

### API Connection Issues
1. Verify your backend is running on port 3000
2. Check the browser console for error messages
3. Ensure the API endpoints match your backend routes

### Data Not Loading
1. Check if your database has data
2. Verify the API endpoints are working (test with Postman or curl)
3. Check browser console for JavaScript errors

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The design uses CSS Grid and Flexbox for responsive layouts
- Color scheme can be easily customized

### Functionality
- Add new entity types by updating the JavaScript functions
- Modify form fields by updating the `getFormFields` function
- Add new API endpoints by extending the `apiCall` function

## Security Notes

- This is a demo frontend for development purposes
- In production, implement proper authentication and authorization
- Add input validation and sanitization
- Use HTTPS in production environments

## Contributing

Feel free to enhance the frontend by:
- Adding more interactive features
- Implementing advanced filtering and search
- Adding data visualization charts
- Improving accessibility features
- Adding unit tests

## License

This frontend is provided as-is for educational and development purposes. 