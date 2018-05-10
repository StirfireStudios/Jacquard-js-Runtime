import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import React, { Component } from 'react';

import ListView from './ListView';

import * as Actions from '../actions/view';

function onClick(key, show, event) {
  this.props.actions.ChangeVisibility(key, show);
  event.preventDefault();
}

function renderLists() {
  const output = [];
  if (this.props.showCharacters) {
    output.push(
      <ListView 
        list={this.props.characters} 
        name="characters" 
        hideFunc={onClick.bind(this, "Characters", false)}
      />
    );
  }
  
  if (this.props.showState) {    
    output.push(<div className="state" key="state">Varible State List!</div>);
  }
  
  if (this.props.showVariables) {
    output.push(
      <ListView 
        list={this.props.variables} 
        name="variables" 
        hideFunc={onClick.bind(this, "Variables", false)}
      />
    );
  }  

  if (this.props.showNodeNames) {
    output.push(
      <ListView 
        list={this.props.nodeNames} 
        name="nodes" 
        hideFunc={onClick.bind(this, "NodeNames", false)}
      />
    );
  }

  if (this.props.showNodeHistory) {
    output.push(
      <ListView 
        list={this.props.nodeHistory} 
        name="nodeHistory" 
        hideFunc={onClick.bind(this, "NodeHistory", false)}
      />
    );
  }

  return <div class="lists" key="lists">{output}</div>;
}

function renderTextWindow() {
  return (
    <div key="display" class="display">
      

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tristique a sapien vitae congue. Sed id velit et sapien vestibulum imperdiet et vitae metus. Mauris euismod rhoncus tempor. Donec rhoncus dui vitae justo laoreet porttitor. Aenean leo augue, consequat nec velit eget, dignissim lobortis massa. Curabitur in dictum orci. Etiam lobortis sapien consequat neque vulputate, sodales lobortis enim laoreet. Praesent venenatis elit facilisis augue commodo facilisis at nec turpis. Vestibulum vitae ante nec nibh iaculis placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse imperdiet lacus ut leo pellentesque volutpat.

Sed in lacus ac diam lacinia elementum vitae porttitor orci. Sed vel luctus leo. Curabitur sed finibus urna. Maecenas nec urna nisl. Suspendisse ligula magna, suscipit vitae maximus at, efficitur vitae urna. Sed ut dui feugiat, elementum dui eget, viverra dui. Vivamus semper faucibus tellus, ut placerat lectus semper in. Cras nec libero laoreet, rhoncus dui sed, finibus mauris. Sed pellentesque luctus sem, vel suscipit purus consequat facilisis. Vivamus blandit nibh nec lorem dapibus auctor. Morbi nec quam sem. Mauris pulvinar magna dignissim odio accumsan fringilla.

Cras in ex id elit imperdiet hendrerit sed et nibh. Nam dictum est at sem pellentesque rhoncus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique libero massa, eu ullamcorper massa mollis accumsan. Praesent pellentesque fringilla augue ac lacinia. Aliquam urna lectus, dignissim in lacinia a, lobortis et tortor. Cras faucibus elit nulla, sed sodales metus condimentum at. Aenean porta sagittis auctor. Curabitur placerat eu nibh non semper. In fermentum elit ac ipsum gravida, ut eleifend ligula lobortis. Praesent malesuada euismod lectus, et eleifend velit accumsan id. Nullam egestas ut quam ut mollis. Aenean porta nisi diam, eu vulputate leo blandit sit amet. Pellentesque imperdiet est scelerisque elit rutrum, vel fermentum libero tincidunt. Sed tortor eros, sollicitudin id eros eget, mollis facilisis neque.

Ut nec dolor semper, pharetra dui at, consequat lectus. Sed vel vehicula lectus. Nunc a felis risus. Cras porta blandit enim, id interdum quam luctus id. Phasellus nisl velit, pulvinar pharetra sagittis et, dignissim at est. Sed vulputate facilisis tristique. Suspendisse hendrerit sem in leo dictum, in malesuada tortor scelerisque. Sed viverra vestibulum elit vel rutrum. Etiam molestie nisi quis massa gravida, sed dignissim metus tincidunt.

Aenean scelerisque turpis purus, ut dictum elit vestibulum ac. Nulla ante quam, molestie ut aliquet sit amet, semper id nisi. Curabitur quis lobortis tellus. Proin sed erat sollicitudin, vulputate augue in, hendrerit leo. Suspendisse efficitur dui et blandit cursus. Curabitur a suscipit leo. Fusce sed risus id ex vehicula mollis. Nunc auctor erat sed magna vestibulum auctor. Mauris leo orci, semper quis facilisis ac, congue eu tortor. Fusce feugiat arcu quis congue sodales. Vestibulum scelerisque diam id quam egestas, id ullamcorper tellus lacinia. 
    </div>
  );
}

function renderButton(key) {
  const visible = this.props[`show${key}`];
  const text = visible ? "Hide" : "Show";
  const func = onClick.bind(this, key, !visible);
  return <button key={key} onClick={func} className={key.toLowerCase()}>{text} {key}</button>;
}

function renderButtons() {
  const output = [];

  ["Characters", "State", "Variables", "NodeNames", "NodeHistory"].forEach((name) => {
    output.push(renderButton.call(this, name));
  })

  return <div class="buttons" key="buttons">{output}</div>;
}

class Viewer extends Component {
  render() {
    if (!this.props.ready) return null;

    return (
      <div>
        {renderLists.call(this)}
        {renderTextWindow.call(this)}
        {renderButtons.call(this)}        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ready: state.Runtime.ready,
    characters: state.Runtime.characters,
    showCharacters: state.View.showCharacters,
    state: state.Runtime.variableState,
    showState: state.View.showState,
    variables: state.Runtime.variables,
    showVariables: state.View.showVariables,
    nodeNames: state.Runtime.nodeNames,
    showNodeNames: state.View.showNodeNames,
    nodeHistory: state.Runtime.nodeHistory,
    showNodeHistory: state.View.showNodeHistory,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);