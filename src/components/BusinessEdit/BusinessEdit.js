import React, { Component } from 'react'
import Axios from '../../services/Axios'
import Spinner from '../../helpers/Spinner'

import OverviewEdit from './ProfileEdit/OverviewEdit'
import DealsInEdit from './ProfileEdit/DealsInEdit'
import PhotosEdit from './ProfileEdit/PhotosEdit'
import ProductsEdit from './ProfileEdit/ProductsEdit'
import ServicesEdit from './ProfileEdit/ServicesEdit'
import Settings from './ProfileEdit/Settings'
import HotelEdits from './HotelEdit'

import './BusinessEdit.css'

class BusinessEdit extends Component {
    state = {
        tab: 'Overview',
        dealsIn: null,
        products: null,
        photos: null,
        hotel: {

        }
    }

    tabs = ['Overview', 'Photos', 'Products', 'Services', 'Deals In']

    componentWillMount() {
        if (this.props.businessUrl) {
            this.getBusiness()
            this.getTopLevelCategories()
        }
    }
    getBusiness() {
        Axios.authInstance.get(Axios.API.business.getBusinessUrl(this.props.businessUrl)).then(response => {
            if (response && response.data) {
                if (response.data.data.feature_enabled.includes('hotel')) {
                    this.tabs.push('Manage Hotel')
                }
                // put settings at end on tab list
                this.tabs.push('Settings')
                this.setState({
                    business: response.data.data
                })
                document.title = `Edit-${response.data.data.name}`
                console.log(response.data.data)
            }
        })
    }
    // reload business page while switching from one business view to edit business view'
    componentWillReceiveProps(nextProps) {
        if (this.props.businessUrl !== nextProps.businessUrl) {
            this.getBusiness(nextProps.businessUrl)
        }
    }
    getDealsIn() {
        if (!this.state.dealsIn && !this.state.topLevelCategories) {
            Axios.authInstance.get(Axios.API.common.topLevelCategoriesUrl).then((res) => {
                if(res && res.data){
                    this.setState({topLevelCategories: res.data.data})
                }
            })
            Axios.authInstance.get(Axios.API.businessEdit.getDealsInUrl(this.state.business.slug)).then(response => {
                if (response && response.data) {
                    this.setState({ dealsIn: response.data.data })
                }
            })
        }
    }

    getProducts = () => {
        if (!this.state.products) {
            Axios.authInstance.get(Axios.API.business.getBusinessProductsUrl(this.state.business.slug)).then(response => {
                if (response && response.data) {
                    response.data.data.map(product => product.business = this.state.business)
                    this.setState({ products: response.data.data })
                }
            })
        }
    }
    getTopLevelCategories() {
        if (!this.state.topLevelCategories) {
            Axios.authInstance.get(Axios.API.common.topLevelCategoriesUrl).then(response => {
                if (response && response.data) {
                    this.setState({topLevelCategories: response.data.data})
                }
            })
        }
    }
    update = tab => {
        switch (tab) {
            case 'photos': {
                this.getPhotos('update')
                break
            }
            case 'settings': {
                this.getUsers('update')
                break
            }
            default: {
                break
            }
        }
    }
    getPhotos(update) {
        if (update || !this.state.photos) {
            Axios.authInstance.get(this.state.business.photos_url).then(response => {
                console.log(response)
                if (response && response.data) {
                    console.log(response.data.data)
                    this.setState({ photos: response.data.data })
                }
            })
        }
    }
    getUsers = update => {
        if (update || !this.state.users) {
            Axios.authInstance.get(Axios.API.businessEdit.getUsersUrl(this.state.business.slug)).then(response => {
                if (response && response.data) {
                    this.setState({users: response.data.data})
                }
            })
        }
    }
    changeTab = (e, tab) => {
        e.preventDefault()
        this.setState({ tab: tab })
        // this.tab.validate
        // integrate next button as well
    }
    render() {
        let activeTab
        switch (this.state.tab) {
            case 'Overview': default: {
                activeTab = <OverviewEdit 
                business={this.state.business}
                topLevelCategories={this.state.topLevelCategories}
                update={this.getBusiness.bind(this)} />
                break
            }
            case 'Photos': {
                this.getPhotos()
                activeTab = <PhotosEdit photos={this.state.photos} businessSlug={this.props.businessUrl} update={this.update}/>
                break
            }
            case 'Products': {
                this.getProducts()
                activeTab = <ProductsEdit products={this.state.products} businessSlug={this.props.businessUrl} business={this.state.business} />
                break
            }
            case 'Services': {
                activeTab = <ServicesEdit />
                break
            }
            case 'Deals In': {
                this.getDealsIn()
                activeTab = <DealsInEdit topLevelCategories= {this.state.topLevelCategories} dealsIn={this.state.dealsIn} />
                break
            }
            case 'Manage Hotel': {
                activeTab = <HotelEdits business={this.state.business} />
                break
            }
            case 'Settings': {
                // this.getUsers()
                activeTab = <Settings business={this.state.business} update={this.update} users={this.state.users}/>
                break
            }
        }
        return (
            this.state.business ?
                <div className='business_edit_container card-container'>
                    <div className='business_edit_tabs'>
                        {
                            this.tabs.map((tab, index) =>
                                <span
                                    className={`business_edit_tab ${this.state.tab === tab ? 'active' : ''}`}
                                    onClick={e => this.changeTab(e, tab)}
                                    key={index}>
                                    {tab}
                                </span>
                            )
                        }
                    </div>
                    {activeTab}
                </div>
                : <Spinner />
        )
    }

}


export default BusinessEdit
