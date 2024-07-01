const handler11 = (data) => {
  const processedData = data.reverse();
  return Buffer.from(processedData);
};

export default handler11;
