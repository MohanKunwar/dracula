import React, { Component } from 'react';
import './Category.css';

import Axios from '../../../../services/Axios';
import Spinner from '../../../../components/common/Spinner';

class Category extends Component {
    state = {
        subCategories: null,
        hover: false,
        categoryItems: null
    }

    loadSubCategories(id) {
        this.setState({ hover: true });
        if (!this.state.subCategories) {
            Axios.instance.get(Axios.API.common.getCategoryUrl + id + '/children').then(response => {
                if (response.data.data.length > 0) {
                    this.setState({ subCategories: response.data.data });
                } else {
                    this.setState({subCategories: []})
                }
            });
        }
    }
    render() {
        let categoryItems = null;

        if (this.state.hover && this.state.subCategories && this.state.subCategories.length > 0) {
            categoryItems = this.state.subCategories.map((item, index) => {
                return (
                    <div className='sub-category-btn' key={index}>
                        <span>{item.name}</span>
                    </div>
                );
            })
        }
        return (
            <div className='category-btn' onMouseEnter={() => this.loadSubCategories(this.props.id)}
                onMouseLeave={() => this.setState({ hover: false })}>{this.props.name}
                {/* <i className="fa fa-chevron-right chevron_icon"></i> */}
                <div className='sub-categories'>
                   {categoryItems} 
                   {
                       this.state.hover && !this.state.subCategories
                       ? <Spinner />
                       : null
                   }
                </div>
                {/* implement popover component 
                    todo
                */}
            </div>
        );
    }
}
export default Category;