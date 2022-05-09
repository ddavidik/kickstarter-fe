import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectInfo from './Project-info';
import { loadProject, connectWallet, getCurrentWalletConnected, donate, kickstarterContract } from './utils/interact.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import vselogo from './vselogo.png';

export const weiToEtherConversion = 1000000000000000000;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      project: {},
      walletAddress: "",
      loading: true,
      status: "",
      donationInput: 0
    }
    this.connectWalletPressed = this.connectWalletPressed.bind(this);
    this.donateButtonPressed = this.donateButtonPressed.bind(this);
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  async addSmartContractListener() {
    kickstarterContract.events.FundingChanged({}, (error, data) => {
      if (error) {
        this.setState({ status: error.message });
      } else {
        this.setState({ status: "Transakce ověřena!" });
      }
    });
    const project = await loadProject();
    this.setState({ project: project });
  }

  async connectWalletPressed() {
    const walletResponse = await connectWallet();
    this.setState({ walletAddress: walletResponse.address });
    this.setState({ status: walletResponse.status });
  }

  async donateButtonPressed() {
    const value = this.state.donationInput;
    const result = await donate(this.state.walletAddress, value * weiToEtherConversion);
    this.setState({ status: result.status });
  }

  async loadBlockchainData() {
    this.state.project = await loadProject();
    const { address, status } = await getCurrentWalletConnected();

    this.setState({ walletAddress: address });
    this.setState({ status: status });

    this.addSmartContractListener();
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img id="logo" src={vselogo}></img>
          {this.state.loading
            ? <div id="loader" className="text-center"><p className="text-center">Načítání...</p></div>
            :
            <div>
              < Button variant="outline-primary" id="walletButton" onClick={this.connectWalletPressed} >
                {
                  this.state.walletAddress.length > 0 ? (
                    "Připojeno: " +
                    String(this.state.walletAddress).substring(0, 6) +
                    "..." +
                    String(this.state.walletAddress).substring(38)
                  ) : (
                    <span>Připojit peněženku</span>
                  )
                }
              </Button>
              <p id="status">Status: {this.state.status}</p>
              <ProjectInfo project={this.state.project} />
              <Form className="donate-form">
                <Form.Group className="donate-input" controlId="formDonateInput">
                  <Form.Label>Přispět</Form.Label>
                  <Form.Control type="number" placeholder="Vložte hodnotu" onChange={(e) => this.setState({ donationInput: e.target.value })} />
                  <Form.Text id="donationText">Hodnota se vkládá v etheru.</Form.Text>
                  <Button className="interact-buttons" disabled={this.state.donationInput <= 0} id="donateButton" onClick={this.donateButtonPressed}>
                    Přispět
                  </Button>
                </Form.Group>
              </Form>
            </div>
          }
        </header>
      </div >
    );
  }
}

export default App;
