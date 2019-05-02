import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';


class AppHeader extends Component {

    render() {
        return (
            <Row>
                <Col lg={12}>
                    <h1>{this.props.appHeaderTitle ? this.props.appHeaderTitle : "App Header"}</h1>
                </Col>
            </Row>
        );
    }
}

export default AppHeader;