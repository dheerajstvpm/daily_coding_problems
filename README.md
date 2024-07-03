Use "pnpm i" to install dependencies.
Use "pnpm start -- *filename*" to execute a ts file.


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

Do always return

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


Do prefer passing arguments instead of instance variables (i.e. prefer Pure Functions).  

There are only a few cases where instance variable makes sense.  Situations like we have a object that encapsulates a piece of data and never expose it to be written.  Most of the time methods should simply accept data as parameters and return a value.

Check Arguments before using them

If a function is called with invalid required parameters, it shouldn't simply return null, or call the callback with an error object.  Of then, when the required parameters are null/undefined, it is caused by the caller function did something wrong and send the invalid values into the method. If we simply return null or return the callback with error object, it would take longer to find that the caller method has a bug in it.  Throwing an exception in those cases could help us find the issue during testing phase and we can fix the bug ASAP.


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
