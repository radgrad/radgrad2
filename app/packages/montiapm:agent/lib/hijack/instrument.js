var logger = Npm.require('debug')('kadira:hijack:instrument');

var instrumented = false;
Kadira._startInstrumenting = function(callback) {
  if(instrumented) {
    callback();
    return;
  }

  instrumented = true;
  wrapStringifyDDP()
  MeteorX.onReady(function() {
    //instrumenting session
    wrapServer(MeteorX.Server.prototype);
    wrapSession(MeteorX.Session.prototype);
    wrapSubscription(MeteorX.Subscription.prototype);

    if(MeteorX.MongoOplogDriver) {
      wrapOplogObserveDriver(MeteorX.MongoOplogDriver.prototype);
    }

    if(MeteorX.MongoPollingDriver) {
      wrapPollingObserveDriver(MeteorX.MongoPollingDriver.prototype);
    }

    if(MeteorX.Multiplexer) {
      wrapMultiplexer(MeteorX.Multiplexer.prototype);
    }

    wrapForCountingObservers();
    hijackDBOps();

    setLabels();
    callback();
  });
};

// We need to instrument this rightaway and it's okay
// One reason for this is to call `setLables()` function
// Otherwise, CPU profile can't see all our custom labeling
Kadira._startInstrumenting(function() {
  console.log('Monti APM: completed instrumenting the app')
});