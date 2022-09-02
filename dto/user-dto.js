// из аргумента model берутся указанные поля
module.exports = class UserDto {
  constructor(model) {
    this.email = model.email;
    this.uid = model.uid;
    this.role = model.role
  }
};
