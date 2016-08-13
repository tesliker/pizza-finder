/**
 * @file
 * First example react component.
 */

import Radium, { Style } from 'radium'

var ProcessedImage = React.createClass({

    render: function() {
        var url = this.props.uri.replace('public://', '/react/sites/default/files/');
        return (
            <img src={url} />
        );
    }
});

var PizzaFinder = React.createClass({
    getInitialState: function(){
        return {pizzas: undefined};
    },

    componentDidMount: function(){
        this.getPizzas();
    },

    getPizzas: function(){
        self = this;
        jQuery.post( this.props.url, function( data ) {
            self.setState({
                pizzas: data
            });
        });
    },

    render: function() {
        if (!this.state.pizzas) {
            return <div>Not here yet</div>
        }
        if (this.state.pizzas.length === 0) {
            return <div>No pizzas added.</div>
        }
        console.log(this.state.pizzas.data);
        var pizzaList = this.state.pizzas.data.pizzas.map(function(pizza, i){
            return <div>
                     <h2>{pizza.title}</h2>
                     <ProcessedImage uri={pizza.image.entity.uri} />
                     <div dangerouslySetInnerHTML={{__html: pizza.body.processed}} />
                     <label>sizes</label>
                     <ul>
                         {pizza.sizesAvailable.map(function(size, k){
                             return <li>{size.size.name}</li>
                         })}
                     </ul>
                    <label>Toppings</label>
                    <ul>
                        {pizza.toppings.map(function(topping, k){
                            return <li>{topping.topping.name}</li>
                        })}
                    </ul>
                    <div style={styles.button}>Show Reviews</div>
                  </div>
        });
        return (
            <div>{pizzaList}</div>
        );
    }
});

var styles = {
    button: {
        backgroundColor: 'blue',
        color: 'white'
    }
}

ReactDOM.render(
    <div>
        <PizzaFinder url='/react/graphql?query={
          pizzas: nodeQuery(type: "pizza") {
            ... on EntityNodePizza {
              title,
              body {
                processed
              },
              image {
                entity {
                  uri
                }
              }
              sizesAvailable {
                size: entity {
                  name
                }
              }
              toppings {
                topping: entity {
                  name
                }
              }
            }
          }
        }
        ' />
    </div>,
  document.getElementById('pizza-finder')
);
