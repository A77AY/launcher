import React, {Component} from 'react';
import {Menu, Container} from 'semantic-ui-react'
import STATUS from '../const/status'
import Launch from './Launch'
import Result from "./Result";

export default class App extends Component {

    state = {
        activeItem: App.PAGES.RESULT,
        commands: []
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
                    { activeItem === App.PAGES.RESULT && <Result commands={commands}/>}
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