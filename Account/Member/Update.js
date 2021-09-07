import React, { Component } from 'react';
import ErrorForm from '../../Error/ErrorForm';
import API from '../../Config/Api';
import {AppContext} from '../../AppContext'
const pStyle = {
  color: 'red'
};
const floatStyle = {
    float: 'right'
}

class Update extends Component {
    static contextType = AppContext;  
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name : '',
            email : '',
            password: '',
            address : '',
            country: '',
            phone: '',
            avatar: '',
            file:'',
            mgsSuccess:'',
            formErrors: {},
            data:'',
            userData: JSON.parse(localStorage["appState"]),
            isLoggedIn: JSON.parse(localStorage["isLoggedIn"])
        }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInputFile = this.handleUserInputFile.bind(this)
  }

  componentDidMount () {
    if (!this.state.isLoggedIn){
        let appState = {
			user: {}
		};
		// reset state in context
		this.context.loginContext(false)
		// save app state with user date in local storage
		localStorage["appState"] = JSON.stringify(appState);
		this.setState(appState);
        this.props.history.push('/login')

    } else {
        let {userData} = this.state
        this.setState({
            id: userData.user.auth.id, 
            name: userData.user.auth.name,  
            email: userData.user.auth.email,
            phone: userData.user.auth.phone,
            address: userData.user.auth.address,
            country: userData.user.auth.country
        })
    }
  }  


  handleInput(e) {
    const nameInput = e.target.name;
    const value = e.target.value;

    this.setState({
      [nameInput]: value
    })
  }

  handleUserInputFile (e){
    const file = e.target.files;
    // send file to api server
    let reader = new FileReader();
    reader.onload = (e) => {
        this.setState({
            avatar: e.target.result,
            file: file[0]
        })
    };
    reader.readAsDataURL(file[0]);
  }

  handleSubmit(e){
    e.preventDefault();
    
    let flag = true
    let name = this.state.name;
    let password = this.state.password;
    let address = this.state.address;
    let phone = this.state.phone;
    let country = this.state.country;
    let file = this.state.file;
    let errorSubmit = this.state.formErrors;

    errorSubmit.phone = errorSubmit.name = errorSubmit.email = errorSubmit.password = errorSubmit.address = errorSubmit.country = errorSubmit.avatar = "";
    
    if(!name) {
        
      flag = false;
      errorSubmit.name = "Vui long nhap name";
    }
    if(!address) {
      flag = false;
      errorSubmit.address = "Vui long nhap address";
    }
    if(!country) {
      flag = false;
      errorSubmit.country = "Vui long nhap country";
    }
    if(!phone) {
      flag = false;
      errorSubmit.phone = "Vui long nhap country";
    }

    if(file && file.name !== ''){
      let type = file.type.toLowerCase();
      let typeArr = type.split('/');
      let regex = ["png", "jpg", "jpeg"];

      if(file.size > 208292) {
        flag = false;
        errorSubmit.avatar = "is invalid size";
      } else if(!regex.includes(typeArr[1])) {
        flag = false;
        errorSubmit.avatar = "is invalid type image";
      }
    }
    
    if(!flag) {
      this.setState({
          formErrors: errorSubmit
      });
    } else {

        let formData = new FormData();
            formData.append('name', name);
            formData.append('email', this.state.userData.user.auth.email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('country', country);
            formData.append('level', 0);
            if(this.state.avatar) {
                formData.append('avatar', this.state.avatar);
            }
            

        let url = 'user/update/' + this.state.userData.user.auth.id
        let accessToken = this.state.userData.user.auth_token;
        let config = { 
                headers: { 
                'Authorization': 'Bearer '+ accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
                } 
            };
      API.post(url, formData, config)
      .then(response => {
         if(response.data.errors) {
            this.setState({
                formErrors: response.data.errors
            })
         } else {
            let userData = {
                auth_token: response.data.success.token,
                auth: response.data.Auth
            };

            let appState = {
                user: userData
            };
            // save app state with user date in local storage
            localStorage.setItem('appState', JSON.stringify(appState));
            this.setState({
                mgsSuccess: 'Update information success! .',
                id: response.data.Auth.id, 
                name: response.data.Auth.name,  
                email: response.data.Auth.email,
                phone: response.data.Auth.phone,
                address: response.data.Auth.address,
                country: response.data.Auth.country
            })
         }
      })
      .catch(errors => {
            console.log(errors)
      })

    }
    
  }

  render () {
    return (
          <div className="col-sm-6" style={floatStyle}>
            <div className="signup-form">
              <h2>User Update!</h2>
              <p style={pStyle}>{this.state.mgsSuccess}</p>
              <ErrorForm formErrors={this.state.formErrors} />
              <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.name} onChange={this.handleInput} name="name" placeholder="Name"/>
                <input readOnly type="email" value={this.state.email} onChange={this.handleInput} name="email" placeholder="Email Address"/>
                <input type="password" value={this.state.password}  onChange={this.handleInput} name="password" placeholder="Password"/>
                <input type="text" value={this.state.address} onChange={this.handleInput} name="address" placeholder="Address"/>
                <input type="text" value={this.state.country} onChange={this.handleInput} name="country" placeholder="Country"/>
                <input type="text" value={this.state.phone} onChange={this.handleInput} name="phone" placeholder="phone"/>
                <input type="file" name="avatar" onChange={this.handleUserInputFile}/> 
                <button type="submit" className="btn btn-default">Signup</button>
              </form>
            </div>
          </div>
    )
  }
}
export default Update