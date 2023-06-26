const resolveHandler = (resolve) => {
  return (response) => {
    resolve([response.data, response]);
  };
};

export default resolveHandler;
