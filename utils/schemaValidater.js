const schemaValidater = (validationError) => {
  const requiredFields = Object.keys(validationError.errors).reverse();
  const errorMessage = `Please fill the required fields: ${requiredFields.join(
    ", "
  )}`;

  return errorMessage;
};

module.exports = { schemaValidater };
