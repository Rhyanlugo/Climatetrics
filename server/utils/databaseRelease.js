const doRelease = (connection) => {
  connection.release((err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

export default doRelease;
