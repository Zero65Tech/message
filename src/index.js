const { PubSub } = require('@google-cloud/pubsub');



exports.init = ({ projectId, topic }) => {

  const pubsub = new PubSub({ projectId });
  topic = pubsub.topic(`projects/${ projectId }/topics/${ topic }`);

  exports.send = async (service, api, params) => {
    await topic.publishJSON(params, {
      "Content-Type": "application/json",
      'x-zero65-sender': process.env.npm_package_name,
      'x-zero65-receiver': service,
      'x-zero65-receiver-url': api
    });
  }

  delete exports.init;

}
