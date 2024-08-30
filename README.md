
# Reminder Requests

[**Reminder Web App on Devpost**](https://devpost.com/software/reminder-requests-app)

## About the Project

**Reminder Requests** is a web application designed to simplify the process of scheduling and sending reminder emails. By integrating the Google Sheets API, users can effortlessly schedule emails to be sent on a specific date of their choice. Once the user inputs their message and desired delivery date, the system automatically sends the email on the morning of the scheduled day. The application also includes a calendar feature, providing a visual representation of dates throughout the year for enhanced user convenience.

### Key Features

- **Automated Email Scheduling:** Users can schedule reminder emails that are automatically sent on the chosen date.
- **Calendar Integration:** A visually intuitive calendar helps users pick dates easily.
- **User-Friendly Interface:** A simple form allows users to input their email details with ease.

### Technologies Used

- **Front-End:** HTML, CSS, JavaScript
- **Back-End:** Node.js, Google Sheets API

## Front-End

The front-end of the application is crafted with HTML and CSS, providing a clean and user-friendly interface. Users can input the date for their reminders, compose their messages, and specify email subjects. The integrated calendar enhances the user experience by making date selection straightforward and visually engaging.

## Back-End

The back-end of the application is powered by Node.js and the Google Sheets API. The Google Sheets API serves as the database for storing user inputs from the HTML form. Node.js, in conjunction with the Node Scheduler library, manages the scheduling and sending of reminder emails, ensuring they are dispatched at the correct time.

