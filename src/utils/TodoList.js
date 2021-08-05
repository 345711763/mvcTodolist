import _ from "lodash";
import {DEFAULT_CATEGORY} from "./constants";

const storagekey = "todos::data";

export default class TodoList {
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

  save() {
    window.localStorage.setItem(storagekey, JSON.stringify(this.items));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name, categoryId) {
    const item = {
      id: this.newId(),
      name,
      completed: false,
      createdAt: Date.now(),
      categoryId,
    };
    this.items.unshift(item);
    this.save();
  }

  delete(todo) {
    this.items = this.items.filter(item => item.id != todo.id);
    this.save();
  }

  deleteByCategory(categoryId) {
    this.items = this.items.filter(item => item.categoryId != categoryId);
    this.save();
  }

  toggle(todo) {
    let item = _.find(this.items, it => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  filter({ status, categoryId }) {
    return this.items.filter(item => {
      if (categoryId !== DEFAULT_CATEGORY.id && item.categoryId !== categoryId) return false;
      switch (status) {
        case "active":
          return item.completed == false;
        case "completed":
          return item.completed == true;
        case "all":
        default:
          return true;
      }
    })
  }
}
