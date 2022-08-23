module.exports = class UserDto {
  // типа из подставленной модели изымается поле email и password
  constructor(model) {
    this.email = model.email;
    this.uid = model.uid;
  }
};
