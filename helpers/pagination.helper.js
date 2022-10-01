module.exports.pagintaion = async (req, model) => {
    
  const page = req.query.page;
  const limit = req.query.limit;

  //типа вообщем должно быть столько постов
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // колличество постов на page
  const modelPag = await model.findAll({});
  const usersOnPage = modelPag.slice(startIndex, endIndex);
  return usersOnPage
};
