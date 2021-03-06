import React from 'react';
import BusinessCard from '../../../UI/BusinessCard/BusinessCard';
import KhozCarousel from '../../../UI/Carousel/Carousel';
import './FilteredBusiness.css';

const FilteredBusinesses = props => {
    
    let items = 
    props.items ? props.items.map(item => {
        return (
            <div className='business-item' key={item.id}>
                <BusinessCard business={item} />
            </div>
        )
    })
    : null
    return (
        items ?
        <div className='filtered_businesses'>
            <div className="heading">{props.title}</div>
            <KhozCarousel items={items} />
        </div>
        : null
    )
}

export default FilteredBusinesses;