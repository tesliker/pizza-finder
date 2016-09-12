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
        return {pizzas: undefined, reviews: undefined, currentNid: -1, fontSize: 16};
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

    showReviews: function(event){
        if (this.state.currentNid === event.currentTarget.dataset.nid) {
            this.setState({currentNid: -1});
        }
        else {
            this.setState({currentNid: event.currentTarget.dataset.nid});
            self = this;
            var url = "/react/graphql?query={comments: commentQuery(entityId: " + event.currentTarget.dataset.nid + ") {    entityId {targetId},renderedOutput}}";
            jQuery.post(url, function (data) {
                self.setState({
                    reviews: data
                });
            });
        }
    },

    reviews: function(nid) {
        var self = this;
        var reviews = '';
        if (this.state.reviews !== undefined) {
            this.state.reviews.data.comments.map(function(comment, i){
                reviews += comment.renderedOutput;
            });
            if (parseInt(this.state.currentNid) === parseInt(nid)) {
                reviews = <div dangerouslySetInnerHTML={{__html: reviews}}/>;
            }
            else {
                reviews = '';
            }
        }
        return reviews;
    },

    changeFont: function(event) {
        this.setState({fontSize: event.target.value});
    },

    render: function() {
        var self = this;

        if (!this.state.pizzas) {
            return <div>Not here yet</div>
        }
        if (this.state.pizzas.length === 0) {
            return <div>No pizzas added.</div>
        }

        var styles = {
            button: {
                backgroundColor: 'blue',
                color: 'white',
                textAlign: 'center',
                padding: '15px 0',
            },
            gridColumn: {
                width: '28%',
                padding: '1%',
                display: 'inline-block',
                verticalAlign: 'top',
                fontSize: this.state.fontSize
            }

        }

        var pizzaList = this.state.pizzas.data.pizzas.map(function(pizza, i){
            return <div>
                     <h2>{pizza.title}</h2>
                     <div style={styles.gridColumn}>
                       <ProcessedImage uri={pizza.image.entity.uri} />
                     </div>
                     <div style={styles.gridColumn}>
                       <div dangerouslySetInnerHTML={{__html: pizza.body.processed}} />
                     </div>
                     <div style={styles.gridColumn}>
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
                     </div>
                    <div data-nid={pizza.nid} style={styles.button} onClick={self.showReviews}>Show Reviews</div>
                    {self.reviews(pizza.nid)}
                  </div>
        });
        return (
            <div>
                <input type="text" onChange={this.changeFont} />
                {pizzaList}
            </div>
        );
    }
});

ReactDOM.render(
    <div>
        <PizzaFinder url='/react/graphql?query={
          pizzas: nodeQuery(type: "pizza") {
            ... on EntityNodePizza {
              nid,
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
