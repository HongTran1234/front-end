import React, { Component } from 'react'
import API from '../../Config/Api';
import ErrorForm from '../../Error/ErrorForm'
import config from '../../Config/Config';

const liStyle = {
    display: 'inline-block',
    margin: '0 10px'
};
const imgStyle = {
    width: '50px',
    height: '50px'
};
const inputStyle = {
    width: '20%',
    display:'inline-block'
};

class AddEdit extends Component {

        constructor(props) {
            super(props)
            
            this.state = {
                listCategory:'',
                listBrand:'',
                category: '',
                brand: '',
                name: '',
                price: '',
                company:'',
                avatar:'',
                avatarList:[],
                detail:'',
                formErrors: {},
                userData: JSON.parse(localStorage["appState"]),
                status: 0,
                sale:0,
                // edit
                avatarCheckBox:[],
                avatarOld:'',
                avatarListDelete:''
            }
            this.handleUserInput = this.handleUserInput.bind(this)
            this.handleUserInputFile = this.handleUserInputFile.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        componentDidMount () {
            API.get('category-brand')
            .then(response => {
                this.setState({
                    listCategory: response.data.category,
                    listBrand: response.data.brand
                });
            })   
            
            // edit product 
            let parseIntId = Number(this.props.match.params.id)
            if(parseIntId) {
                let accessToken = this.state.userData.user.auth_token;
                let url = 'user/product/' + this.props.match.params.id;    
                let config = { 
                    headers: { 
                    'Authorization': 'Bearer '+ accessToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                    } 
                };
                API.get(url, config)
                .then(response => {
                    let data = response.data.data;
                    
                    this.setState({
                        name: data.name,
                        price: data.price,
                        detail: data.detail,
                        company: data.company_profile,
                        category: data.id_category,
                        brand: data.id_brand,
                        status: data.status,
                        sale: data.sale,
                        avatarOld: data.image,
                        avatarListDelete:data.image
                    })
                    
                })      
            }   
        }  

        renderCategory() {
            if (Array.isArray(this.state.listCategory) && this.state.listCategory.length > 0) {
                return this.state.listCategory.map((item, i) => {
                    return (
                        <option key={i} index={i} value={item.id}>
                            {item.category}
                        </option>
                    )
                })
            }   
        }

        renderBrand() {
            if (Array.isArray(this.state.listBrand) && this.state.listBrand.length > 0) {
                return this.state.listBrand.map((item, i) => {
                    return (
                        <option key={i} index={i} value={item.id}>
                            {item.brand}
                        </option>
                    )
                })
            }
        }

        renderImage() {
            if (Array.isArray(this.state.avatarOld) && this.state.avatarOld.length > 0) {
                return this.state.avatarOld.map((item, i) => {
                    return (
                        <li style={liStyle} key={i}>
                            <img width="50" height="50" src={config.pathUpload + 'user/product/' + this.state.userData.user.auth.id + '/' + item} alt="" />
                            {/* <img style={imgStyle} src={'/upload/product/' + this.state.userData.user.id + '/' + item} /> */}
                            <input name="avatarCheck" type="checkbox" value={item} onChange={this.handleUserInput} />
                        </li>
                    )
                }) 
            }
        }

        handleUserInputFile (e){
            const fileFront = e.target.files;
            this.setState({
                avatar: fileFront
            })  
        }
    
        handleUserInput (e) {
            const nameInput = e.target.name;
            const value = e.target.value;
            const isChecked = e.target.checked;
    
            // input type checkbox
            if(nameInput === 'avatarCheck') {
                let avatarCheckBox = this.state.avatarCheckBox;
                if(isChecked) {
                    avatarCheckBox.push(value)
                    this.setState({
                        avatarCheckBox: avatarCheckBox
                    })
                } else {
                    let index = avatarCheckBox.indexOf(value);
                    if (index > -1) {
                        avatarCheckBox.splice(index, 1);
                    }
                }
            // input type text and textare    
            } else {
                this.setState({
                    [nameInput]: value
                })
            }
        }

        renderSaleInput() {
            if(this.state.status == 2) {
                return (
                    <>
                        <input style={inputStyle} type="text" placeholder=""  name="sale" value={this.state.sale} onChange={this.handleUserInput}/> %
                    </>
                )
            }
            
        }
        
        handleSubmit(e) {
            e.preventDefault();

            let flag = true
            let name = this.state.name;
            let price = this.state.price;
            let category = this.state.category;
            let brand = this.state.brand;
            let status = this.state.status;
            let sale = this.state.sale;
            let company = this.state.company;
            let detail = this.state.detail;
            let avatar = this.state.avatar;
            let formErrors = this.state.formErrors;
            
            formErrors.name 
            = formErrors.price 
            = formErrors.category 
            = formErrors.company 
            = formErrors.detail 
            = formErrors.sale 
            = formErrors.avatar = "";


            if(!name) {
                flag = false;
                formErrors.name = "Vui long nhap name";
            }

            if(!price) {
                flag = false;
                formErrors.price = "Vui long nhap price";
            } else if(isNaN(price)) {
                flag = false;
                formErrors.price = "price is number";
            }

            if(!category) {
                flag = false;
                formErrors.category = "Vui long chon category";
            }

            if(!brand) {
                flag = false;
                formErrors.brand = "Vui long chon brand";
            }
            
            if(!company) {
                flag = false;
                formErrors.company = "Vui long nhap company";
            }
            if(!detail) {
                flag = false;
                formErrors.detail = "Vui long nhap detail";
            }
            
            if(status == 2 && !sale) {
                flag = false;
                formErrors.sale = "Vui long nhap sale";
            } 
            // edit
            if((avatar.length) > 5) {
                flag = false;
                formErrors.avatar = "avatar length > 5";
            }

            if(!flag) {
                this.setState({
                    formErrors: formErrors
                });
            } else { 
                let accessToken = this.state.userData.user.auth_token;
             
                let config = { 
                    headers: { 
                    'Authorization': 'Bearer '+ accessToken,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                    } 
                };
                let formData = new FormData();
                formData.append('name', this.state.name);
                formData.append('price', this.state.price);
                formData.append('category', this.state.category);
                formData.append('brand', this.state.brand);
                formData.append('company', this.state.company);
                formData.append('detail', this.state.detail);
                formData.append('status', this.state.status);
                formData.append('sale', this.state.sale);
                // let sale = 0;
                // if(this.state.sale) {
                //     sale = (this.state.price * this.state.sale) / 100
                //     formData.append('sale', sale);
                // }
               

                Object.keys(avatar).map((item, i) => {
                    formData.append("file[]", avatar[item]);
                });
                
                let parseIntId = Number(this.props.match.params.id)
                if(!parseIntId) {
                    API.post('user/add-product', formData, config)
                    .then(response => {
                        if(response.data.response === 'success') {
                            this.props.history.push('/account/product/list')
                        }else {
                            // this.setState({
                            //     formErrors: formErrors
                            // });
                        }
                    })
                    .catch(errors => {
                            //console.log(errors)
                    })
                } else {
                    let url = 'user/edit-product/' + this.props.match.params.id; 
                    //formData.append('avatarCheckBox[]', this.state.avatarCheckBox);
                    Object.keys(this.state.avatarCheckBox).map((item, i) => {
                        formData.append("avatarCheckBox[]", this.state.avatarCheckBox[item]);
                    });
                    API.post(url, formData, config)
                    .then(response => {
                        if(response.data.response === 'success') {
                            this.props.history.push('/account/product/list')
                        } else {
                            this.setState({
                                formErrors: response.data
                            });
                        }
                    })
                    .catch(errors => {
                            console.log(errors)
                    })
                }
            }

        }

      render () {
        return (
            <div className="col-sm-9">
                <div className="col-sm-12">
                    <div className="signup-form">
                        <h2>Create product!</h2>
                        <ErrorForm formErrors={this.state.formErrors} />

                        <form onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.handleUserInput}/>
                            <input type="text" placeholder="Price"  name="price" value={this.state.price} onChange={this.handleUserInput}/>
                            <select value={this.state.category} name="category" onChange={this.handleUserInput}>
                                <option value="">Please choose category</option>
                                {this.renderCategory()}
                            </select>
                            
                            <select value={this.state.brand} name="brand" onChange={this.handleUserInput}>
                                <option value="">Please choose brand</option>
                                {this.renderBrand()}
                            </select>
                            
                            <select value={this.state.status} name="status" onChange={this.handleUserInput}>
                                <option value="0">Please choose status</option>
                                <option value="1">New</option>
                                <option value="2">Sale</option>
                            </select>

                            {this.renderSaleInput()}

                            <input type="text" placeholder="Company profile"  name="company" value={this.state.company} onChange={this.handleUserInput}/>
                            <input type="file" name="avatar[]" onChange={this.handleUserInputFile} multiple/>
                            <div className="imgPreview">
                                <ul>
                                    {this.renderImage()}
                                </ul>
                            </div>
                            <textarea  value={this.state.detail} name="detail" placeholder="Detail" onChange={this.handleUserInput}></textarea>
                            
                            <button type="submit" className="btn btn-default">Signup</button>
                        </form>
                    </div>
                </div>
            </div>
     
        )
      }
    }
export default AddEdit