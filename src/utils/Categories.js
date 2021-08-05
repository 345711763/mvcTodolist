import _ from "lodash";
const storagekey = "categories::data";

class Categories {
  constructor() {
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  save() {
    window.localStorage.setItem(storagekey, JSON.stringify(this.items));
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  add(name) {
    const item = {
      id: this.newId(),
      name,
    };
    this.items.push(item);
    this.save();
  }

  delete(id) {
    this.items = this.items.filter(item => item.id != id);
    this.save();
  }
}


export default Categories;
