import React from 'react'
import {Menu, Container, Form, Button, Table, Header, Icon, Progress} from 'semantic-ui-react'
import STATUS from '../const/status'

export default class Launch extends React.Component {
    static defaultProps = {
        commands: []
    };

    state = {
        form: {
            command: '',
            comment: ''
        },
        launch: -1,
        submit: false
    };

    render() {
        const {commands} = this.props;
        const {form, launch, submit} = this.state;
        const loadCommand = commands[launch] || null;
        return (
            <Container>
                <Header as='h1'>Запуск утилит</Header>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input
                            defaultValue={form.command}
                            value={form.command}
                            onInput={e => this.setState({form: {...form, command: e.target.value}})}
                            label='Команда'
                            placeholder="Например 'ls -la'"
                            disabled={submit}
                        />
                        <Form.Input
                            defaultValue={form.comment}
                            value={form.comment}
                            onInput={e => this.setState({form: {...form, comment: e.target.value}})}
                            label='Комментарий'
                            placeholder=''
                            disabled={submit}
                        />
                    </Form.Group>
                    <Form.Button loading={submit}>Запустить</Form.Button>
                    { loadCommand &&
                    <Progress
                        percent={
                            loadCommand.status === STATUS.PROCESS
                                ? submit ? 0 : 50
                                : 100
                        }
                        active={loadCommand.status === STATUS.PROCESS}
                        indicating={loadCommand.status === STATUS.PROCESS}
                        success={loadCommand.status === STATUS.COMPLETE}
                        error={loadCommand.status === STATUS.ERROR}
                    >{loadCommand.name}<br/>{loadCommand.comment && `(${loadCommand.comment})`}</Progress>
                    }
                </Form>
            </Container>
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        const {setCommands, commands} = this.props;
        const launch = commands.length;
        const command = {
            name: this.state.form.command,
            comment: this.state.form.comment,
            status: STATUS.PROCESS
        };
        this.setState({
            form: {
                command: '',
                comment: ''
            },
            launch: launch,
            submit: true
        });
        setCommands([...commands, command]);
        fetch("/api/push", {
            method: "put",
            body: JSON.stringify(this.state.form),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.text();
            })
            .catch(e => {
                setCommands(commands.slice(0, launch));
                this.setState({submit: false});
            })
            .then((command) => {
                this.props.commands[launch] = JSON.parse(command, (key, value) => {
                    if ((key === 'endTime' || key === 'updateTime') && value !== null) return new Date(value);
                    return value;
                });
                setCommands([...this.props.commands]);
                this.setState({submit: false});
            })
            .catch(e => {
                setCommands(commands.slice(0, launch));
                this.setState({submit: false});
            });
    };
}