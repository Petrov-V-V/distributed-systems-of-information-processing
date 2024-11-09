import React, { Component } from 'react';
import SockJS from 'sockjs-client';
import { sendNote, getAllNotes, deleteNote, updateNote } from "./api/api";
import { Table, Card, Button, Input, Form, Modal } from "antd";


class App extends Component {
  state = {
    time: new Date().toLocaleTimeString(),
    serverTime: 'нет данных',
    note: { title: "", text: "", body:"", json: "" },
    data: [],
    modalNote: null,
    isModalVisible: false,
  }

  componentDidMount() {// выполнено монтирование компонента
    // создаем подключение к сокету
    this.sock = new SockJS('http://127.0.0.1:9999/echo'); 

    this.sock.onopen = function () {
      console.log('open');
      // при открытии пошлем на сервер сообщение
      this.send('socket opened');
    };
    // на событие onmessage навешиваем одноименную функцию
    this.sock.onmessage = this.onMessage.bind(this);
    this.sock.onclose = function () {
      console.log('close');
    };
    setInterval(this.tick, 1000);
    // this.handleSendNote(); // следующие строки добавляем
    this.getAll();
  }

  handleSendNote = () => {
    sendNote(this.state.note)
      .then((res) => {
        console.log(res);
        this.getAll();
        this.setState({ note: { title: "", text: "" } });
      })
      .catch((err) => console.log(err));
  };

  handleDeleteNote = (id) => {
    deleteNote(id)
      .then(() => {
        this.getAll();
      })
      .catch((err) => console.log(err));
  };

  handleUpdateNote = () => {
    updateNote(this.state.modalNote._id, this.state.modalNote)
      .then(() => {
        this.getAll();
        this.setState({ isModalVisible: false, modalNote: null });
      })
      .catch((err) => console.log(err));
  };

  getAll = () => {
    getAllNotes()
      .then((res) => {
        console.log(res);
        this.setState({ data: res });
      })
      .catch((err) => console.log(err));
  };

  //функция получает данные...
  onMessage = (e) => {
    if (e.data) {
      // и помещает их в state
      this.setState({
        serverTime: e.data
      })
    }
  }

  tick = () => {
    this.setState({ time: new Date().toLocaleTimeString() });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      note: { ...prevState.note, [name]: value },
    }));
  };

  showModal = (record) => {
    this.setState({ isModalVisible: true, modalNote: { ...record } });
  };

  handleModalCancel = () => {
    this.setState({ isModalVisible: false, modalNote: null });
  };

  handleEditInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      modalNote: { ...prevState.modalNote, [name]: value },
    }));
  }
  
  render() {
        console.log(this.state)
        const columns = [
          { title: "_id", dataIndex: "_id", key: "_id" },
          { title: "title", dataIndex: "title", key: "title" },
          { title: "text", dataIndex: "text", key: "text" },
          { title: "body", dataIndex: "body", key: "body" },
          { title: "json", dataIndex: "json", key: "json" },
          {title: "",
            key: "edit",
            render: (text, record) => (
              <>
                <Button onClick={() => this.showModal(record)}>Edit</Button>
                <Button onClick={() => this.handleDeleteNote(record._id)}>Delete</Button>
              </>
            ),
      },
        ];
        return (
          <Card
          title={"Hello, world!"}
          actions={[
            <h1>Время: {this.state.time}</h1>,
            <h1>Серверное время: {this.state.serverTime}</h1>,
          ]}
        >
          <Table columns={columns} dataSource={this.state.data} /><Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Заголовок"
                name="title"
                value={this.state.note.title}
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Текст"
                name="text"
                value={this.state.note.text}
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Тело"
                name="body"
                value={this.state.note.body}
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Json"
                name="json"
                value={this.state.note.json}
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleSendNote}>Добавить запись</Button>
            </Form.Item>
          </Form>
          <Modal
            title="Изменить запись"
            visible={this.state.isModalVisible}
            onOk={this.handleUpdateNote}
            onCancel={this.handleModalCancel}
          >
            <Input
              placeholder="Заголовок"
              name="title"
              value={this.state.modalNote?.title || ""}
              onChange={this.handleEditInputChange}
            />
            <Input
              placeholder="Текст"
              name="text"
              value={this.state.modalNote?.text || ""}
              onChange={this.handleEditInputChange}
            />
              <Input
                placeholder="Тело"
                name="body"
                value={this.state.modalNote?.body || ""}
                onChange={this.handleEditInputChange}
              />
              <Input
                placeholder="Json"
                name="json"
                value={this.state.modalNote?.json || ""}
                onChange={this.handleEditInputChange}
              />
          </Modal>
        </Card>
        );
  }
} 

export default App;
