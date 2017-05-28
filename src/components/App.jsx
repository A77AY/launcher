import React, {Component} from 'react';
import {Menu, Container, Form, Button, Table, Header, Icon, Progress} from 'semantic-ui-react'
import STATUS from '../const/status'
import Launch from './Launch'

export default class App extends Component {

    state = {
        activeItem: App.PAGES.RESULT,
        commands: [],
        form: {
            command: '',
            comment: ''
        },
        launch: -1,
        submit: false
    };

    static PAGES = {
        LAUNCH: 'Запуск',
        RESULT: 'Результат'
    };

    componentDidMount() {
        this.load();
        this.updateProcessedLoop();
    }

    render() {
        const {activeItem, commands} = this.state;
        return (
            <div style={{margin: '30px 0'}}>
                <Container>
                    <Menu secondary>
                        <Menu.Item name={App.PAGES.LAUNCH} active={activeItem === App.PAGES.LAUNCH}
                                   onClick={this.handleItemClick}/>
                        <Menu.Item name={App.PAGES.RESULT} active={activeItem === App.PAGES.RESULT}
                                   onClick={this.handleItemClick}/>
                    </Menu>
                    { activeItem === App.PAGES.LAUNCH && <Launch commands={commands} setCommands={this.setCommands}/>}
                    { activeItem === App.PAGES.RESULT &&
                    <Container>
                        <Header as='h1'>Результаты</Header>
                        <Table celled padded style={{tableLayout: 'fixed'}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Команда</Table.HeaderCell>
                                    <Table.HeaderCell>Комментарий</Table.HeaderCell>
                                    <Table.HeaderCell>Статус</Table.HeaderCell>
                                    <Table.HeaderCell>Вывод</Table.HeaderCell>
                                    <Table.HeaderCell>Время завершения выполнения</Table.HeaderCell>
                                    <Table.HeaderCell>Обновление</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body style={{width: '100%'}}>
                                {
                                    commands.map((command, id) => {
                                        return (
                                            <Table.Row
                                                key={id}
                                                warning={command.status === STATUS.PROCESS}
                                                error={command.status === STATUS.ERROR}
                                                positive={command.status === STATUS.COMPLETE}
                                                style={{verticalAlign: 'top'}}
                                            >
                                                <Table.Cell>
                                                    <pre style={{margin: 0}}>{command.name}</pre>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div style={{maxHeight: 200, overflow: 'auto'}}>
                                                        {command.comment}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell singleLine>
                                                    <Icon name='attention'/>
                                                    {command.status}
                                                </Table.Cell>
                                                <Table.Cell style={{overflow: 'auto'}}>
                                                    <pre style={{margin: 0, maxHeight: 200}}>{command.output}</pre>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {command.endTime ? command.endTime.toLocaleString("ru", {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        second: "numeric"
                                                    }) : '-'}
                                                    {/*{*/}
                                                    {/*command.status === STATUS.PROCESS &&*/}
                                                    {/*<Button basic onClick={e=>this.kill(id)}>Остановить</Button>*/}
                                                    {/*}*/}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {command.updateTime ? command.updateTime.toLocaleString("ru", {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        second: "numeric"
                                                    }) : '-'}
                                                    {/*<Button basic>Обновить</Button>*/}
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </Container>
                    }
                </Container>
            </div>
        );
    }

    setCommands = (commands) => {
        this.setState({commands: commands});
    };

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    load = () => {
        fetch('/api/all')
            .then((res) => {
                return res.text();
            })
            .then((commands) => {
                commands = this.commandsParse(commands);
                this.setState({commands});
            });
    };

    kill = (id) => {
        fetch("/api/kill", {
            method: "post",
            body: JSON.stringify({id: id}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    };

    updateProcessedLoop() {
        setTimeout(() => {
            const {commands} = this.state;
            const processedCommandsIds = [];
            for (let i = 0; i < commands.length; ++i) {
                if (commands[i].status === STATUS.PROCESS) {
                    processedCommandsIds.push(i);
                }
            }
            fetch("/api/getSome", {
                method: "post",
                body: JSON.stringify({ids: processedCommandsIds, length: commands.length}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    return res.text();
                })
                .then((commands) => {
                    commands = this.commandsParse(commands);
                    let newCommands = this.state.commands.slice();
                    for (let id in commands) {
                        newCommands[id] = commands[id];
                    }
                    this.setState({commands: newCommands});
                    this.updateProcessedLoop();
                });
        }, 1000);
    }

    commandsParse = (commands) => {
        return JSON.parse(commands, (key, value) => {
            if ((key === 'endTime' || key === 'updateTime') && value !== null) return new Date(value);
            return value;
        })
    };
}