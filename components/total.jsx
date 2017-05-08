import React from 'react';
export default class Total extends React.Component {
  render(){
    return(
      <div>
        <div className="uk-button-group uk-margin-bottom">
            <button className="uk-button uk-button-primary">文章统计</button>
        </div>
        {this.props.children}
      </div>
    )
  }
}
