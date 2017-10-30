import React, { Component } from "react";
import styles from "./styles.css";
import { OutlineModal } from "boron";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import api from "../utils/api";

class App extends Component {
  constructor() {
    super();

    this.state = {
      valueInputTask: "",
      tasks: [],
      selectedTask: {},
      isUpdating: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectedTask = this.handleSelectedTask.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleSubmitUpdateTask = this.handleSubmitUpdateTask.bind(this);
  }

  async componentDidMount() {
    const tasks = await api.tasks.getList();
    this.setState({
      tasks
    });
  }

  render() {
    let { valueInputTask, tasks, selectedTask, isUpdating } = this.state;
    return (
      <div>
        <div className={`${styles.jumbotronLevel} jumbotron`}>
          <div className="container">
            <h1 className="display-3">To-Do App!</h1>
            <p className="lead">
              This is a simple todo list app, it display a list of task with
              status and allow us to delete, update, create and read them!
            </p>
            <h5 className={`${styles.titleSearch}`}>Add a new item</h5>
            <div className={`${styles.formContainer}`}>
              <form onSubmit={this.handleSubmit}>
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a new task here..."
                    value={valueInputTask || ""}
                    onChange={e =>
                      this.setState({ valueInputTask: e.target.value })}
                  />
                </div>
                <p className="lead">
                  <button
                    className={`${styles.addNew} btn btn-primary btn-lg`}
                    type="submit"
                  >
                    add
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="container">
          <header>
            <h4>Here you've all your tasks!</h4>
            <ul className={`${styles.itemsContainer} card`}>
              <ReactCSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={800}
                transitionLeaveTimeout={500}
                transitionAppearTimeout={500}
                transitionAppear={true}
              >
                {tasks &&
                  tasks.map(task => (
                    <li
                      id={task._id}
                      onClick={this.handleSelectedTask}
                      className={task.completed ? styles.done : styles.pending}
                      key={task._id}
                    >
                      {task.title}
                    </li>
                  ))}
              </ReactCSSTransitionGroup>
            </ul>
            <OutlineModal
              onHide={this.hideModal}
              className={`${styles.modalContainer}`}
              ref="modal"
            >
              <div className="container">
                <form
                  className={`${styles.updateInput} form-control`}
                  onSubmit={this.handleSubmitUpdateTask}
                >
                  <h2>
                    <input
                      type="text"
                      disabled={!isUpdating}
                      className={`${styles.inputTitle}`}
                      placeholder="Enter a new task here..."
                      ref="newValue"
                      value={(selectedTask && selectedTask.title) || ""}
                      onChange={e =>
                        this.setState({
                          selectedTask: {
                            ...selectedTask,
                            title: e.target.value
                          }
                        })}
                    />
                    <i
                      onClick={() => this.setState({ isUpdating: !isUpdating })}
                      className={`${styles.updateIcon} fa fa-pencil`}
                      aria-hidden="true"
                    />
                  </h2>

                  <div className="checkbox">
                    
                    <label>
                      <input
                        type="checkbox"
                        disabled={!isUpdating}
                        ref="completed"
                        value={
                          (selectedTask && selectedTask.completed) || false
                        }
                        onChange={() =>
                          this.setState({
                            selectedTask: {
                              ...selectedTask,
                              completed: !selectedTask.completed
                            }
                          })}
                        checked={
                          (selectedTask && selectedTask.completed) || false
                        }
                      />Completed
                    </label>
                  </div>
                  {isUpdating && (
                    <button type="submit" style={{backgroundColor: '#1ea586'}} className={`${styles.modalButtons}`}>
                      Update
                    </button>
                  )}
                </form>
                <button
                  className={`${styles.modalButtons}`}
                  onClick={this.handleDeleteTask}
                >
                  Delete
                </button>
                <button
                  className={`${styles.modalButtons}`}
                  onClick={this.hideModal}
                  style={{backgroundColor:'#1e5aa5'}}
                >
                  Close
                </button>
              </div>
            </OutlineModal>
          </header>
        </div>
      </div>
    );
  }

  async handleSubmitUpdateTask(e) {
    e.preventDefault();
    let { selectedTask, tasks } = this.state;

    console.log(selectedTask);

    const response = await api.tasks.updateTask({ ...selectedTask });
    console.log(response);
    if (response.ok === 1) {
      const newTasks = tasks.map(task => {
        if (task._id === selectedTask._id) {
          return { ...selectedTask };
        } else {
          return { ...task };
        }
      });

      this.setState(
        {
          tasks: newTasks
        },
        () => {
          this.hideModal();
        }
      );
    }
  }

  async handleDeleteTask() {
    let { selectedTask } = this.state;
    const response = await api.tasks.deleteTask(selectedTask._id);
    console.log(response);
    if (response.n > 0) {
      //if deleted
      this.setState(
        {
          tasks: this.state.tasks.filter(task => task._id !== selectedTask._id)
        },
        () => {
          this.hideModal();
        }
      );
    }
  }
  handleSelectedTask(e) {
    const id = e.target.id;
    this.setState(
      {
        selectedTask: this.state.tasks.find(task => task._id === id)
      },
      () => {
        this.refs.modal.show();
      }
    );
  }
  async handleSubmit(e) {
    let { valueInputTask } = this.state;
    e.preventDefault();

    let response = await api.tasks.addNew({
      title: valueInputTask,
      completed: true,
      createdAt: Date.now()
    });
    console.log(response);

    this.setState({
      tasks: this.state.tasks.concat(response)
    });
  }

  hideModal() {
    this.refs.modal.hide();
    this.setState({
      selectedTask: {},
      isUpdating: false
    });
  }

  callback(event) {
    console.log(event);
  }
}

export default App;
