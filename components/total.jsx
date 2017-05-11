import React from 'react';
export default class Total extends React.Component {
  _downExcel(){
      window.open("/download/"+(+new Date()));
  }
  render(){
    return(
      <div>
        <div className="uk-button-group uk-margin-bottom">
            <button onClick={this._downExcel.bind()} className="uk-button uk-button-primary"><i className="uk-icon-download"></i>下载excel表格</button>
        </div>
        {this.props.children}
      </div>
    )
  }
}
