import React, {Component} from 'react';

class Result extends Component {

  constructor(props) {
    super(props);
  }

  favourite() {
    this.setState({favourited: true});
    this.props.favouriteMethod(this.props.id)
  }

  render() {

    const cleanBody = this.props.body.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

    return (
      <div className="flex-grid">
        <div className="col">
          <i className={((this.props.isFavourited) ? "favourited" : "unfavourited") + " fa fa-star"}  onClick={ () => {
            this.favourite()
          }}/>

          {this.props.title}
        </div>
        <div className="col body" dangerouslySetInnerHTML={{__html: cleanBody}}>

        </div>
      </div>
    );
  }
}

export default Result;