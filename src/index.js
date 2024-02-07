const PROJECT_ID = {
  alpha:   "synergybyte-test",
  beta:    "synergybyte-test",
  gamma:   "synergybyte-gamma",
  offline: "synergybyte-offline",
  prod:    "synergybyte-prod"
}[process.env.NODE_ENV];



let pubsub = new (require('@google-cloud/pubsub').PubSub)();

class PubSub {

  constructor(topic) {
    this.topic = pubsub.topic(`projects/${ PROJECT_ID }/topics/${ topic }`);
  }

  message(req) {
    return {
      data: JSON.parse(Buffer.from(req.body.message.data, 'base64').toString('utf-8')),
      attributes: req.body.message.attributes
    }
  }

  publish(req, data, attributes) {
    if(!attributes && req && req.headers && req.headers['x-cloud-trace-context']) {
      let traceContext = req.headers['x-cloud-trace-context'].split(/[/;]/);
      attributes = {
        'logging.googleapis.com/trace':        `projects/${ PROJECT_ID }/traces/${ traceContext[0] }`,
        'logging.googleapis.com/spanId':        traceContext[1],
        'logging.googleapis.com/trace_sampled': traceContext[2] == 'o=1' ? 'true' : 'false'
      }
    }
    return this.topic.publish(Buffer.from(JSON.stringify(data)), attributes);
  }

}

module.exports = PubSub;