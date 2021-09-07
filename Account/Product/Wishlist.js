import React, { Component } from 'react'
import { Link } from "react-router-dom";
import API from '../../Config/Api';
import config from '../../Config/Config';
import NumberFormat from 'react-number-format';
import DeleteProduct from './Delete'

const pStyle = {
    color: 'red',
    textAlign: 'center'
  };
class Wishlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data : '',
          userData: JSON.parse(localStorage["appState"]),
          wishlist: JSON.parse(localStorage["wishlist"])
        }
        this.addToCart = this.addToCart.bind(this)
        this.removeWishlist = this.removeWishlist.bind(this)
      }

    componentDidMount() {
        API.get('product/wishlist')
        .then(response => {
            
          if(response.data.response === "success") {
            this.setState({
                data: response.data.data
            })
          } else {
            console.log("error")
          }
          
        })
        .catch(function (error) {
          console.log(error)
        }) 
    }

    renderSale(status) {
        if(status == 1) {
            return <img src="/frontend/images/home/new.png" className="new" alt="" />
        } else if(status == 2) {
            return <img src="/frontend/images/home/sale.png" className="new" alt="" />
        }
      }
    
    addToCart (e) {
	
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
        let id = e.target.id.toString();
        
        cart[id] = (cart[id] ? cart[id]: 0);
        
        let qty = cart[id] + parseInt(this.state.quantity);
        cart[id] = qty
        localStorage.setItem('cart', JSON.stringify(cart));
    
    }

    removeWishlist(e) {
        let id = e.target.id.toString()
        let {wishlist} = this.state
        let filterArray = wishlist.filter(item => item == id)
        
        this.setState({
            wishlist: filterArray
        })

        localStorage.setItem('wishlist', JSON.stringify(filterArray));
    }

    renderWishlist() {
        let {data, wishlist} = this.state
        
        if(wishlist.length > 0) {
            if(Array.isArray(data) && data.length > 0) {           
                let filterArray = data.filter(
                    item => wishlist.includes(item.id.toString())
                )

                return filterArray.map((item, i) => {
                    let image = JSON.parse(item.image)
                    return (
                        <div key={i} className="col-sm-4">
                            <div className="product-image-wrapper">
                                <div className="single-products">
                                        <div className="productinfo text-center">
                                            <img src={config.pathUpload + '/user/product/' + item.id_user + '/' + image[0]} alt="" />
                                            <h2 className={item.sale > 0 ? 'through' : ''}><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h2>
                                            {item.sale > 0 &&
                                                <h2>
                                                <NumberFormat value={(item.price * item.sale) / 100} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                </h2>
                                            }
                                            <p>{item.name}</p>
                                            <span id={item.id} onClick={this.addToCart} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>Add to cart</span>
                                        </div>
                                        <div className="product-overlay">
                                            <div className="overlay-content">
                                            <h2 className={item.sale > 0 ? 'through' : ''}><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h2>
                                                {item.sale > 0 &&
                                                    <h2>
                                                    <NumberFormat value={(item.price * item.sale) / 100} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                    </h2>
                                                }
                                                <p>{item.name}</p>
                                                <a id={item.id} onClick={this.addToCart} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>Add to cart</a>
                                            </div>
                                        </div>
                                        {this.renderSale(item.status)}
                                </div>
                                <div className="choose">
                                    <ul className="nav nav-pills nav-justified">
                                        <li><a id={item.id} onClick={this.removeWishlist}><i className="fa fa-plus-square"></i>Remove to wishlist</a></li>
                                        <li><Link to={"/product/detail/" + item.id}><i className="fa fa-plus-square"></i>More</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                })
            } 
        } else {
            return (
                <p style={pStyle}>Empty wishlist</p>
            )
        }
    }

   
  render () {
      
    return (
        <div className="col-sm-9" id="cart_items">
           {this.renderWishlist()}
        </div>
 
    )
  }
}
export default Wishlist
