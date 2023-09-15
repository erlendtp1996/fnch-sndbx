//dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require("axios");
const cors = require('cors');

//read command line to accept optional token
const testingToken = process.argv[2];

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000']
}));

// serve up production assets
app.use(express.static('fnch-sndbx/build'));

/**
 * 
 * 
 * HELPER FUNCTIONS
 * 
 * 
 */

const EXTERNAL_SERVICE_DOMAIN = "https://sandbox.tryfinch.com/";
function requestHasValidCookie(request) {
  if (request.cookies.sndbx_at) {
    return true;
  } else if (testingToken) {
    return true;
  }
  return false;
}

function getToken(request) {
  if (request.cookies.sndbx_at) {
    return request.cookies.sndbx_at;
  } else if (testingToken) {
    return testingToken;
  }
}

function handleUnauthorized(res) {
  res.status(401).send("Unauthorized");
}

function handleServiceError(res) {
  res.status(500).send("Error with external service. Please contact support");
}


/** 
 * 
 * 
 * BEGIN ENDPOINTS
 * 
 * 
 */

/** 
 *  COMPANY
 */
app.get('/api/company', async (req, res) => {
  if (requestHasValidCookie(req)) {

    var config = {
      method: 'get',
      url: `${EXTERNAL_SERVICE_DOMAIN}/api/employer/company`,
      headers: {
        'Authorization': `Bearer ${getToken(req)}`
      }
    };

    try {
      var company = await axios(config)
      res.status(200).json(company.data);
    } catch {
      handleServiceError(res);
    }

  } else {
    handleUnauthorized(res);
  }
});

/** 
 *  PAYMENT
 */
app.get('/api/payment', async (req, res) => {
  if (requestHasValidCookie(req)) {
    var config = {
      method: 'get',
      url: `${EXTERNAL_SERVICE_DOMAIN}/api/employer/payment?start_date=2023-08-16&end_date=2023-08-31`,
      headers: {
        'Authorization': `Bearer ${getToken(req)}`
      }
    };

    try {
      var payment = await axios(config);
      res.status(200).json(payment.data);
    } catch {
      handleServiceError(res);
    }

  } else {
    handleUnauthorized(res);
  }
});

/** 
 *  DIRECTORY
 */
app.get('/api/directory', async (req, res) => {
  if (requestHasValidCookie(req)) {
    var config = {
      method: 'get',
      url: `${EXTERNAL_SERVICE_DOMAIN}/api/employer/directory`,
      headers: {
        'Authorization': `Bearer ${getToken(req)}`
      }
    };
    
    try {
      var directory = await axios(config);
      res.status(200).json(directory.data);
    } catch {
      handleServiceError(res);
    }

  } else {
    handleUnauthorized(res);
  }
});

/** 
 *  INDIVIDUAL
 */
app.get('/api/individual/:id', async (req, res) => {
  if (requestHasValidCookie(req)) {
    var config = {
      method: 'post',
      url: `${EXTERNAL_SERVICE_DOMAIN}/api/employer/individual`,
      headers: {
        'Authorization': `Bearer ${getToken(req)}`
      },
      data: {
        "requests": [
          {
            "individual_id": req.params.id
          }
        ]
      }
    }

    try {
      var individual = await axios(config)
      res.status(200).json(individual.data.responses[0].body);
    } catch {
      handleServiceError(res);
    }

  } else {
    handleUnauthorized(res);
  }
});

/** 
 *  INDIVIDUAL EMPLOYEMENT
 */
app.get('/api/individual/:id/employment', async (req, res) => {
  if (requestHasValidCookie(req)) {
    var config = {
      method: 'post',
      url: `${EXTERNAL_SERVICE_DOMAIN}/api/employer/employment`,
      headers: {
        'Authorization': `Bearer ${getToken(req)}`
      },
      data: {
        "requests": [
          {
            "individual_id": req.params.id
          }
        ]
      }
    }
   
    try {
      var employment = await axios(config);
      res.status(200).json(employment.data.responses[0].body);
    } catch {
      handleServiceError(res);
    }

  } else {
    handleUnauthorized(res);
  }
});

/** 
 *  DEFAULT
 */
app.get('/home', async (req, res) => {
  if (!requestHasValidCookie(req)) {

    var data = JSON.stringify({
      "products": [
        "company",
        "directory",
        "individual",
        "employment"
      ],
      "employee_size": 27,
      "provider_id": "bob"
    });

    var config = {
      method: 'post',
      url: 'https://sandbox.tryfinch.com/api/sandbox/create',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    var initData = await axios(config);
    res.cookie('sndbx_at', initData.data.access_token, {
      maxAge: 86400,
      secure: true,
      httpOnly: true,
    });
  }
  res.sendFile(path.resolve(__dirname, 'fnch-sndbx', 'build', 'index.html'));
});



/**
 * 
 * 
 * 
 * RUN SERVER
 * 
 * 
 */
const PORT = process.env.PORT || 5000;
console.log('server started on port:', PORT);
app.listen(PORT);