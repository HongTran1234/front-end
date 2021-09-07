import React, { Component } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import App from './App'
import Update from './Member/Update'
import Product from './Product/List'
import Add from './Product/Add'
import Edit from './Product/Add'
class Index extends Component {

 
  render () {
    return (
      <App>
        <Switch>
          <Route path='/account/member' component={Update} />
          <Route path='/account/product/list' component={Product} />
          <Route path='/account/product/add' component={Add} />
          <Route path='/account/product/edit/:id?' component={Edit} />
        </Switch>
      </App>
    )
  }
}
export default Index