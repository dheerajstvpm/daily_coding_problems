Function Dos and Don'ts
Don't use switch in methods when there are No Common processing logic.  Here's a perfect example of where we should have 3 separate functions rather than one with a switch block in it.  First of all, we are combining 3 things and then split them up again inside the method, that's totally unnecessary.  Having 3 different methods give the code more context when someone has to read it, the reader won't need to know the implementation details of the method to see what it will do and should be able to tell by the method name.

onDuplicateBatchActionClicked(actionType: fromBatchView.DuplicateBatchAction) {
  switch (actionType) {
    case this.duplicateBatchAction.Duplicate: {
      if (this.selectedBatches.length > 1) {
        this._store.dispatch(new fromBatchSummaryActions.CreateDuplicateBatches());
      } else {
        this._store.dispatch(new fromBatchSummaryActions.CreateDuplicateBatch());
      }
      break;
    }
    case this.duplicateBatchAction.Close: {
      if (this._isAnyBatchDuplicated) {
        this._router.navigate([this._router.url]);
      } else {
        this._store.dispatch(new fromBatchSummaryActions.RowGroupSelection(false));
      }
      this._modalService.close();
      break;
    }
    case this.duplicateBatchAction.Cancel: {
      this._store.dispatch(new fromBatchSummaryActions.RowGroupSelection(false));
      this._modalService.close();
      break;
    }
    default:
      throw Error('Invalid Duplicate batch action');
  }
}
 

Constructors Dos and Don'ts
Don't make special type just for a few parameters - This hides what is actually needed for the constructor.

Don't try to generalize parameter types - In this specific case, we are trying to fit square into circle.  This is trying to use one parameter type for multiple different actions that takes different values.  The reason why we use Typescript is to have strong typing, so don't make weak types like this.

export class Rate implements Action {
  readonly type = TimecardEntryActionTypes.Rate;
  constructor(public payload: fromTimecardView.GridValueUpdate) {}
}
export interface GridValueUpdate {
  shiftId: string;
  [fieldName: string]: string|number;
}
Do use simple parameter list

export class Rate implements Action {
  readonly type = TimecardEntryActionTypes.Rate;
  constructor(public shiftId: string, public fieldName: string, public value: string|number) {}
}
If / Else Statements Dos and Don'ts
Don't put error handling code in the else block.  When you can take care of the error condition easily , get it out of the way ASAP by putting it in the if block and return or throw on the error condition.  This way, you do not have to put your normal code flow inside the if block.

This is VERY important for code readability because it changes the focus of the person who are reading the code.  Formatting the code this way makes other think that there's some significance to the if check since there are some important code in the if block.  But in reality, the check is to see if it was an error condition.  If we refactored this properly, the person reading the code could see that it's just some error check, and it is not that important.  Furthermore, the code looks so much cleaner without having a lot of code indented inside a large if block.

if (!_.isUndefined(newPermissions.can_hire) && newPermissions.can_hire !== oldPermissions.can_hire) {
// see here we are having all this code inside an if block, this is ugly and waste of space
  changeUserPermission(accessToken, studioId, projectId, hirerList.id, projectUser.id, newPermissions.can_hire, (err) => {
    if (err) {
      asyncCb(err);
    } else {
      asyncCb();
    }
  });
} else {
  asyncCb();
}
Instead we can simply write half the number of lines of code

if (_.isUndefined(newPermissions.can_hire) || newPermissions.can_hire === oldPermissions.can_hire) {
  return asyncCb(); // no permission changed detected, keep going to the next async task
}
changeUserPermission(accessToken, studioId, projectId, hirerList.id, projectUser.id, newPermissions.can_hire, (err) => {
  return (err) ? asyncCb(err) : asyncCb();
});
 

Don't use if/else when you don't have to

_.forEach(users, (user) => {
  if (_.has(user, 'status') && smartStartStatus.parse(user.status) >= smartStartStatus.SentToCrew) {
      user.showSendButton = false;
  } else {
      user.showSendButton = true;
  }
});
We don't need if else because we are straightly setting the results base on the condition we are checking.  We can use !condition Or condition === false if we want to reverse the outcome

_.forEach(users, (user) => {
    user.showSendButton = (_.has(user, 'status') && smartStartStatus.parse(user.status) >= smartStartStatus.SentToCrew) === false
});
 

Do use the Conditional (ternary) Operator when possible

if (error || !body || !body.id) {
    next(error);
} else {
    next(null, body);
}
Instead we can simply write

return (error || !body || !body.id) ? next(error) : next(null, body);
 

Don't use else when it is unnecessary

if (error) {
    logger.error(`approval & PSG submit.getPacket Error studioId: ${studioId}  projectId: ${projectId} packetId : ${packetId} ERR - ${JSON.stringify(error)}`);
    next(error, null);
} else {
    next(null, result);
}
Less line of code and less { }

if(error) {
    logger.error(`approval & PSG submit.getPacket Error studioId: ${studioId} projectId: ${projectId} packetId : ${packetId} ERR - ${JSON.stringify(error)}`);
    return next(error, null);
}
return next(null, result);

Do always return - I don't like this adding code that's not necessary, but I also don't want to keep having to check our entire code base for this issue again :)

This method doesn't need a return on the last line, but do it anyways,  such that you won't forget the return inside the if.

if (error) {
    logger.error(`approval & PSG submit.getPacket Error studioId: ${studioId}  projectId: ${projectId} packetId : ${packetId} ERR - ${JSON.stringify(error)}`);
    return next(error, null);
}
return next(null, result);
 

Do extract out complicated conditions

I think we have to start enforcing simpler conditions of 2 compares (e.g. foo && bar, foo > 1|| bar <2, etc…).  If we have to have more than 2 compares, extract that check into a function.  The name of the function should be as descriptive as possible to whatever it is testing. 

if (results.nextTasks && results.nextTasks.length === 0 && (_.has(results.packet, 'formData.fieldData.userStatus.i9Verify.date') || notRequiredI9)) { // eslint-disable-line
    hiredCrewService.hiredCrew(accessToken, studioId, projectId, packetId, results.packet.formData.fieldData, (err) => {
        if (err) {
            logger.debug(`ProjectController.createUser Error - ${JSON.stringify(err)}`);
            return next(err, null);
        }
    return next(null, null);
    });
} else {
    return next(null, null);
}
The if condition should be refactored into a function named shouldHireCrew(nextTask, i9VerifyDate, employmentStatus). If you find it difficult to name your function because of the condition is too complicated or difficult to explain, then break it down into multiple functions that has a clear indication of what they are doing.  The idea here is to make our code easier to understand.

if (shouldHireCrew(nextTask, i9VerifyDate, employmentStatus)) {
    hiredCrewService.hiredCrew(accessToken, studioId, projectId, packetId, results.packet.formData.fieldData, (err) => {
        if (err) {
            logger.debug(`ProjectController.createUser Error - ${JSON.stringify(err)}`);
            return next(err, null);
        }
    return next();
    });
}
return next();
Start taking a more Functional Approach
Don't modify the object, pass in as parameter directly

This method will modify the argument "users" because we are setting showSendButton to true/false directly.  Use _.map which will return a new array of users and return that to the caller instead.  The "users" object being modified by the forEach function is described as a "side effect" in functional programming terminology.  This is because the caller of the function will have no idea that the users object will be changed unless he look into the implementation of the method.

_.forEach() is not a Pure Function
function mapShowSendButtonOnSmartCard(users) {
  _.forEach(users, (user) => {
    if (_.has(user, 'status') &&
      smartStartStatus.parse(user.status) >= smartStartStatus.SentToCrew) {
      user.showSendButton = false;
    } else {
      user.showSendButton = true;
    }
  });
  return users;
}
_.map() is a pure function, hence no side effects
function mapShowSendButtonOnSmartCard(users) {
  return _.map(users, (user) => {
    user.showSendButton = _.has(user, 'status') && smartStartStatus.parse(user.status) >= smartStartStatus.SentToCrew);
    return user;
  })
}


Do prefer passing arguments instead of instance variables (i.e. prefer Pure Functions).  There are only a few cases where instance variable makes sense.  Situations like we have a object that encapsulates a piece of data and never expose it to be written.  Most of the time methods should simply accept data as parameters and return a value.

Check Arguments before using them
If a function is called with invalid required parameters, it shouldn't simply return null, or call the callback with an error object.  Of then, when the required parameters are null/undefined, it is caused by the caller function did something wrong and send the invalid values into the method. If we simply return null or return the callback with error object, it would take longer to find that the caller method has a bug in it.  Throwing an exception in those cases could help us find the issue during testing phase and we can fix the bug ASAP.

In the HttpUtil module on the server side, we added a method call isMissingRequiredArguments.  This method takes in any number of arguments and will return TRUE when any of the argument is undefined, null, empty strings, empty array or zero.  With that, we can simply write

if (httpUtil.isMissingRequiredArguments(accessToken, studioId, projectId, projectUserId)) {
  return httpUtil.respondWithError(res, 400, 'Missing required params');
}
Also notice the httpUtil.respondWithError method, this is simply a helper function that logs the error message and send the respond with error code and the error message.

The Only exception to this rule is when we have no control over the parameters being passed. For example, if the code is in the server side controller.  This is because our server code is essentially an API, there's no control over what the client is passing in.  If we simply throw an exception, the server would hang/timeout.  In this case, return a Bad Request, e.g. res.status(400).send('required fields are missing').

Use _.attempt on operations that could throw error
_.attempt is essentially a better try/catch.  It tries to execute the function and returns the results as if you run the function directly if it did not throw an error.  If the function throws an error, instead of blowing up as an exception, _.attempt returns an standard Javascript error object.  We can then use _.isError(results) to test if the results is an error or not to determine what we should do next.  I've noticed more than a few times where we are not using _.attempt on mappers or JSON.parse and of course, many others methods which could throw errors, and we have to be better at not throwing uncaught exceptions.  Example:

exports.updateFieldData = (req, res, next) => {
  const studioId = req.params.studioId;
  const projectId = req.params.projectId;
  const packetId = req.params.packetId;
  const accessToken = req.token.access_token;
  // const fieldData = sczMapper.mapPacketData(req.body); // This is BAD because mapPacketData could throw error when fieldData.compensation is undefined/null
  const fieldData = _.attempt(sczMapper.mapPacketData, req.body);
  if (_.isError(fieldData)) {
    return next(fieldData);
  }
  if (httpUtil.isMissingRequiredArguments(accessToken, studioId, projectId, packetId)) {
    return next(new Error('createPacket: Missing Required Parameters'));
  }
  SCZService.project.packet.formData.update(accessToken, studioId, projectId, packetId, fieldData, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json(result);
  });
};
Log Levels
There is the Log Levels we have setup sorted by severeness, from highest to lowest.

Fatal - this should mean there is no rolling back from this error programmatically and data corruption is imminent.
Error - any error that would cause a disruption to the Users' sessions.
Config Error - a specialized log level to indicate the Project Config is malformed and result in an error.  If the config is not corrected, this error will persist.
Warn - indicate that a non breaking error has occurred but the user will not be impacted.  We should capture as much details on this type of situation such that we can fix it.
Config Warn - specialized config related warnings where it doesn't break the system but it is still an anomaly.
Info - this is not an error but simply help administrators to see the system is operating correctly. (e.g. "server listening on 127.0.0.1:80", "Connection to Redis established" or "Weird 3rd Party service handshake completed" are good Info messages)
Debug - this will contain verbose info on what the system is doing such that in case of an issue, we could lower the log level to debug and see what the system is doing in real time.  This log level should only be turned on only when necessary. (e.g. "Retrieving Packets for ProjectUser: 123", "Start processing 15 packets", "Processing packet: 1234 completed", "Sending update of 15 packets to SCZ", are good Debug messages)
Middleware
Currently (as of March 2017) our backend code employs Three main middleware:  Authorize Request, Route handler and Error Handler. 

The Authorize Request middleware makes sure the request has the JWT and validates it and persist the user session info into the request object.

The Route Handler middleware (or layer), is where all the logic for performing CRUD operations on the data and send that data or operation successful response back to the client side.

The Error Handler middleware, is where we Log and return the error response to client side.

The Error Handling middleware
For this middleware to do its job, we have to pass in a standard Javascript Error object or an http.IncomingMessage.  Every exported function at the controller level should use (req, res, next) as the function signature, before we don't include next argument is because we don't use it.  The next argument is a method call to trigger the next middleware to run and in this case, this is our Error Handling middleware.  If there's an error, we can simply handle it like:

exports.someFunction = (req, res, next) => {
  service.apiCall(req.foo, (err, results) => {
    if (err) {
      return next(err);
    }
    // other useful things to do to the results
    ...
    res.send(results);
  }
}
The InnerError Object
With the innerError, we could nest lower level error into the error object such that we can Log and Report that to the client side.  In most cases, we will not have to do this as most error can be dealt with by handing them over to the controller and then from there to the error handling middleware. for example:

function example(foo, bar, cb) {
  if (isMissingRequiredArguments(foo, bar)) {
    const err = new Error('missing required parameter');
    return cb(err);
  }
  // making a call to a service
  crappySoapService.retrieveSomeDataThatIsProbablyCrap(foo, bar, (err, results) => {
    if (err) {
      return cb(err);
    }
    if (results.specialData === 'crap') {
      const specialError = new Error('crappSoapService.retrieveSomeDataThatIsProbablyCrap has returned some bad data');
      specialError.innerError(results.specialData); //This specialData must not be self referencing because we use JSON.stringify() to serialize that data
      return cb(specialError);
    }
  }
  // other processing on the results...
  return cb(null, results);
}

Data Validation
There were some mis-information from the beginning of the Time Trax project on how to do data validation.  I've seen validation done only on the UI side and the backend "trusts" the data input from UI and writes that to the database without any more validation.  Other times, same validation is run on multiple different layers with different logic.  The following is trying to give a general guidelines on data validation on each layer.

User Interface
On the UI layer, the goal of validating data is to provide user immediate feedback to whether they have entered data the system expects.  And the user has made a mistake, they can correct it with waiting for a full post back from the server side.  Hence, we want to keep data validation on the client side to be quick and simple.  Things like required fields, text string lenght limits, or limit data between a range, and etc... should be done at the UI layer.

Pro Tip: Do not overdo data validation on the UI, because: SERVER LAYERS SHOULD NEVER TRUST ANY DATA COMING FROM THE CLIENT.

API
The goal for data validation at the API layer is to first ensure the request can be completed.  Each API call should have a set of required parameters, e.g. the ShiftId the user trieds to modify, the value the user wanted to modify to, etc... If any of these values are invalid or missing, we should immediately return a 400 Bad Request.  In a perfect world, the UI requests should never generate a 400 Bad request in Production.  The UI should have made sure user has input all the required fields and other data before allowing the request to be submitted.  These 400 Bad Request errors should be caught in Development and QA.

Pro Tip:  Like any function/method, the first thing it does should always be validation of parameters.  Hence, every API request handler should validate the user input first before doing anything.  (Technically, Authentication is the first thing API should check, but that is usually abstracted into the API's framework).



JWT
If you have never worked with JWT, please take 30mins or so Googling it to get fimilar with the concept and why it is useful.  Smart Time Mobile is rebuild to rely on JWT as the way to keep track of user session on the client side.  Smart Time has refactored to use JWT for its API but hasn't completly converted the UI to use JWT as its session.

Key Concepts
JWT is not encrypted, therefore, Do No Ever put sensitive info inside JWT as anyone can read it.
Content encoded inside a JWT is only trust worthy if we validate the JWT using the secret.
We encoded user's UserId, Username (email), first and last name in the JWT.  Once we validated the JWT on our API layer, we can safely use these information without worry that a hacker might have changed it.  However, if we were to pass the userId or email via the request header, query string or body, anyone can modify that data making our API vulnerable to attack.


Anti Patterns
Fake Reuse
Using the same function to handle "Similar" things - For example, in the Batch Browse page, where we use a Single onActionMenuClicked function to handle different action menu buttons click.

onActionMenuClicked(actionType: fromBatchView.BatchSummaryActions) {
    switch (actionType) {
      case fromBatchView.BatchSummaryActions.Submit: {
        this._store.dispatch(OpenNgbModal(this._selectPaymasterModalName));
        break;
      }
      case fromBatchView.BatchSummaryActions.Duplicate: {
        let config = {};
        this._store.dispatch(fromBatchSummaryActions.DuplicateBatches(this.selectedBatches));
        if (this.selectedBatches.length > 1) {
          config = {...this.modalConfigs, windowClass: 'duplicate-multiple-batch'};
          this._modalService.open(this._duplicateMultipleBatch, config);
        } else {
          config = {...this.modalConfigs, windowClass: 'duplicate-batch'};
          this._modalService.open(this._duplicateBatch, config);
        }
        break;
      }
      case fromBatchView.BatchSummaryActions.Delete: {
        this._modalService.open(this._deleteBatches);
        break;
      }
      case fromBatchView.BatchSummaryActions.TimecardReport: {
        this._store.dispatch(fromBatchUIActions.OpenTimecardReportPanel());
        break;
      }
      default:
        throw  Error('Invalid Batch Action');
    }
  }
On the template, all actions on the action menu will call the onActionMenuClick method on the template.  But this function uses a Switch block to split up the actions again. There is absolutely no reuse at all.  This is an example Fake/Bad Reuse.  Rather than having each action menu button call the same function, call different functions.  If you see this in the code, and there are no refactor card opened for it, please report it with a new Refactor Card.  Please use label "Technical_Debt" on the refactor card.
