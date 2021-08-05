import React from "react";
import styled, { css } from "styled-components";
import {DEFAULT_CATEGORY, KeyCode} from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";
import Categories from "./utils/Categories";
import Tab from './components/Tab';

const Page = styled.div`
  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;
    p {
      line-height: 1;
    }
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }
    a:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  width: 100%;
  height: 130px;
  line-height: 130px;
  margin: 0;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
`;

const TodoApp = styled.section`
  background: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  label.indicator {
    position: absolute;
    top: 54px;
    left: -8px;
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }
  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
`;
const Tabs = styled.div`
  color: #5ea4f3;
  cursor: pointer;
  padding: 7px 7px 0 7px;
  border-bottom: 1px solid #e5e8ea;
`

const Input = styled.input`
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

const TodoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #ededed;
  }
  li:last-child {
    border-bottom: none;
  }
`;

class App extends React.Component {
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    selectedCategoryId: DEFAULT_CATEGORY.id,
    categories: [],
    items: [],
  };

  todos = new Todos();
  categories = new Categories();

  loadItems() {
    const { filter, selectedCategoryId } = this.state;
    this.setState({
      items: this.todos.filter({
        status: filter,
        categoryId: selectedCategoryId
      })
    });
  }

  inputText = event => {
    this.setState({ newTodo: event.target.value });
  };

  newTodoKeyDown = event => {
    const { newTodo, selectedCategoryId, filter } = this.state;
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      const title = newTodo.trim();
      if (title) {
        this.todos.add(title, selectedCategoryId);
        this.setState({ newTodo: "" });
        this.loadItems({
          status: filter,
          categoryId: selectedCategoryId
        });
      }
    }
  };

  toggle = todo => () => {
    this.todos.toggle(todo);
    this.loadItems();
  };

  update = todo => newName => {
    this.todos.rename(todo.id, newName);
    this.loadItems();
  };

  destroy = todo => () => {
    this.todos.delete(todo);
    this.loadItems();
  };

  hashchange = () => {
    const newHashPath = getHashPath();
    this.setState({
      filter: newHashPath
    }, () => this.loadItems())
  }

  loadCategories() {
    this.setState({
      categories: this.categories.items
    })
  }
  createNewCategory = () => {
    const defaultCategoryName = 'New List';
    this.categories.add(defaultCategoryName);
    this.loadCategories();
    this.selectCategory(this.categories.items[this.categories.items.length - 1].id); // select created category
  }

  selectCategory = (id) => {
    this.setState({
      selectedCategoryId: id
    }, () => this.loadItems());
  }

  updateCategory = (id, name) => {
    this.categories.rename(id, name);
    this.loadCategories();
  }
  deleteCategory = (id) => {
    const { selectedCategoryId } = this.state;
    const isDeletingSelectedCategory = selectedCategoryId === id;
    if (isDeletingSelectedCategory) {
      const indexOfDeletedCategory = this.categories.items.findIndex(item => item.id === id)
      const categoryBeforeDeletedCategory = this.categories.items[indexOfDeletedCategory - 1];
      this.selectCategory(categoryBeforeDeletedCategory !== undefined ? categoryBeforeDeletedCategory.id : DEFAULT_CATEGORY.id)
    }
    this.categories.delete(id);
    this.todos.deleteByCategory(id);
    this.loadCategories();
  }
  componentDidMount() {
    this.loadItems();
    this.loadCategories();
    window.addEventListener("hashchange", this.hashchange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  render() {
    const { newTodo, filter, items, categories, selectedCategoryId } = this.state;
    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        <TodoApp>
          <label className="indicator">❯</label>
          <Tabs>
            <Tab
              isSelected={selectedCategoryId === DEFAULT_CATEGORY.id}
              onClick={() => this.selectCategory(DEFAULT_CATEGORY.id)}
              label={DEFAULT_CATEGORY.name}
            />
            {categories.map(({name, id}) => {
              return (
                <Tab
                  key={id}
                  isSelected={selectedCategoryId === id}
                  onClick={() => this.selectCategory(id)}
                  editable={true}
                  deletable={true}
                  onDelete={(e) => {
                    e.stopPropagation()
                    this.deleteCategory(id)
                  }}
                  onUpdate={(name) => this.updateCategory(id, name)}
                  label={name}
                />
              )
            })}
            <Tab onClick={this.createNewCategory} label='+' />
          </Tabs>
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={this.inputText}
            onKeyDown={this.newTodoKeyDown}
            autoFocus={true}
          />
          <TodoList>
            {items.map((todo, index) => (
              <TodoItem
                key={index}
                todo={todo}
                filter={filter}
                onToggle={this.toggle(todo)}
                onUpdate={this.update(todo)}
                onDestroy={this.destroy(todo)}
              />
            ))}
          </TodoList>
          <Footer filter={filter} itemCount={items.length} />
        </TodoApp>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            An adaptation of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </Page>
    );
  }
}

export default App;
