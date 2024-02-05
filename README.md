

# Reminder Requests

**Reminder Web App**
https://devpost.com/software/reminder-requests-app

## About the Project

This project is a web application designed to streamline the process of sending reminder emails to users. Leveraging the Google Sheets API, users can schedule emails based on a specified date they input. The user simply provides their message along with the desired delivery date, and the system automatically dispatches the email on the morning of the scheduled date. Additionally, a calendar feature offers a visual representation of dates throughout the year for user convenience.

### Technologies Used

- **Google Sheets API**
- **Node.js**
- **HTML, CSS, JavaScript**

## Front-End

The front-end of the application, developed using HTML and CSS, features a user-friendly form. This form allows users to input the date for their reminders, compose messages, and specify subjects. The inclusion of a visually appealing calendar aids users in selecting dates for their reminders.

## Back-End (Node.JS, Google Sheets API)

The back-end functionality has been created by the Google Sheets API, which served as a database to store the HTML form data. A Node.js file reads this data and utilizes the Node Scheduler library. This library simplifies the process of scheduling and sending reminder emails to users.

---

