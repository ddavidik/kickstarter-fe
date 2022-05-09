import React from "react";
import * as moment from "moment";
import { OverlayTrigger, ProgressBar } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import { weiToEtherConversion } from "./App.js";

class ProjectInfo extends React.Component {

    render() {

        let deadlineUnix = new Date(this.props.project.deadline * 1000);
        let deadline = moment(deadlineUnix).format("DD. MM. YYYY HH:mm:ss");

        let nf = new Intl.NumberFormat();

        const percentRaised = this.props.project.raised / this.props.project.goal * 100;

        return (
            <div>
                <b>{this.props.project.name}</b>
                <br></br><br></br>
                <OverlayTrigger key="goal" placement="right" overlay={
                    <Tooltip id="tooltip-goal">
                        {nf.format(this.props.project.goal)} wei
                    </Tooltip>
                }
                >
                    {
                        <p>Cíl: {this.props.project.goal / weiToEtherConversion} ether</p>
                    }
                </OverlayTrigger>
                <br></br>
                <ProgressBar now={percentRaised} label={`${percentRaised}%`} />
                <br></br>
                <OverlayTrigger key="raised" placement="right" overlay={
                    <Tooltip id="tooltip-raised">
                        {nf.format(this.props.project.raised)} wei
                    </Tooltip>
                }
                >
                    {
                        <p>Financováno: {this.props.project.raised / weiToEtherConversion} ether</p>
                    }
                </OverlayTrigger>
                <br></br>
                <p>Konečný termín: {deadline}</p>
            </div>
        )
    }

}

export default ProjectInfo;