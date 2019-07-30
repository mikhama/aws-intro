// eslint-disable-next-line import/no-extraneous-dependencies
const { DynamoDB, StepFunctions, SNS } = require('aws-sdk');
const message = require('./lib/message');
const logger = require('./lib/logger');

const documentClient = new DynamoDB.DocumentClient();
const stepFunctions = new StepFunctions();
const sns = new SNS();

const {
  STATE_MACHINE_ARN,
  ADMIN_EMAIL,
  TABLE_NAME,
  PROTOCOL,
} = process.env;

exports.getOrders = async () => {
  try {
    const { Items } = await documentClient.scan({
      TableName: TABLE_NAME,
    }).promise();

    return message(200, { orders: Items });
  } catch (error) {
    logger(error);
    return message(500, error);
  }
};

exports.placeOrder = async (event) => {
  try {
    const { name, email } = JSON.parse(event.body);

    const id = String(Date.now());
    const isCancelled = false;
    const isCompleted = false;

    await documentClient.put({
      TableName: TABLE_NAME,
      Item: {
        id,
        name,
        email,
        isCancelled,
        isCompleted,
      },
    }).promise();

    await stepFunctions.startExecution({
      stateMachineArn: STATE_MACHINE_ARN,
      input: JSON.stringify({
        endpoint: ADMIN_EMAIL,
        subject: `New order was placed by ${name}`,
        snsMessage: `${name} <${email}> just placed new order.`,
      }),
      name: `${id}__${email.replace(/@|\./g, '_')}`,
    }).promise();

    return message(200, { orderNumber: id });
  } catch (error) {
    logger(error);
    return message(500, error);
  }
};

exports.completeOrder = async (event) => {
  try {
    const { id, isCompleted } = JSON.parse(event.body);

    const { Attributes } = await documentClient.update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set isCompleted = :c',
      ExpressionAttributeValues: {
        ':c': isCompleted,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    const timestamp = Date.now();

    await stepFunctions.startExecution({
      stateMachineArn: STATE_MACHINE_ARN,
      input: JSON.stringify({
        endpoint: Attributes.email,
        subject: 'Your order was completed',
        snsMessage: `Hello, ${Attributes.name}! Your order with with number ${id} was completed!.`,
      }),
      name: `${timestamp}__${Attributes.email.replace(/@|\./g, '_')}`,
    }).promise();

    return message(200, { message: 'OK' });
  } catch (error) {
    logger(error);
    return message(500, error);
  }
};

exports.notifyUser = async (event) => {
  try {
    const { snsMessage, subject, topicArn } = event;

    return sns.publish({
      Message: snsMessage,
      Subject: subject,
      TopicArn: topicArn,
    }).promise();
  } catch (error) {
    return logger(error);
  }
};

exports.cancelOrder = async (event) => {
  try {
    const { orderNumber } = event.pathParameters;
    const { Attributes } = await documentClient.update({
      TableName: TABLE_NAME,
      Key: { id: orderNumber },
      UpdateExpression: 'set isCancelled = :c',
      ExpressionAttributeValues: {
        ':c': true,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    const timestamp = Date.now();

    await stepFunctions.startExecution({
      stateMachineArn: STATE_MACHINE_ARN,
      input: JSON.stringify({
        endpoint: Attributes.email,
        subject: `Order was cancelled by ${Attributes.name}`,
        snsMessage: `${Attributes.name} <${Attributes.email}> just cancelled the order with number: ${orderNumber}.`,
      }),
      name: `${timestamp}__${Attributes.email.replace(/@|\./g, '_')}`,
    }).promise();

    return message(200, { message: 'OK' });
  } catch (error) {
    logger(error);
    return message(500, error);
  }
};

exports.subscribeUser = async (event) => {
  const { endpoint } = event;
  const topicName = `notifyUser__${endpoint.replace(/@|\./g, '_')}`;

  const { TopicArn } = await sns.createTopic({
    Name: topicName,
  }).promise();

  const { Subscriptions } = await sns.listSubscriptionsByTopic({ TopicArn }).promise();

  if (!Subscriptions.find(item => (item.Endpoint === endpoint) && item.SubscriptionArn !== 'Deleted')) {
    await sns.subscribe({
      TopicArn,
      Endpoint: endpoint,
      Protocol: PROTOCOL,
    }).promise();
  }

  return {
    ...event,
    topicArn: TopicArn,
  };
};

exports.isUserSubscribed = async (event) => {
  const { endpoint, topicArn } = event;
  const { Subscriptions } = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();

  const isUserSubscribed = !!Subscriptions.find(
    item => (item.Endpoint === endpoint)
    && (item.TopicArn === topicArn)
    && (item.SubscriptionArn !== 'PendingConfirmation')
    && (item.SubscriptionArn !== 'Deleted'),
  );

  return {
    ...event,
    isUserSubscribed,
  };
};
