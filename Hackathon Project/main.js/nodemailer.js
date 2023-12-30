const express = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "cred.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // create client instance of auth 
    const client = await auth.getClient();

    const spreadsheetId = "1nIvS4DujCQeBvQwt1nlGYb-UnugCsxconpsC1aNguU0";

    // instance of google sheets api
    const googleSheets = google.sheets({ version: "v4", auth: client });

    /* Get metadata about spreadsheet I learned from this method/function used in a yt video, and updated it
     for my purposes */
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    // Get user emails from spreadsheet
    const getEmails = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "form data!B:B"
    });

    const emails = getEmails.data.values;
    if (!emails) {
      console.log('No emails found in the specified range.');
      return res.send('No emails found.');
    }

    // Get user messages from the spreadsheet
    const getMessages = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "form data!E:E"
    });

    const messages = getMessages.data.values;
    if (!messages) {
      console.log('No messages found in the specified range.');
      return res.send('No messages found.');
    }
  // get user gmail subjects from spreadsheet
    const getSubjects = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "form data!D:D"
    });

    const subjects = getSubjects.data.values;
    if (!subjects) {
      console.log('No subjects found in the specified range.');
      return res.send('No subjects found.');
    }

    // get  gmail times from spreadsheet
    const getDates = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "form data!C:C"
    });

    const Dates = getDates.data.values;
    if (!subjects) {
      console.log('No date found in the specified range.');
      return res.send('No date found.');
    }



    // Check to see both emails and messages are arrays of the same length
    if (!Array.isArray(emails) || !Array.isArray(messages) || emails.length !== messages.length) {
      throw new Error("Invalid input. Both 'emails' and 'messages' must be arrays of the same length.");
    }

    // Convert 2D arrays to 1D arrays for making it easier to read
    const formattedEmails = emails.map(entry => entry[0]);
    const formattedMessages = messages.map(entry => entry[0]);

    // Sending the emails
    await run(formattedEmails, formattedMessages, subjects, Dates);

    res.send({ emails: formattedEmails, messages: formattedMessages, subjects, Dates});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function run(emails, messages, subjects, Dates) {
  const scheduledDate = new Date();

  // Loop through each email
  for (let i = 1; i < emails.length; i++) {
    console.log(Dates[i]);
    const emailScheduledDate = new Date(Dates[i]);

    // Set the time to 8:30 PM for each scheduled date (for demo video)
    emailScheduledDate.setHours(21, 44, 0, 0);


    console.log(`Scheduling email for ${emails[i]} at ${emailScheduledDate}`);

    // Schedule the email at the specified date and time
    schedule.scheduleJob(emailScheduledDate, async function () {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'calendarappprogram@gmail.com',
          pass: 'xwkf yrpq achw ebqk',
        }
      });

      try {
        await transporter.sendMail({
          from: '"Calendar App" <calendarapprogram@gmail.com>',
          to: emails[i],
          subject: subjects[i],
          text: messages[i]
        });

        console.log(`Email for ${emails[i]} sent successfully at ${emailScheduledDate}`);
      } catch (error) {
        console.error(`Error sending email for ${emails[i]} at ${emailScheduledDate}:`, error);
      }
    });
  }
}


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


/*
const express = require('express');
const {google} = require("googleapis");
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer"); 
const schedule = require('node-schedule');


const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "cred.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

// create client instance of auth 
const client = await auth.getClient();

const spreadsheetId = "10qhcDyQcmq2j6LqQBefsBBB4TDIJ9Pp-3SAu81vuV1c";

// instance of google sheets api
const googleSheets = google.sheets({version: "v4", auth: client});

 // Get metadata about spreadsheet
const metaData = await googleSheets.spreadsheets.get({
  auth,
  spreadsheetId,
});

// Read emails from spreadsheet
const getEmails = await googleSheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  range: "Sheet1!A:A"
});

// res.send(getEmails.data.values);

const emails = getEmails.data.values;
if (!emails) {
  console.log('No emails found in the specified range.');
 // res.send('No emails found.');
  return;
}
// read messages from the spreadsheet
const getMessages = await googleSheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  range: "Sheet1!B:B"
});


const messages = getMessages.data.values;
if (!messages) {
  console.log('No messages found in the specified range.');
//  res.send('No messages found.');
  return;
}
res.send({emails, messages});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  run(emails, messages).catch(error => console.error(error));

  async function run(emails, messages) {
    console.log("sending emails");
  
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'calendarappprogram@gmail.com',
        pass: 'xwkf yrpq achw ebqk',
      }
    });
  
    // Ensure both emails and messages are arrays of the same length
    if (!Array.isArray(emails) || !Array.isArray(messages) || emails.length !== messages.length) {
      throw new Error("Invalid input. Both 'emails' and 'messages' must be arrays of the same length.");
    }
  
    // Loop through each recipient
    for (let i = 0; i < emails.length; i++) {
      try {
        await transporter.sendMail({
          from: '"Calendar App" <calendarapprogram@gmail.com>',
          to: '"' + emails[i] + '"',
          subject: "Subject of the email",
          text: '"' + messages[i] + '"'
        });
  
        console.log(`Email ${i + 1} sent successfully`);
      } catch (error) {
        console.error(`Error sending email ${i + 1}:`, error);
      }
    }
  }

})


/*
async function run(emails, messages) {
  console.log("sending emails");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'calendarappprogram@gmail.com',
      pass: 'xwkf yrpq achw ebqk',
    }
  });

  // Ensure both emails and messages are arrays of the same length
  if (!Array.isArray(emails) || !Array.isArray(messages) || emails.length !== messages.length) {
    throw new Error("Invalid input. Both 'emails' and 'messages' must be arrays of the same length.");
  }

  // Loop through each recipient
  for (let i = 0; i < emails.length; i++) {
    try {
      await transporter.sendMail({
        from: '"Calendar App" <calendarapprogram@gmail.com>',
        to: '"' + emails[i] + '"',
        subject: "Subject of the email",
        text: '"' + messages[i] + '"'
      });

      console.log(`Email ${i + 1} sent successfully`);
    } catch (error) {
      console.error(`Error sending email ${i + 1}:`, error);
    }
  }
}

// Example usage with arrays of emails and messages
const sampleEmails = ['recipient1@example.com', 'recipient2@example.com'];
const sampleMessages = ['Message for recipient 1', 'Message for recipient 2'];

run(emails, messages).catch(error => console.error(error));


/* THIS SECTION OF CODE IS WORKING UNTIL RUN().CATCH(ERROR)
   async function run(emails, messages) {
  console.log("sending email");

  const transporter = nodemailer.createTransport({   // configuring smpt server
     host: "smtp.gmail.com",
     port: 465, 
     secure: true,
     auth: {
        user: 'calendarappprogram@gmail.com',
        pass: 'xwkf yrpq achw ebqk',
     }
  })

 await transporter.sendMail ({
from: '"Calendar App" <calendarapprogram@gmail.com>',
to: '"' + emails + '"',
subject: "hey is this wokring im tired",
text: '"' + messages + '"'
})
console.log("Email sent successfully");
};
run().catch(error => console.error(error));


/*

 app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "cred.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

 // create client instance of auth 
  const client = await auth.getClient();

  const spreadsheetId = "10qhcDyQcmq2j6LqQBefsBBB4TDIJ9Pp-3SAu81vuV1c";

  // instance of google sheets api
const googleSheets = google.sheets({version: "v4", auth: client});

   // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read emails from spreadsheet
  const getEmails = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A"
  });
  
  // res.send(getEmails.data.values);

  const emails = getEmails.data.values;
  if (!emails) {
    console.log('No emails found in the specified range.');
   // res.send('No emails found.');
    return;
  }
// read messages from the spreadsheet
  const getMessages = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!B:B"
  });
  

  const messages = getMessages.data.values;
  if (!messages) {
    console.log('No messages found in the specified range.');
  //  res.send('No messages found.');
    return;
  }
  res.send({emails, messages});

  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


   run(); 
  run().catch(error => console.error(error));

   
});

async function run() {
  console.log("sending email");

  const transporter = nodemailer.createTransport({   // configuring smpt server
     host: "smtp.gmail.com",
     port: 465, 
     secure: true,
     auth: {
        user: 'calendarappprogram@gmail.com',
        pass: 'xwkf yrpq achw ebqk', // AUTO-GENERATED PASSWORD USING 2-STEP VERIFICATION
     }
  })

 await transporter.sendMail ({
from: '"Calendar App" <calendarapprogram@gmail.com>', 
to: "munirharmain@gmail.com", // 
subject: "hey is this wokring im tired",
text: "its working"
})
console.log("Email sent successfully");
};
 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*generating emails , and sending them to users. 
async function sendMessages(emailsAndMessages) {
   const transporter = nodemailer.createTransport({   // configuring smpt server
      host: "smtp.gmail.com",
      post: 465, 
      secure: true,
      auth: {
         user: 'calendarappprogram@gmail.com',
         pass: 'calendarapp1233',
      }
   })

  // const scheduledJob = schedule.scheduleJob('3 16 * * *   '   , function () {(
    for (const { email, message } of emailsAndMessages) {
      let mailOptions = {
        from: 'calendarappprogram@gmail.com',
        to: email,
        subject: 'reminder from app program',
        text: message,
      };


      /*const mailOptions = {
        from: 'calendarappprogram@gmail.com',
        to: 'munirharmain@gmail.com',
        subject: 'Scheduled Email',
        text: 'This email was scheduled!',
      };
    

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    
    }
    
  }



    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

  /*const transporter = nodemailer.createTransport ({
      from: '"Harmain" <munirharmain@gmail.com>',
      to: "munirharmain@gmail.com", 
      subject: "Daily Reminder",
      text: `
      You have 2 days left for your assignment',
      `,
     // html:  <h1> is this working </h1> // html body
  })
   
   }

// }) ();

/*let transporter = nodemailer.createTransport({
   host: "smtp.ethereal.email",
   post: 587, 
   secure: false,
   auth: {
      user: testAccount.user,
      pass: testAccount.pass,

      PASSWORD : shcr cyei uidh eufg
   }
})
*/