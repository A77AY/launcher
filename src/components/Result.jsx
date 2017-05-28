import React from 'react'
import {Container, Table, Header, Icon} from 'semantic-ui-react'
import STATUS from '../const/status'

export default class Result extends React.Component {
    static defaultProps = {
        commands: []
    };

    state = {};

    render() {
        const {commands} = this.props;
        return (
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
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric"
                                            }) : '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {command.updateTime ? command.updateTime.toLocaleString("ru", {
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric"
                                            }) : '-'}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}