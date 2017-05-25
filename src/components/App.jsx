import React, {Component} from 'react';
import {Menu, Container, Form, Button, Table, Header, Icon} from 'semantic-ui-react'

const STATUS = {
    COMPLETE: 'завершено',
    PROCESS: 'в процессе',
    ERROR: 'ошибка'
};

export default class App extends Component {

    state = {
        activeItem: App.PAGES.RESULT,
        commands: [
            {
                name: 'ls -la',
                comment: 'тестовый запуск',
                status: STATUS.PROCESS,
                output: '',
                endTime: new Date(Date.now() - 20),
                updateTime: new Date(Date.now())
            }
        ]
    };

    static PAGES = {
        LAUNCH: 'Запуск',
        RESULT: 'Результат'
    };

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
                    { activeItem === App.PAGES.LAUNCH &&
                    <Container>
                        <Header as='h1'>Запуск утилит</Header>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input label='Команда' placeholder="Например 'ls -la'"/>
                                <Form.Input label='Комментарий' placeholder=''/>
                            </Form.Group>
                            <Button>Запустить</Button>
                        </Form>
                    </Container>
                    }
                    { activeItem === App.PAGES.RESULT &&
                    <Container>
                        <Header as='h1'>Результаты</Header>
                        <Table celled padded>
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

                            <Table.Body>
                                {
                                    commands.map((command, id) => {
                                        return (
                                            <Table.Row key={id}>
                                                <Table.Cell>
                                                    {command.name}
                                                </Table.Cell>
                                                <Table.Cell>Power Output</Table.Cell>
                                                <Table.Cell singleLine>
                                                    <Icon name='attention'/>
                                                    {command.status}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {command.output}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {command.endTime.getHours()}:{command.endTime.getMinutes()}:{command.updateTime.getSeconds()}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {command.updateTime.getHours()}:{command.updateTime.getMinutes()}:{command.updateTime.getSeconds()}
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

    handleItemClick = (e, {name}) => this.setState({activeItem: name});
}