import React from 'react';
import Select from 'react-select';
import BucketContent from './BucketContent.js'
import './App.css';

class Card extends React.Component {
  render() {
    return (
      <div className="card">
        <h1 className="top">{this.props.os}</h1>
        <img className="os" src={this.props.iconUrl}/>
        <a href={this.props.downloadUrl}>
          <button className="btn">
            Download {this.props.version}
          </button>
        </a>
      </div>
    );
  }
}

class BranchSelector extends React.Component {
  render() {
    return (
      <Select className="select"
        options={this.props.options}
        defaultValue={this.props.options.filter(option => option.label === "dev")}
        onChange={this.props.onChange}
        />
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let loader = new BucketContent();
    loader.execute(
      content => {
        let result = this.prepareContent(content);
        let dev = result.filter(branch => branch.label === "dev");
        this.setState({options:result, selectedValue: dev[0]});
      }
    );
    this.state = {
      selectedValue: {label: "branchName",value: {name: "",platforms: {windows: {downloadUrl: ""},linux: {downloadUrl: ""},macos: {downloadUrl: ""}}}},
      options: [],
    };
  }

  prepareContent(bucketData) {
    const baseUrl = "http://nightlybuilds.s3-website-us-east-1.amazonaws.com/";
    let options = [];
    Object.keys(bucketData).forEach(branchName => {
      options.push({
        label: branchName,
        value: {
          name: branchName,
          platforms: {
            windows: {
              downloadUrl: baseUrl + bucketData[branchName][2]
            },
            linux: {
              downloadUrl: baseUrl + bucketData[branchName][0]
            },
            macos: {
              downloadUrl: baseUrl + bucketData[branchName][1]
            }
          }
        }
      });
    });
    return options;
  }

  render() {    
    return (
      <div className="content-container">
        <BranchSelector 
            options={this.state.options} 
            selectedValue={this.state.selectedValue}
            onChange={(value) => this.setState({selectedValue:value})}
        />
        <div className="platforms">
          <Card 
            os="Windows"
            version={this.state.selectedValue.value.name}
            downloadUrl={this.state.selectedValue.value.platforms.windows.downloadUrl}
            iconUrl="https://www.freeiconspng.com/uploads/system-windows-icon-png-4.png"
          />
          <Card 
              os="Mac" 
              version={this.state.selectedValue.value.name}
              downloadUrl={this.state.selectedValue.value.platforms.macos.downloadUrl}
              iconUrl="https://www.freeiconspng.com/uploads/brushed-metal-apple-mac-icon-29.png"
          />
          <Card 
              os="Linux" 
              version={this.state.selectedValue.value.name}
              downloadUrl={this.state.selectedValue.value.platforms.linux.downloadUrl}
              iconUrl="https://www.freeiconspng.com/uploads/linux-icon-2.png"
          />
        </div>
      </div>
    );
  }
}

class AppBar extends React.Component {
  render() {
    return (<div className="appbar">
      <img src="https://orature.bibletranslationtools.org/wp-content/uploads/sites/6/2020/09/Orature@2x.png"></img>
    </div>);
  }
}

function App() {
  return (
    <div className="app">
      <AppBar />
      <Game />
    </div>
  );
}

export default App;
