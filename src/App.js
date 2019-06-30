import React, {Component} from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./App.css";

class Start extends Component {
    render() {
        const {todoCount, done} = this.props;
        return (
            <span>{done} / {todoCount}</span>
        )
    }
}

class Todo extends Component {
    render() {
        const {todo, onChangleTodo} = this.props;
        const style = this.props.todo.done ? {
            textDecoration: 'line-through',
            color: 'red'
        } : {};
        return (
            <div>
                <label style={style}>
                    <input className={''} type="checkbox" onChange={() => onChangleTodo(todo.done)}
                           checked={todo.done}/>
                    &nbsp; {todo.name}
                </label>
            </div>
        )
    }
}

class NewTodoForm extends Component {
    state = {
        newTodo: ''
    };

    inputTodoNew(newTodo) {
        this.setState({
            newTodo: newTodo
        })
    };

    checkInputTodoNew() {
        if (this.state.newTodo === "") {
            return false;
        }
        return true;
    }

    render() {
        const {onAddNewTodo} = this.props;
        return (
            <div>
                <input type="text" placeholder={"Add new todo"} className={'form-control'} value={this.state.newTodo}
                       name={"newTodo"}
                       onChange={event => this.inputTodoNew(event.target.value)}
                />
                <input type="submit" className={"btn btn-primary btn-block"} onClick={() => {
                    if (this.checkInputTodoNew() === false) {
                        alert("New Todo ko được để rỗng ");
                    } else {
                        onAddNewTodo({
                            name: this.state.newTodo,
                            done: false
                        });
                        this.setState({
                            newTodo: ""
                        })
                    }
                }
                }/>
            </div>
        )
    }
}

export default class App extends Component {

    state = {
        todos: [],
        loading: true
    };

    async getTodos() {
        this.setState({loading: true});
        const todos = await fetch('https://todos.sphinx-demo.com/todos').then(res => res.json());
        this.setState({todos: todos, loading: false});
    }

    async postTodo(newTodo) {
        await fetch("https://todos.sphinx-demo.com/todos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo)
        })
    }
    async deleteTodo(id) {
        await fetch("https://todos.sphinx-demo.com/todos/" + id, {
            method: "DELETE",
        });
        await this.getTodos();
    };
    async updateTodo(id) {
       await fetch("https://todos.sphinx-demo.com/todos/" + id, {
            method: "PUT"
        });
        await this.getTodos();
    }
    componentDidMount() {
        this.getTodos();
    }

    countToDoDone() {
        let todoDone = 0;
        this.state.todos.forEach((todo) => {
            if (todo.done) {
                todoDone++;
            }
        });
        return todoDone;
    };

    async checkTodoDone(id) {
        let updateTodoDone = this.state.todos;
        updateTodoDone[0].id = !updateTodoDone[0].id
        await this.updateTodo(id);
    };

    async clearTodoDone() {
          this.state.todos.forEach( async (todo) => {
            if (todo.done === true) {
                await this.deleteTodo(todo.id);
            }
        });
    };

    async addNewTodo(newTodo) {
        await this.postTodo(newTodo);
        await this.getTodos();
    }

    render() {
        const todoCount = this.state.todos.length;
        const todos = this.state.todos;
        return (
            <div className={"main"}>
                <div className={'navbar navbar-dark bg-dark fixed-top'}>
                    <div className="container-fluid">
                        <div className="navbar-brand">
                            <Start done={this.countToDoDone()} todoCount={todoCount}/>
                        </div>
                        <div className="navbar-right">
                            <button className={"btn btn-info btn-sm btn-clear"}
                                    onClick={() => this.clearTodoDone()}>Clear
                            </button>
                        </div>
                    </div>
                </div>
                <div className={'todo-list'}>
                    {this.state.loading ? (
                        <div className={"flex"}><i className={'fa fa-3x fa-spin fa-spinner'}/></div>) : (
                        <ul className={'list-group'}>
                            {todos.map((todo) => {
                                    return (
                                        <li className={'list-group-item'} key={todo.id}>
                                            <Todo todo={todo} onChangleTodo={() => this.checkTodoDone(todo.id)}/>
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    )}
                </div>
                <div className={'todo-new'}>
                    <NewTodoForm onAddNewTodo={(newTodo) => this.addNewTodo(newTodo)}/>
                </div>
            </div>
        )
    }
}
